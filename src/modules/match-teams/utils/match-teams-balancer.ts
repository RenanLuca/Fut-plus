import { Position, Rank } from "../../../../generated/prisma/client";

export type ConfirmedMemberForBalancing = {
  userId: string | null;
  guestUserId: string | null;
  rank: Rank | null;
  position: Position;
};

export type TeamPlayerAssignment = {
  userId?: string;
  guestUserId?: string;
};

const RANK_WEIGHT: Record<Rank, number> = {
  BRASILEIRAO: 1,
  CHAMPIONS_LEAGUE: 2,
  BALLON_DOR: 3,
};

/**
 * Distributes confirmed players into `teamCount` teams, attempting to
 * balance by position and rank: groups by position, sorts each group
 * from highest to lowest rank, and distributes in "snake draft"
 * (1,2,3 | 3,2,1 | 1,2,3 | ...) to avoid stacking the best players on the same team.
 */
export function balanceMembersIntoTeams(
  members: ConfirmedMemberForBalancing[],
  teamCount: number,
): TeamPlayerAssignment[][] {
  const teams: TeamPlayerAssignment[][] = Array.from(
    { length: teamCount },
    () => [],
  );

  const membersByPosition = new Map<
    Position,
    ConfirmedMemberForBalancing[]
  >();
  for (const member of members) {
    const group = membersByPosition.get(member.position) ?? [];
    group.push(member);
    membersByPosition.set(member.position, group);
  }

  for (const group of membersByPosition.values()) {
    group.sort(
      (a, b) =>
        (b.rank ? RANK_WEIGHT[b.rank] : 0) -
        (a.rank ? RANK_WEIGHT[a.rank] : 0),
    );

    let index = 0;
    let round = 0;
    while (index < group.length) {
      const teamOrder = Array.from({ length: teamCount }, (_, i) => i);
      if (round % 2 === 1) {
        teamOrder.reverse();
      }
      for (const teamIndex of teamOrder) {
        if (index >= group.length) break;
        const member = group[index];
        teams[teamIndex].push({
          userId: member.userId ?? undefined,
          guestUserId: member.guestUserId ?? undefined,
        });
        index++;
      }
      round++;
    }
  }

  return teams;
}
