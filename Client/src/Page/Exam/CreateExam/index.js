import React, { useEffect, useState } from 'react'
import Header from '../../../Components/Header'
import Footer from '../../../Components/Footer'
import MainCreate from './MainCreate'
import { Container } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { AuthActionCreator } from '../../../Redux/ActionCreator'
import { Spin } from 'antd'

const CreateExam = () => {
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
                <div className='body__content'>
                    <MainCreate />
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default CreateExam
