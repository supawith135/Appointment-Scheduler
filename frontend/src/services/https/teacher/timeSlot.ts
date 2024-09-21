import axios from "axios";

const apiUrl = "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

import { TimeSlotsInterface } from "../../../interfaces/ITimeSlots";
const requestOptions = {

    headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function GetListTimeSlots() {

    return await axios
        .get(`${apiUrl}/teacher`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetTimeSlotById(id: string) {

    return await axios
        .get(`${apiUrl}/teacher/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function CreateTimeSlot(data: TimeSlotsInterface) {

    return await axios
        .post(`${apiUrl}/teacher/timeslot`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateTimeSlotById(id: string, data: TimeSlotsInterface) {

    return await axios
        .put(`${apiUrl}/teacher/timeslot${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function DeleteTimeSlotById(id: string) {

    return await axios
        .delete(`${apiUrl}/user/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
export {
    GetListTimeSlots,
    GetTimeSlotById,
    CreateTimeSlot,
    UpdateTimeSlotById,
    DeleteTimeSlotById,
};