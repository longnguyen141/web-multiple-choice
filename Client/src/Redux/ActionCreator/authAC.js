import { axiosUser } from '../../API/userAxios'

export const Login = () => ({
    type: "LOGIN"
})
export const GET_TOKEN = (token) => ({
    type: "GET_TOKEN",
    payload: token
})

export const fetchUser = async (token) => {
    const res = await axiosUser.get('/info', {
        headers: { Authorization: token }
    })
    return res;
}

export const GET_USER = (res) => {
    return {
        type: "GET_USER",
        payload: {
            user: res.data,
            isAdmin: res.data?.role === 1 ? true : false,
        }
    }
}

export const LOGOUT = () => {
    return {
        type: "LOG_OUT",
    }
}
export const LOAD_PAGE = () => {
    return {
        type: "LOAD_PAGE",
    }
}