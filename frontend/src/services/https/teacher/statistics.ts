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

async function GetTeacherStatisticsById(id: String) {

    return await axios
        .get(`${apiUrl}/teacher/statisticalData/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

export {
    GetTeacherStatisticsById,

};