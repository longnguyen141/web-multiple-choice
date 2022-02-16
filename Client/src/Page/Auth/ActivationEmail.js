import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify';
import axios from 'axios';
import { axiosUser } from '../../API/userAxios';

const ActivationEmail = () => {
    const { activation_token } = useParams();

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    const res = await axiosUser.post('/activation', { activation_token });
                    toast.success(res.data.msg);
                } catch (error) {
                    error.response.data.msg && toast.error(error.response.data.msg);
                }
            }
            activationEmail()
        }
    }, [activation_token])

    return (
        <div>
        </div>
    )
}

export default ActivationEmail
