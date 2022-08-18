import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "../users/entity/user.entity";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
    defineAbility(user: User) {
        const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);
        if (user.isAdmin) {
            can(Action.Manage, 'all');
        } else {
            can(Action.Read, User);
            cannot(Action.Create, User).because('only admin!!')
            cannot(Action.Delete, User).because('only admin!!')
            cannot(Action.Update, User).because('only admin!!')
        }
        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}
