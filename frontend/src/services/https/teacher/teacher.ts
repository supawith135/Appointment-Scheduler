import axios from "axios";

const apiUrl = "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");


const requestOptions = {

    headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function GetTeachersList() {

    return await axios
        .get(`${apiUrl}/techer`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetTeacherById(id: string) {

    return await axios
        .get(`${apiUrl}/techer/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}


export {
    GetTeachersList,
    GetTeacherById,
};