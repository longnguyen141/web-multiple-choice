import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { axiosUser } from '../../API/userAxios';

const ResetPassword = () => {
    const { token } = useParams();

    useEffect(() => {
        if (token) {
            const resetPassword = async () => {
                try {
                    const res = await axios.post('/user/reset', { "password": "123123" }, {
                        headers: {
                            Authorization: token
                        }
                    });
                    toast.success(res.data.msg);
                } catch (error) {
                    error.response.data.msg && toast.error(error.response.data.msg);
                }
            }
            resetPassword()
        }
    }, [token])

    return (
        <div>
        </div>
    )
}

export default ResetPassword
