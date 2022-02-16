import { Col, Modal, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { axiosExam } from '../../../API/examAxios';
import { axiosResult } from '../../../API/resultExamAxios';
import { TakeExamActionCreator } from '../../../Redux/ActionCreator';
import InfoExam from './InfoExam';
import { InfoQuestion } from './infoQuestion';
import NumberQuestionTakeExam from './NumberQuestionTakeExam';

const MainTakeExam = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [examData, setExamData] = useState({});
    const dispatch = useDispatch();
    const [openConfirmSubmit, setOpenConfirmSubmit] = useState(false);
    const infoExam = useSelector(state => state.takeExam);
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);

    useEffect(() => {
        const fetchDataExam = async () => {
            await setLoading(true);
            const resExam = await axiosExam.get(`/${id}`);
            resExam?.data?.listQuestion?.forEach(item => item.choose = '')
            await dispatch(TakeExamActionCreator.SetListQuestion(resExam.data?.listQuestion.sort(() => Math.random() - 0.5)))
            const { title, description, testTime } = (await resExam).data;
            await dispatch(TakeExamActionCreator.ChangeInfoExam({ title, description, testTime }))
            await setExamData(resExam.data);
            await setLoading(false)
        }
        fetchDataExam();
        return () => fetchDataExam();
    }, [id, dispatch])

    const resetRadio = () => {
        const check = document.getElementsByTagName('input');
        for (let i = 0; i < check.length; i++) {
            check[i].checked = false;
        }
    }

    const handleSubmitExam = async () => {
        let p = 0;
        infoExam.listQuestion.forEach((item) => {
            if (item.choose === item.correct) {
                p++;
            }
        })

        const data = {
            idExam: id,
            idUser: auth.user._id,
            userName: auth.user.name,
            titleExam: infoExam.infoExam.title,
            point: p,
            quantityQuestion: infoExam.listQuestion.length,
            timeTest: infoExam.infoExam.testTime,
            listQuestion: infoExam.listQuestion,
        }

        await axiosResult.post('/', data, {
            headers: {
                Authorization: token,
            }
        })

        history.push(`/exam/take-exam/${id}/result`)
        await setOpenConfirmSubmit(false)

    }

    const handleCheckExamNoAnswer = () => {
        let p = 0;
        infoExam.listQuestion.forEach((item) => {
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
    return loading ? <Spin /> : (
        <div className="containerTakeExam">
            <h2 style={{ margin: '1rem 0' }}>Phần làm bài</h2>
            <Row>
                <Col xs={24} sm={24} md={8} lg={8} className="wrapListQuestion">
                    <NumberQuestionTakeExam resetRadio={resetRadio} />
                </Col>
                <Col xs={24} sm={24} md={16} lg={16} className="wrapContentQuestion">
                    <InfoQuestion />
                </Col>
            </Row>
            <div className="wrapButton">
                <button onClick={handleCheckExamNoAnswer} className="submit">Nộp bài</button>
            </div>
            <Modal title="Thông báo" visible={openConfirmSubmit} onOk={() => handleSubmitExam()} onCancel={() => setOpenConfirmSubmit(false)}>
                <h3>Bạn chắc chắn muốn xóa trường dữ liệu này?</h3>
            </Modal>
            <InfoExam handleSubmitExam={handleSubmitExam} data={examData} />
        </div>
    )
}

export default React.memo(MainTakeExam)
