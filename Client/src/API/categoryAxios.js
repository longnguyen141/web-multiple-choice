import axios from 'axios'
export const axiosCategory = axios.create({
    baseURL: '/tags',
    headers: {
        'content-type': 'application/json'
    },
})

//Xử lý data trước khi truyến xuống
axiosCategory.interceptors.request.use((config) => {
    return config;
}, err => {
    return Promise.reject(err)
})