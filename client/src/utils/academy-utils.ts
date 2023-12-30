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

export const getAcademyDetails = async <T>(academy_slug: string, user: User): Promise<T> => {
    const academy_details = await api.post('/academy/get_academy', {data: {academy_slug}, user: user})
        .then((res) => {
            return res.data
        })
        .catch((e) => {
            console.log(e)
            return
        })

    return academy_details
}

export const getAcademyList = async <T>(academySearch: string[]): Promise<T> => {
    const academy_list = await api.post('/maps/academy_list', {data: academySearch})
        .then((res) => {
            return res.data
        })
        .catch((err) => console.log(err))
    return academy_list
}

export const updateAcademyDetails = async <T>(updates: Academy): Promise<T> => {
    const academy_data = await api.post('/academy/update_academy', {data: {academy_id: updates._id, updates: updates}})
        .then((res) => {return res.data})
        .catch((err) => console.log(err))
    return academy_data
}