import axios from "axios";
import { UsersInterface } from "../../../interfaces/IUsers";
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
async function UpdateAdminById(id: string, data: UsersInterface) {

    return await axios
        .patch(`${apiUrl}/admin/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function GetAdminById(id: string) {

    return await axios
        .get(`${apiUrl}/admin/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

export {
    GetAdminById,
    UpdateAdminById
};