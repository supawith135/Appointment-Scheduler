import { UsersInterface } from "./IUsers";

export interface TimeSlotsInterface {
    ID?: number;
    user_id?: number;
    user?: UsersInterface;
    slot_date?: string;
    slot_start_time?: string;
    slot_end_time?: string;
    location?: string;
    title?: string;
    is_available?: boolean;
}