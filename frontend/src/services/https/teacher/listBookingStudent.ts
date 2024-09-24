import axios from "axios";
import { BookingsInterface } from "../../../interfaces/IBookings";

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

async function GetBookingStudentListByAdvisorID(id: String) {

    return await axios
        .get(`${apiUrl}/teacher/booking/student/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function UpdateBookingStudentById(id :string, data: BookingsInterface) {

    return await axios
  
      .patch(`${apiUrl}/teacher/booking/student/${id}`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  
}

export {
    GetBookingStudentListByAdvisorID,
    UpdateBookingStudentById
};