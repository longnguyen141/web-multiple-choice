import axios from 'axios'
export const axiosResultRoom = axios.create({
    baseURL: '/resultRoom',
    headers: {
        'content-type': 'application/json'
    },
})
//Xử lý data trước khi truyến xuống
axiosResultRoom.interceptors.request.use((config) => {
    return config;
}, err => {
    return Promise.reject(err)
})