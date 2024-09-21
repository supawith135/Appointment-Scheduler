import { StatusesInterface } from "./IStatuses";
import { TimeSlotsInterface } from "./ITimeSlots";
import { UsersInterface } from "./IUsers";


export interface BookingsInterface {
    ID?: number;
    reason?: string;
	
    status_id?: number;
    status?: StatusesInterface;

    time_slot_id?: number;
    time_slot?: TimeSlotsInterface;

    comment?: string;
    
    user_id?: number;
    user?: UsersInterface;
}