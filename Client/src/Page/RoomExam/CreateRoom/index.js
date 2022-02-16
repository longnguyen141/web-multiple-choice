import React, { useEffect, useState } from 'react'
import { Container } from 'reactstrap'
import MainCreateRoom from './MainCreateRoom'
import Header from '../../../Components/Header'
import Footer from '../../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { axiosRoom } from '../../../API/roomAxios'
import { useParams, useHistory } from 'react-router-dom'

import { AuthActionCreator } from '../../../Redux/ActionCreator'
import { Spin } from 'antd'

const CreateRoom = () => {
    const dispatch = useDispatch();
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const history = useHistory()
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    useEffect(() => {
        setTimeout(async () => {
            await setLoading(false)
            await dispatch(AuthActionCreator.LOAD_PAGE())
        }, 1800)
        return () => setLoading(false);
    }, [dispatch])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await setLoading(true)
    //         const res = await axiosRoom.get(`/infoRoom/${id}`, {
    //             headers: {
    //                 Authorization: token,
    //             }
    //         })
    //         if (res.data.idUser !== auth.user._id) return history.push('/notfound');
    //         await setLoading(false)
    //     }
    //     fetchData()
    //     return () => fetchData()
    // }, [token, auth.user, id, history])
    return loading ? <Spin /> : (
        <>
            <Header />
            <Container>
                <div className='body__content'>
                    <MainCreateRoom />
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default CreateRoom
