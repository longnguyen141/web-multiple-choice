import React, { useEffect, useState } from 'react'
import Header from '../../../Components/Header'
import Footer from '../../../Components/Footer'
import { Container } from 'reactstrap'
import MainTakeExam from './MainTakeExam'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActionCreator } from '../../../Redux/ActionCreator'
import { Spin } from 'antd'

const TakeExam = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const auth = useSelector(state => state.auth);
    useEffect(() => {
        setTimeout(async () => {
            await setLoading(false)
            await dispatch(AuthActionCreator.LOAD_PAGE())
        }, 1800)
        return () => setLoading(false);
    }, [dispatch, auth])

    return loading ? <Spin /> : (
        <div className="containerTakeExam">
            <Header />
            <Container >
                <div className='body__content'>
                    <MainTakeExam />
                </div>
            </Container>
            <Footer />
        </div>
    )
}

export default TakeExam
