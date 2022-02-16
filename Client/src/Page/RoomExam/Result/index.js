import React, { useEffect, useState } from 'react'
import Header from '../../../Components/Header'
import Footer from '../../../Components/Footer'
import MainResult from './MainResult'
import { Container } from 'reactstrap'
import { Spin } from 'antd'
import { AuthActionCreator } from '../../../Redux/ActionCreator'
import { useDispatch, useSelector } from 'react-redux'

const ResultExam = () => {
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
        <>
            <Header />
            <Container>
            <div className='body__content'>
                <MainResult />
            </div>
            </Container>
            <Footer />
        </>
    )
}

export default ResultExam
