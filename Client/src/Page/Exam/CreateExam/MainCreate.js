import { Col, Row, Steps } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { axiosExam } from '../../../API/examAxios'
import { QuestionExamActionCreator } from '../../../Redux/ActionCreator'
import FormCreateExam from './StepCreateQuestion/FormCreateExam'
import FormInfo from './StepInfo/FormInfo'
import ReviewInfo from './StepReview/ReviewInfo'
import ReviewQuestions from './StepReview/ReviewQuestions'

const MainCreate = ({ type }) => {
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false);
    const { Step } = Steps
    const history = useHistory()
    const dispatch = useDispatch();
    const token = useSelector(state => state.token)
    const infoExamRedux = useSelector(state => state.questionExam.infoExam)
    const listQuestionRedux = useSelector(state => state.questionExam.listQuestion)
    const infoExamReduxCreate = useSelector(state => state.createExam.infoExam)
    const listQuestionReduxCreate = useSelector(state => state.createExam.listQuestion)
    const [valueExam, setValueExam] = useState("");
    const { id } = useParams();

    const handleChangeMovePage = (type) => {
        const wrapStepInfo = document.querySelector('.wrapStepInfo');
        const wrapStepQuestion = document.querySelector('.wrapStepQuestion');
        const wrapStepView = document.querySelector('.wrapStepView');
        const wrapStepContent = document.querySelector('.wrapStepContent');
        let height = 0;

        switch (type) {
            case "info":
                if (step === 0)
                    return
                wrapStepInfo.classList.add('active')
                wrapStepQuestion.classList.remove('active')
                wrapStepView.classList.remove('active')
                if (step === 1) {
                    wrapStepQuestion.classList.add('hident')
                } else {
                    wrapStepView.classList.add('hident')
                }
                wrapStepInfo.classList.remove('hident')
                height = `${wrapStepInfo.offsetHeight + 100}px`
                wrapStepContent.style.height = height;
                setStep(0)
                break;
            case "question":
                if (step === 1) return
                wrapStepInfo.classList.remove('active')
                wrapStepQuestion.classList.add('active')
                wrapStepView.classList.remove('active')

                wrapStepQuestion.classList.remove('hident')
                if (step === 0) {
                    wrapStepInfo.classList.add('hident')
                } else {

                    wrapStepView.classList.add('hident')
                }
                height = `${wrapStepQuestion.offsetHeight + 100}px`
                wrapStepContent.style.height = height;
                setStep(1)
                break;
            case "view":
                if (step === 2) return
                wrapStepInfo.classList.remove('active')
                wrapStepQuestion.classList.remove('active')
                wrapStepView.classList.add('active')
                wrapStepView.classList.remove('hident')

                if (step === 0) {
                    wrapStepInfo.classList.add('hident')
                } else {
                    wrapStepQuestion.classList.add('hident')
                }
                height = `${wrapStepView.offsetHeight + 100}px`
                wrapStepContent.style.height = height;
                setStep(2)
                break;
            default:

                break;
        }
    }

    // useEffect(() => {
    //     if (!id) {
    //         const clearExam = async () => {
    //             await setLoading(true);
    //             await dispatch(QuestionExamActionCreator.ClearExam());
    //             await setLoading(false)
    //         }
    //         clearExam();
    //         return () => clearExam()
    //     }

    // }, [id, dispatch])

    useEffect(() => {
        // handleChangeMovePage("info");
        const wrapStepInfo = document.querySelector('.wrapStepInfo');
        const wrapStepContent = document.querySelector('.wrapStepContent');

        let height = 0;
        wrapStepInfo.classList.add('active')

        height = `${wrapStepInfo.offsetHeight + 100}px`
        wrapStepContent.style.height = height;
        setStep(0)

    }, [])

    useEffect(() => {
        const clearExam = async () => {
            await setLoading(true);
            await dispatch(QuestionExamActionCreator.ClearExam());
            await setLoading(false)
        }
        clearExam();
        return () => clearExam()
    }, [dispatch])

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                await setLoading(true);
                const res = await axiosExam.get(`/${id}`);
                await dispatch(QuestionExamActionCreator.ChangeInfoExam(res?.data))
                await dispatch(QuestionExamActionCreator.SetListQuestion(res?.data?.listQuestion))
                await setValueExam(res.data);
                await setLoading(false);
            }
            fetchData();
            return () => fetchData()
        }
        else {
            const fetchData = async () => {
                await setLoading(true)
                await setValueExam({})
                setTimeout(async () => {
                    await setValueExam({})
                }, 1000)
                await setLoading(false);
            }
            fetchData();
            return () => fetchData();
        }

    }, [id, dispatch])

    const handleCreateExam = async () => {
        try {
            const newExam = { ...infoExamReduxCreate, listQuestion: listQuestionReduxCreate }
            console.log(newExam);
            const res = await axiosExam.post('/createExam', newExam, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            dispatch(QuestionExamActionCreator.ClearExam());
            if (type && type === "admin") {
                history.push('/admin/exam')
            } else {
                history.push('/exam');
            }
        } catch (err) {
            err.response.data.msg && toast.error("Vui lòng kiểm tra lại phần nhập thông tin và danh sách câu hỏi")
        }
    }
    const handleUpdateExam = async () => {
        try {
            const newExam = { ...infoExamRedux, listQuestion: listQuestionRedux }

            const res = await axiosExam.patch(`/editExam/${id}`, newExam, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            dispatch(QuestionExamActionCreator.ClearExam());
            history.push('/admin/exam');
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }

    return (
        <div className="wrapCreateExam">
            <Steps className="wrapSteps" current={step} onChange={(current) => setStep(current)}>
                <Step onClick={() => handleChangeMovePage("info")} title="Thông tin bộ đề" />
                <Step onClick={() => handleChangeMovePage("question")} title="Danh sách câu hỏi" />
                <Step onClick={() => handleChangeMovePage("view")} title="Xem trước" />
            </Steps>
            <section className="wrapStepContent">
                <div className="wrapStepInfo ">
                    <h2>Thông tin bộ đề</h2>
                    <FormInfo propsExam={valueExam} handleChangeMovePage={handleChangeMovePage} />
                </div>
                <div style={{ marginTop: '1rem' }} className="wrapStepQuestion ">
                    <h2>Tạo danh sách câu hỏi</h2>
                    <FormCreateExam propsListQuestion={valueExam?.listQuestion} loading={loading} handleChangeMovePage={handleChangeMovePage} />
                </div>
                <div style={{ marginTop: '1rem' }} className="wrapStepView ">
                    <h1>Kiểm tra</h1>
                    <Row className="wrapStepReview">
                        <Col className="wrapReviewInfo" xs={24} sm={24} md={10} lg={10} >
                            <ReviewInfo handleUpdateExam={handleUpdateExam} handleCreateExam={handleCreateExam} handleChangeMovePage={handleChangeMovePage} />
                        </Col>
                        <Col className="wrapReviewQuestionList" xs={24} sm={24} md={14} lg={14} >
                            <ReviewQuestions />
                        </Col>
                        <div className="wrapButton">
                            <button onClick={id ? handleUpdateExam : handleCreateExam} className="buttonCreateExam">{id ? "Cập nhật bộ đề" : "Tạo bộ đề"}</button>
                        </div>
                    </Row>
                </div>
            </section>

        </div>
    )
}

export default MainCreate
