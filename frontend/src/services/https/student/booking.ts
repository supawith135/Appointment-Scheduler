import axios from "axios";

const apiUrl = "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

import { UsersInterface } from "../../../interfaces/IUsers";
import { BookingsInterface } from "../../../interfaces/IBookings";
const requestOptions = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function GetListBookingAdvisor(id: string) {

    return await axios
        .get(`${apiUrl}/student/bookingAdvisor/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetBookingByStudentID(id: String) {

    return await axios
        .get(`${apiUrl}/student/bookingStudent/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function CreateBooking(data: BookingsInterface) {

    return await axios
        .post(`${apiUrl}/student/booking`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateStudentById(id: string, data: UsersInterface) {

    return await axios
        .put(`${apiUrl}/student/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function DeleteBookingById(id: string) {

    return await axios
        .delete(`${apiUrl}/student/booking/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
export {
    GetListBookingAdvisor,
    GetBookingByStudentID,
    CreateBooking,
    UpdateStudentById,
    DeleteBookingById
};