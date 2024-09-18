import { StatusesInterface } from "./IStatuses";
import { TimeSlotsInterface } from "./ITimeSlots";
import { UsersInterface } from "./IUsers";

export interface BookingsInterface{
    ID?: number;

    booking_date?: Date;
	booking_time?: Date;

	status_id?: number;
	status?: StatusesInterface;

	time_slot_id?: number;
	timeSlot?: TimeSlotsInterface;

	user_id?: number;
	user?: UsersInterface;
}