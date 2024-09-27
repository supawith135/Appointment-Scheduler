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

async function GetTeacherStudentByUserName(user_name: string) {

    return await axios
        .get(`${apiUrl}/teacher/studentDetail/${user_name}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
export {
    GetTeacherStudentByUserName

};