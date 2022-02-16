import axios from 'axios'
export const axiosUser = axios.create({
    baseURL: '/user',
    headers: {
        'content-type': 'application/json'
    },
})
// Xử lý data trước khi truyến xuống
axiosUser.interceptors.request.use((config) => {
    return config;
}, err => {
    return Promise.reject(err)
})