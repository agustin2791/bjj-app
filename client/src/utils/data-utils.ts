export const getData = async <T>(
    url: string,
    username: string,
    password: string
)
: Promise<T> => {
    const res = await fetch(url, {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });

    return await res.json()
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