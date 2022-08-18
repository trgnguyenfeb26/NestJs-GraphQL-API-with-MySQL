import { ForbiddenError } from "@casl/ability";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CHECK_ABILITY, RequiredRule } from "./ability.decorator";
import { AbilityFactory } from "./ability.factory";

@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules =
            this.reflector.getAllAndOverride<RequiredRule[]>(
                CHECK_ABILITY, [context.getHandler(),
                context.getClass(),]

            ) || [];

        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;
        const ability = this.caslAbilityFactory.defineAbility(user);

        try {
            return rules.every((rule) => ability.can(rule.action, rule.subject));
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message)
            }
        }
    }
}