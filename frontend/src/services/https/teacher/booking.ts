import axios from "axios";
import { TimeSlotsInterface } from "../../../interfaces/ITimeSlots";
const apiUrl = process.env.NODE_ENV === 'production' 
    ? "https://appointment-scheduler-mrls.onrender.com" 
    : "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");


const requestOptions = {

    headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function CreateBookingTeacher(data: TimeSlotsInterface) {

    return await axios
        .post(`${apiUrl}/teacher/createBookingTeacher`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);

}
export {
    CreateBookingTeacher,

};