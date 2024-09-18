import { PositionsInterface } from "./IPositions";
import { RolesInterface } from "./IRoles";
import { GendersInterface } from "./IGenders";
export interface UsersInterface {
    ID? : number;
    
    position_id?: number;
    position?: PositionsInterface;

    full_name?: string;

    role_id?: number;
    role?: RolesInterface;

    advisor_id?: number;
    advisor?: UsersInterface;

    email?: string;
    user_name?: string;
    password?: string;

    gender_id?: number;
    gender?: GendersInterface;

}