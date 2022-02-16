import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Container } from 'reactstrap'
import Footer from '../../Components/Footer'
import Header from '../../Components/Header'
import { AuthActionCreator } from '../../Redux/ActionCreator'
import MainRoom from './MainRoom'

const RoomExam = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(async () => {
            await setLoading(false)
            await dispatch(AuthActionCreator.LOAD_PAGE())
        }, 1800)
        return () => setLoading(false);
    }, [dispatch])
    return loading ? <Spin /> : (
        <>
            <Header />
            <Container>
                <MainRoom />
            </Container>
            <Footer />
        </>
    )
}

export default RoomExam
