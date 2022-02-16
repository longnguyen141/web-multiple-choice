import axios from 'axios'
export const axiosExam = axios.create({
    baseURL: '/exam',
    headers: {
        'content-type': 'application/json'
    },
})
//Xử lý data trước khi truyến xuống
axiosExam.interceptors.request.use((config) => {
    return config;
}, err => {
    return Promise.reject(err)
})