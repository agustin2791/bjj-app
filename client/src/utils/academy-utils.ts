import api from "../axios";
import { Academy, User } from "./types_interfaces";

export const createNewAcademy = async <T>(academy: Academy, user: User): Promise<T> => {
    const new_demy = await api.post('/academy/create_academy', {data: academy, user: user})
        .then((res) => {
            return res.data
        }).catch((e) => {
            console.log(e)
            return
        })
    return new_demy
}