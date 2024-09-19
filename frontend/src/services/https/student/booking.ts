import axios from "axios";

const apiUrl = "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

import { UsersInterface } from "../../../interfaces/IUsers";

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
        .get(`${apiUrl}/student/booking/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
//ได้ใช้
// async function GetBookingByStudentIDSS(id: String) {
//     const requestOptions = {
//       method: "GET",
//       headers: {
//         Authorization: `${Bearer} ${Authorization}`,
//       },
//     };
  
//     let res = await fetch(`${apiUrl}/student/bookingAdvisor/${id}`, requestOptions)
//       .then((response) => response.json())
//       .then((res) => {
//         if (res.data) {
//           return res.data;
//         } else {
//           return false;
//         }
//       });
//     return res;
//   }
async function UpdateStudentById(id: string, data: UsersInterface) {

    return await axios
        .put(`${apiUrl}/student/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

export {
    GetListBookingAdvisor,
    // GetBookingByStudentIDSS,
    GetBookingByStudentID,
    UpdateStudentById,
};