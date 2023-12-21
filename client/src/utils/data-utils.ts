import api from './../axios'
import { AxiosResponse, AxiosError } from 'axios'
export const getData = async <T>(
    url: string,
    username: string,
    password: string
)
: Promise<T> => {
    return await api.post(url, {username, password}).then((res: AxiosResponse) => {
        const body = res.data
        console.log('login body ', body)
        localStorage.setItem('accessToken', body.token)
        localStorage.setItem('refreshToken', body.refresh_token)

        let user = body.user
        delete user.password
        localStorage.setItem('user', JSON.stringify(user))
        return body
    }).catch((e: AxiosError) => {
        console.log(e)
        throw e
    })
}

export const registerUser = async <T>(
    url: string,
    username: string,
    email: string,
    password: string
)
: Promise<T> => {
    const res = await fetch(url, {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password})
    });

    return await res.json()
}