import axios from 'axios';
export const axiosRoom = axios.create({
    baseURL: '/rooms',
    headers: {
        'content-type': 'application/json'
    },
})



//Xử lý data trước khi truyến xuống
axiosRoom.interceptors.request.use((config) => {

    return config;
}, err => {
    return Promise.reject(err)
})