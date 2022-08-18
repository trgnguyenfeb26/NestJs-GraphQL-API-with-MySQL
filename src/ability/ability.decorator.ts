import { SetMetadata } from "@nestjs/common";
import { User } from "src/users/entity/user.entity";
import { Action, Subjects } from "./ability.factory";


export interface RequiredRule {
    action: Action;
    subject: Subjects;
}
export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...requirements: RequiredRule[]) => SetMetadata(CHECK_ABILITY, requirements)
export class ReadUserAbility implements RequiredRule {
    action: Action.Read;
    subject: User;
}