import { Col, Row, Spin } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { axiosResultRoom } from '../../../API/resultRoomAxios'
import { axiosRoom } from '../../../API/roomAxios'
import { TakeRoomActionCreator } from '../../../Redux/ActionCreator'
import InfoQuestion from './infoQuestion'
import InfoRoom from './InfoRoom'
import NumberQuestionTakeRoom from './NumberQuestionTakeRoom'

const MainTakeRoom = () => {
    const [openConfirmSubmit, setOpenConfirmSubmit] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const auth = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)
    const [roomData, setRoomData] = useState('');
    const token = useSelector(state => state.token)
    const infoRoom = useSelector(state => state.takeRoom);
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        const fetchDataRoom = async () => {
            // await setLoading(true);
            const resRoom = await axiosRoom.get(`/infoRoom/${id}`, {
                headers: { Authorization: token }
            });
            if(resRoom.data === null || !resRoom) return history.push('/notfound')
            resRoom?.data?.infoExamRoom?.listQuestion?.forEach(item => item.choose = '')
            await dispatch(TakeRoomActionCreator.SetListQuestion(resRoom?.data?.infoExamRoom?.listQuestion.sort(() => Math.random() - 0.5)))
            const { nameRoom, activeTime, testTimeRoom } = resRoom.data;
            await dispatch(TakeRoomActionCreator.ChangeInfoRoom({ nameRoom, activeTime, testTimeRoom }))
            await setRoomData(resRoom.data);
            setTimeout(async () => {
                await setLoading(false)
            }, 2000)
        }
        fetchDataRoom();
        return () => fetchDataRoom();
    }, [id, dispatch, token, history])

    const handleSubmitExam = async () => {
        let p = 0;
        roomData?.infoExamRoom?.listQuestion.forEach((item) => {
            if (item.choose === item.correct) {
                p++;
            }
        })

        const data = {
            idRoom: id,
            idUser: auth.user._id,
            userName: auth.user.name,
            nameRoom: roomData.nameRoom,
            email: auth.user.email,
            point: p,
            quantityQuestion: infoRoom.listQuestion.length,
            timeTestRoom: roomData.testTime,
            listQuestion: infoRoom.listQuestion,
        }

        const res = await axiosResultRoom.post('/', data, {
            headers: {
                Authorization: token,
            }
        })
        await toast.success(res.msg)
        await setOpenNotification(true);
        // await history.push(`/room-exam/result/${id}`)
        await setOpenConfirmSubmit(false)

    }

    const handleCheckExamNoAnswer = () => {
        let p = 0;
        infoRoom?.listQuestion.forEach((item) => {
            if (item.choose === '') {
                p++;
            }
        })
        // await setLoading(false)
        if (p === 0)
            handleSubmitExam()
        else
            setOpenConfirmSubmit(true)

    }

    const resetRadio = () => {
        const check = document.getElementsByTagName('input');
        for (let i = 0; i < check.length; i++) {
            check[i].checked = false;
        }
    }

    return roomData === '' || loading ? <Spin /> : (
        <div className="containerTakeExam">
            <h2 style={{ margin: '1rem 0' }}>Phần làm bài</h2>
            <Row>
                <Col xs={24} sm={24} md={8} lg={8} className="wrapListQuestion">
                    <NumberQuestionTakeRoom resetRadio={resetRadio} />
                </Col>
                <Col xs={24} sm={24} md={16} lg={16} className="wrapContentQuestion">
                    <InfoQuestion />
                </Col>
            </Row>
            <div className="wrapButton">
                <button onClick={handleCheckExamNoAnswer} className="submit">Nộp bài</button>
            </div>
            <Modal title="Thông báo" visible={openConfirmSubmit} onOk={() => handleSubmitExam()} onCancel={() => setOpenConfirmSubmit(false)}>
                <h3>Bạn chắc chắn muốn nộp bài?</h3>
            </Modal>
            <Modal title="Thông báo" visible={openNotification} onOk={() => history.replace('/room-exam')} onCancel={() => setOpenNotification(false)}>
                <h3>Chúc mừng bạn đã hoàn thành bài thi</h3>
                <h3>Khi có sự cho phép của người tạo phòng chúng tôi sẽ thông báo thông tin bài thi đến bạn</h3>
            </Modal>
            <InfoRoom handleSubmitExam={handleSubmitExam} data={roomData} handleCheckExamNoAnswer={handleCheckExamNoAnswer} />
        </div>
    )
}

export default React.memo(MainTakeRoom)
