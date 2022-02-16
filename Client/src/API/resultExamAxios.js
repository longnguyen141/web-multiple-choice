import axios from 'axios'
export const axiosResult = axios.create({
    baseURL: '/resultExam',
    headers: {
        'content-type': 'application/json'
    },
})
//Xử lý data trước khi truyến xuống
axiosResult.interceptors.request.use((config) => {
    return config;
}, err => {
    return Promise.reject(err)
})