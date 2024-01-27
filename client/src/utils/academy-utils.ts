import api from "../axios";
import { Academy, AcademyClass, User } from "./types_interfaces";

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
    console.log('getting academy')
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

export const getAcademyClasses = async <T>(academy_id: string): Promise<T> => {
    const academy_classes = await api.post('/academy/get_academy_classes', {academy_id})
        .then((res) => {return res.data})
        .catch((err) => console.log(err))

    return academy_classes
}

export const createAcademyClass = async <T>(details: AcademyClass, academy_id: string): Promise<T> => {
    const class_data = await api.post('/academy/create_class', {class_details: details, academy_id})
        .then((res) => {return res.data})
        .catch((err) => console.log(err))
    return class_data
}

export const updateAcademyClass = async  <T>(details: AcademyClass, user: User): Promise<T> => {
    const class_data = await api.post('/academy/update_class', {academy_details: details, user})
        .then((res) => {return res.data})
        .catch((err) => console.log(err))
    return class_data
}

export const deleteAcademyClass = async <T>(details: AcademyClass, user: User): Promise<T> => {
    const class_delete = await api.post('/academy/delete_class', {class_id: details._id, user})
        .then((res) => {return res.data})
        .catch((err) => console.log(err))

    return class_delete
}

export const getAcademyFullSchedule = async <T>(list: string[]): Promise<T> => {
    const list_data = await api.post('/academy/get_full_schedule', {class_list: list})
        .then(res => {return res.data})
        .catch(e => console.log(e))
    
    return list_data
}
export const getAcademyClassSchedule = async <T>(details: AcademyClass, user: User): Promise<T> => {
    const scheduleDetails = await api.post('/academy/get_class_schedule', {class_id: details._id, user})
        .then(res => {return res.data})

    return scheduleDetails
}

export const updateAcademyClassSchedule = async <T>(details: any, user: User): Promise<T> => {
    const class_data = await api.post('/academy/update_class_schedule', {schedule_id: details._id, details, user})
        .then((res) => { return res.data })
        .catch((err) => console.log(err))

    return class_data
}

// Instructors
export const getAcademyInstructors = async <T>(academy_id: string): Promise<T> => {
    const instructors = await api.post('/academy/get_instructors', {data: academy_id})
        .then((res) => {return res.data.map((c: any) => {return {...c, classes: c.academy_classes}})})
        .catch((err) => console.log(err))
    return instructors
}

export const createAcademyInstructor = async <T>(details: any, user: User): Promise<T> => {
    const instructor = await api.post('/academy/create_instructor', {data: details, user: user})
        .then((res) => {
            let data = res.data
            data['classes'] = data.academy_classes
            return data
        })
        .catch((err) => console.log(err))
    
    return instructor
}

export const updateAcademyInstructor = async <T>(details: any, user: User): Promise<T> => {
    const instructor = await api.post('/academy/update_instructor', {data: details, user})
        .then((res) => {
            let data = res.data
            data['classes'] = data.academy_classes
            return data
        })
        .catch((err) => console.log(err))
    return instructor
}

export const deleteAcademyInstructor = async <T>(details: any, user: User): Promise<T> => {
    const instructor = await api.post('/academy/delete_instructor', {data: details, user})
        .then((res) => {return res.data})
        .catch((err) => console.log(err))

    return instructor
}