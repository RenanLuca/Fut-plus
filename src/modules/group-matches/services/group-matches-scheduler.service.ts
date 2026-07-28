import {
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FrequencyType } from "@src/shared/enum/FrequencyType";
import { Weekday } from "@src/shared/enum/weekday";
import { GroupMatchesService } from "./group-matches.service";
import { GroupsService } from "@src/modules/groups/services/groups.service";
import {
  BRAZIL_UTC_OFFSET_HOURS,
  getBrazilCalendarDate,
} from "@src/shared/utils/brazil-date";

const WEEKDAY_BY_JS_DAY: Weekday[] = [
  Weekday.SUNDAY,
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
];

const MINIMUM_DAYS_BEFORE_MATCH_TO_GENERATE = 5;

@Injectable()
export class GroupMatchesSchedulerService {
  private readonly logger = new Logger(
    GroupMatchesSchedulerService.name,
  );

  constructor(
    private readonly groupsService: GroupsService,
    private readonly groupMatchesService: GroupMatchesService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: "America/Sao_Paulo",
  })
  async generateUpcomingMatches() {
    const todayInBrazil = getBrazilCalendarDate(new Date());
    const targetDate = new Date(todayInBrazil);
    targetDate.setUTCDate(
      targetDate.getUTCDate() +
        MINIMUM_DAYS_BEFORE_MATCH_TO_GENERATE,
    );
    const targetWeekday =
      WEEKDAY_BY_JS_DAY[targetDate.getUTCDay()];

    const monthlyGroups =
      await this.groupsService.findAllByFrequency(
        FrequencyType.MONTHLY,
      );
    const groupsForTargetDate = monthlyGroups.filter(
      (group) => group.weekday === targetWeekday,
    );

    await Promise.all(
      groupsForTargetDate.map((group) =>
        this.generateMatchForGroup(
          group.id,
          group.hour,
          targetDate,
        ),
      ),
    );
  }

  private async generateMatchForGroup(
    groupId: string,
    hour: string,
    targetDateInBrazil: Date,
  ) {
    const [hours, minutes] = hour.split(":").map(Number);
    const matchDateUtc = new Date(
      Date.UTC(
        targetDateInBrazil.getUTCFullYear(),
        targetDateInBrazil.getUTCMonth(),
        targetDateInBrazil.getUTCDate(),
        hours + BRAZIL_UTC_OFFSET_HOURS,
        minutes,
        0,
        0,
      ),
    );

    try {
      await this.groupMatchesService.create(groupId, {
        matchDate: matchDateUtc.toISOString(),
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return;
      }
      this.logger.error(
        `Failed to auto-generate match for group ${groupId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
