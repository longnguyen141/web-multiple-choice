import { Col, Row, Spin, Modal, Button } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router'
import { axiosResult } from '../../../API/resultExamAxios'
import firebase from 'firebase';
import DetailResultExam from './DetailResultExam'
import db from '../../../Firebase';
import NumberQuestionResult from './NumberQuestionResult'

const MainResult = () => {
    const token = useSelector(state => state.token);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const history = useHistory();
    const { id } = useParams()
    const auth = useSelector(state => state.auth)
    const [resultExam, setResultExam] = useState('');
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
                setLoading(true);
                const res = await axiosResult.post('/getLastResult', { idUser: auth.user._id, idExam: id }, {
                    headers: {
                        Authorization: token,
                    }
                })
                if (res.data === null) {
                    await setOpenModal(true);
                } else {
                    setResultExam(res.data);
                    setLoading(false)
                }
            }
            fetchData()
            return () => fetchData()
        }
    }, [token, auth, id, history])

    return loading && resultExam === '' ? <>
        <Spin />
        <Modal onCancel={() => history.push('/')} title="Thông báo" visible={openModal} onOk={() => history.push('/')} footer={[
            <Button
                key="link"
                type="primary"
                onClick={() => history.push('/')}
            >
                OK
            </Button>
        ]}>
            <h3 className="formItem-input ">
                Bạn không thể xem điểm của người khác
            </h3>
        </Modal>
    </> : (
        <div className="containerResult">
            <div>
                <Row className="wrapDetailQuestionResult">
                    <div className="wrapTitile" style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', }}>
                        <h2 style={{ display: 'block' }}>Chi tiết đáp án của bài kiểm tra</h2>
                    </div>
                    <Col xs={24} sm={24} md={8} lg={8} className="wrapListQuestion">
                        <NumberQuestionResult listQuestion={resultExam?.listQuestion} />
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} className="wrapContentQuestion">
                        <DetailResultExam listQuestion={resultExam?.listQuestion} />
                    </Col>
                    <div className="wrapButton">
                        <button onClick={handleChangeMovePage} className="submit">Xem điểm</button>
                    </div>
                </Row>
                <Row className="wrapDetailMarkExam active">
                    <div className="wrapTitile" style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', }}>
                        <h2 style={{ display: 'block' }}>Kết quả kiểm tra</h2>
                    </div>
                    <div className="wrapContentMarkExam" style={{ width: '70%' }}>
                        <h3>Bài kiểm tra: <span>{resultExam?.titleExam}</span></h3>
                        <p>Tên người tham gia: <span>{resultExam?.userName}</span></p>
                        <p>Kết quả làm bài: <span>{resultExam?.point + '/' + resultExam?.listQuestion?.length}</span></p>
                        <p>Điểm của bài kiểm tra: <span>{10 * resultExam?.point / resultExam?.listQuestion?.length}</span></p>
                        <p>Thời gian làm bài: <pan>{moment(resultExam?.createdAt).format("DD/MM/YYYY hh:mm A")}</pan></p>
                    </div>
                    <div className="wrapButton">
                        <button onClick={handleChangeMovePage} className="submit">Xem chi tiết bài kiểm tra</button>
                    </div>
                </Row>
                <Modal onCancel={() => history.push('/')} title="Thông báo" visible={openModal} onOk={() => history.push('/')} footer={[
                    <Button key="back" >
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} >
                        Submit
                    </Button>,
                    <Button
                        key="link"
                        type="primary"
                    >
                        Search on Google
                    </Button>
                ]}>
                    <h3 className="formItem-input ">
                        Bạn không thể xem điểm của người khác
                    </h3>
                </Modal>
            </div>
        </div>
    )
}

export default MainResult
