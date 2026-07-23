import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

export const ActiveUserId = createParamDecorator<undefined>((data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.userId;
    if (!userId) {
        throw new UnauthorizedException('Unauthorized');
    }
    return userId;
})
