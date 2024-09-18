import axios from "axios";

const apiUrl = "http://localhost:8080";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

import { LogInInterface } from "../../../interfaces/ILogIn";

const requestOptions = {

    headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function LogIn(data: LogInInterface) {

    return await axios
        .post(`${apiUrl}/`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

export { LogIn };