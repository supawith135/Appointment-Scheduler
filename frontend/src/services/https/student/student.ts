import axios from "axios";

const apiUrl = process.env.NODE_ENV === 'production' 
    ? "https://appointment-scheduler-mrls.onrender.com" 
    : "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

import { UsersInterface } from "../../../interfaces/IUsers";

const requestOptions = {

    headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function GetStudentsList() {
    return await axios
        .get(`${apiUrl}/student`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetStudentById(id: string) {

    return await axios
        .get(`${apiUrl}/student/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateStudentById(id: string, data: UsersInterface) {

    return await axios
        .patch(`${apiUrl}/student/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function GetTeachersList() {

    return await axios
        .get(`${apiUrl}/student/teacher`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function GetStudentTeacherById(id: string) {

    return await axios
        .get(`${apiUrl}/student/teacherDetail/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

export {
    GetStudentsList,
    GetStudentById,
    UpdateStudentById,
    GetTeachersList,
    GetStudentTeacherById
};