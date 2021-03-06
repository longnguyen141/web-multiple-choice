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
        <Modal onCancel={() => history.push('/')} title="Th??ng b??o" visible={openModal} onOk={() => history.push('/')} footer={[
            <Button
                key="link"
                type="primary"
                onClick={() => history.push('/')}
            >
                OK
            </Button>
        ]}>
            <h3 className="formItem-input ">
                B???n kh??ng th??? xem ??i???m c???a ng?????i kh??c
            </h3>
        </Modal>
    </> : (
        <div className="containerResult">
            <div>
                <Row className="wrapDetailQuestionResult">
                    <div className="wrapTitile" style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', }}>
                        <h2 style={{ display: 'block' }}>Chi ti???t ????p ??n c???a b??i ki???m tra</h2>
                    </div>
                    <Col xs={24} sm={24} md={8} lg={8} className="wrapListQuestion">
                        <NumberQuestionResult listQuestion={resultExam?.listQuestion} />
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} className="wrapContentQuestion">
                        <DetailResultExam listQuestion={resultExam?.listQuestion} />
                    </Col>
                    <div className="wrapButton">
                        <button onClick={handleChangeMovePage} className="submit">Xem ??i???m</button>
                    </div>
                </Row>
                <Row className="wrapDetailMarkExam active">
                    <div className="wrapTitile" style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', }}>
                        <h2 style={{ display: 'block' }}>K???t qu??? ki???m tra</h2>
                    </div>
                    <div className="wrapContentMarkExam" style={{ width: '70%' }}>
                        <h3>B??i ki???m tra: <span>{resultExam?.titleExam}</span></h3>
                        <p>T??n ng?????i tham gia: <span>{resultExam?.userName}</span></p>
                        <p>K???t qu??? l??m b??i: <span>{resultExam?.point + '/' + resultExam?.listQuestion?.length}</span></p>
                        <p>??i???m c???a b??i ki???m tra: <span>{10 * resultExam?.point / resultExam?.listQuestion?.length}</span></p>
                        <p>Th???i gian l??m b??i: <pan>{moment(resultExam?.createdAt).format("DD/MM/YYYY hh:mm A")}</pan></p>
                    </div>
                    <div className="wrapButton">
                        <button onClick={handleChangeMovePage} className="submit">Xem chi ti???t b??i ki???m tra</button>
                    </div>
                </Row>
                <Modal onCancel={() => history.push('/')} title="Th??ng b??o" visible={openModal} onOk={() => history.push('/')} footer={[
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
                        B???n kh??ng th??? xem ??i???m c???a ng?????i kh??c
                    </h3>
                </Modal>
            </div>
        </div>
    )
}

export default MainResult
