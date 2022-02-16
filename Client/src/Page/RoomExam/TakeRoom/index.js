import React, { useEffect, useState } from 'react'
import Header from '../../../Components/Header'
import Footer from '../../../Components/Footer'
import { Container } from 'reactstrap'
import MainTakeRoom from './mainTakeRoom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActionCreator } from '../../../Redux/ActionCreator'
import { Spin } from 'antd'
import { axiosRoom } from '../../../API/roomAxios'
import { useHistory, useParams } from 'react-router-dom'
import moment from 'moment'

const TakeRoom = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const [loading, setLoading] = useState(true)
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    useEffect(() => {
        const loadData = async () => {
            const res = await axiosRoom.get(`/getListUserInvite/${id}`, {
                headers: {
                    Authorization: token,
                }
            })
            const today = new Date();

            const resValueRoom = await axiosRoom.get(`/infoRoom/${id}`, {
                headers: { Authorization: token }
            })

            const activeTime = resValueRoom.data.activeTime;
            const time = resValueRoom.data.testTimeRoom;


            if (moment(activeTime).subtract(7, 'hours').diff(moment(today).toISOString(), 'minutes') > 0) {
                history.push('/notfound')
            }
            if (moment(activeTime).subtract(7, 'hours').add(time, 'minutes').diff(moment(today).toISOString(), 'minutes') < 0)
                history.push('/notfound')

            if (auth.user.email !== undefined && res.data.includes(auth.user.email) === false) history.push('/notfound')
            dispatch(AuthActionCreator.LOAD_PAGE())

            await setTimeout(() => {
                setLoading(false);
            }, 500)
        }
        loadData()

        return () => {
            loadData()
            setLoading(false)
        };
    }, [dispatch, auth, history, id, token])
    return loading ? <Spin /> : (
        <div className="containerTakeExam">
            <Header />
            <Container >
                <div className='body__content'>
                    <MainTakeRoom />
                </div>
            </Container>
            <Footer />
        </div>
    )
}

export default TakeRoom
