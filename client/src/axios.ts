import axios, {AxiosRequestConfig} from "axios";


const env = {
    local: 'http://localhost:8000'
}
const api = axios.create({
    baseURL: env['local'],
    headers: {
        'Content-Type': 'application/json'
    }
})
const updateToken = () => {
    let refresh_token = localStorage.getItem('refreshToken')
    console.log('getting refresh token', refresh_token)
    return api.post('/auth/refresh-token/', {refresh_token: refresh_token})
        .then((response) => {
            let new_token = response.data.token
            let new_refresh = response.data.refresh_token
            localStorage.setItem('accessToken', new_token)
            localStorage.setItem('refreshToken', new_refresh)
            api.defaults.headers.common['Authorization'] = `Bearer ${new_token}`
            return new_token
        })
        .catch((err) => {
            console.log(err)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        })
}

const checkForToken = () => {
    if (localStorage.token) return localStorage.token
}

const token = checkForToken()

api.interceptors.request.use(function (config) {
    if (!config.headers?.Authorization) {
        if (localStorage.accessToken) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
        }
    }
    return config
})

api.interceptors.response.use(
    async response => {return response},
    async error => {
        if (!error.response) return Promise.reject(error)
        // if (error.response.status === 502) {
        //     window.location.href = '/login'
        //     return Promise.reject(error)
        // }
        if (error.response.status === 401) {
            if (error.response.data?.details) {
                console.log(error.response.data.detail)
            }
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            } else {
                updateToken()
            }

            const original_request = error.config
            let updated_response
            await updateToken().then((token) => {
                if (!token) throw new Error('No updated token')
                if (original_request.url.includes('login')) throw new Error('No good response')
                original_request.headers['Authorization'] = `Bearer ${token}`
                return api(original_request)
            }).then((response) => {
                updated_response = response
                console.log(response)
            }).catch((error) => {
                updated_response = error
                window.location.href = '/'
            })

            return updated_response ? Promise.resolve(updated_response) : Promise.reject(updated_response)
        } else {
            return Promise.reject(error)
        }
    }
)

export default api;