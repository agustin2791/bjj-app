import api from './../axios'
import { AxiosResponse, AxiosError } from 'axios'
import { Profile, User } from './types_interfaces'

export const getProfile = async <T>(username: string): Promise<T> => {
    const profile = api.post('/profile/get_profile', {user: username})
        .then((res) => {
            return res.data
        })
        .catch((err) => console.log(err))
    return profile
}

export const updateProfileDetails = async <T>(username: string, updates: Profile): Promise<T> => {
    const data = api.post('/profile/update_profile', {username, updates})
        .then((res) => {
            return res.data
        })
        .catch((err) => console.log(err))
    
    return data
}

export const updateProfileImage = async <T>(formdata: FormData): Promise<T> => {
    const upload = api.post('/profile/update_image', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then((res) => {
            return res.data
        })
        .catch((err) => console.log(err))
    return upload
}

export const getProfileAvailableBelts = async <T>(): Promise<T> => {
    const belts = api.post('/profile/get_belt_ranks', {})
        .then((res) => {return res.data})
        .catch((err) => console.log(err))

    return belts
}