import { Col, Row, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router'
import { axiosResultRoom } from '../../../API/resultRoomAxios'
import DetailResultRoom from './DetailResultRoom'
import moment from 'moment'
import NumberQuestionResult from './NumberQuestionResult'

const MainResult = () => {
    const token = useSelector(state => state.token);
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const auth = useSelector(state => state.auth)
    const [resultRoom, setResultRoom] = useState('');
    const history = useHistory();
    const handleChangeMovePage = () => {
        const detailMarkQuestion = document.querySelector(".wrapDetailMarkExam");
        const wrapDetailQuestionResult = document.querySelector('.wrapDetailQuestionResult');
        detailMarkQuestion.classList.toggle('active');
        wrapDetailQuestionResult.classList.toggle('active');
        if (!detailMarkQuestion.classList.contains('active')) {
            detailMarkQuestion.classList.add('hidden');
        } else {
            detailMarkQuestion.classList.remove('hidden');
        }
        if (!wrapDetailQuestionResult.classList.contains('active')) {
            wrapDetailQuestionResult.classList.add('hidden');
        } else {
            wrapDetailQuestionResult.classList.remove('hidden');
        }
    }
    useEffect(() => {
        if (id && Object.keys(auth.user).length >= 0) {
            const fetchData = async () => {
                const res = await axiosResultRoom.post('/getResult', { idUser: auth.user._id, idRoom: id }, {
                    headers: {
                        Authorization: token,
                    }
                })
                await setResultRoom(res.data);
                if (res.data === null && auth.user._id !== '' && auth.user._id !== undefined) {
                    return history.push('/notfound')
                } else {
                }
                await setTimeout(() => {

                    setLoading(false)
                }, 500)

            }
            fetchData()
            return () => {
                fetchData()
            }
        }
    }, [token, auth.user, id, history])

    return loading === true ? <Spin /> : (
        <div className="containerResult">
            <div>
                <Row className="wrapDetailQuestionResult">
                    <div className="wrapTitile" style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', }}>
                        <h2 style={{ display: 'block' }}>Chi ti???t ????p ??n c???a b??i ki???m tra</h2>
                    </div>
                    <Col xs={24} sm={24} md={8} lg={8} className="wrapListQuestion">
                        <NumberQuestionResult listQuestion={resultRoom?.listQuestion} />
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} className="wrapContentQuestion">
                        <DetailResultRoom listQuestion={resultRoom?.listQuestion} />
                    </Col>
                    <div className="wrapButton">
                        <button onClick={handleChangeMovePage} className="submit">Xem ??i???m</button>
                    </div>
                </Row>
                <Row className="wrapDetailMarkExam active">
                    <div className="wrapTitile" style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', }}>
                        <h2 style={{ display: 'block' }}>K???t qu??? ki???m tra</h2>
                    </div>
                    <div className="wrapContentMarkExam">
                        <h3>B??i ki???m tra: <span>{resultRoom?.titleExam}</span></h3>
                        <p>T??n ng?????i tham gia: <span>{resultRoom?.userName}</span></p>
                        <p>K???t qu??? l??m b??i: <span>{resultRoom?.point + '/' + resultRoom?.listQuestion?.length}</span></p>
                        <p>??i???m c???a b??i ki???m tra: <span>{10 * resultRoom?.point / resultRoom?.listQuestion?.length}</span></p>
                        <p>Th???i gian k???t th??c l??m b??i: <pan>{moment(resultRoom?.createdAt).format("DD/MM/YYYY hh:mm A")}</pan></p>
                    </div>
                    <div className="wrapButton">
                        <button onClick={handleChangeMovePage} className="submit">Xem chi ti???t b??i ki???m tra</button>
                    </div>
                </Row>
            </div>
        </div>
    )
}

export default MainResult
