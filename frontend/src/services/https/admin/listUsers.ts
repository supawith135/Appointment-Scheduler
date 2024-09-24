import axios from "axios";

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
// Stusent
async function GetStudentsList() {

    return await axios
        .get(`${apiUrl}/admin/student`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetStudentById(id: string) {

    return await axios
        .get(`${apiUrl}/admin/student/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

// Stusent
async function GetTeachersList() {

    return await axios
        .get(`${apiUrl}/admin/teacher`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetTeacherById(id: string) {

    return await axios
        .get(`${apiUrl}/admin/teacher/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}// Stusent
async function GetListTimeSlots() {

    return await axios
        .get(`${apiUrl}/admin/timeslot`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetTimeSlotById(id: string) {

    return await axios
        .get(`${apiUrl}/admin/timeslot/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
export {
    GetStudentsList,
    GetStudentById,
    GetTeachersList,
    GetTeacherById,
    GetListTimeSlots,
    GetTimeSlotById,
};