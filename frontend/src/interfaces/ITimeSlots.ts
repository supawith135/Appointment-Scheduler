import { UsersInterface } from "./IUsers";

export interface TimeSlotsInterface {
    ID?: number;

    user_id?: number;
    user?: UsersInterface;

    slot_date?:  Date;
	slot_start_time?: Date
	slot_end_time?: Date
	location?: string; 
	title?: string;
	is_available?: boolean;
}