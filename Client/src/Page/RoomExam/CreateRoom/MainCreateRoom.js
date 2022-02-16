import { Col, Row, Steps } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { axiosRoom } from '../../../API/roomAxios'
import { RoomActionCreator, RoomUpdateActionCreator } from '../../../Redux/ActionCreator'
import FormCreateRoom from './StepCreateQuestionRoom/FormCreateRoom'
import FormInfoRoom from './StepInfoRoom/FormInfoRoom'
import ReviewInfo from './StepReviewRoom/ReviewInfo.room'
import ReviewQuestions from './StepReviewRoom/ReviewQuestion.room'

const MainCreateRoom = ({ type }) => {
    const [step, setStep] = useState(0)
    const auth = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const { Step } = Steps
    const [infoRoomUpdate, setInfoRoomUpdate] = useState('');
    const infoRoomRedux = useSelector(state => state.room.infoRoom)
    const infoExamRoomRedux = useSelector(state => state.room.infoExamRoom)
    const token = useSelector(state => state.token)
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const wrapStepInfo = document.querySelector('.wrapStepInfo');
        const wrapStepContent = document.querySelector('.wrapStepContent');

        let height = 0;
        wrapStepInfo.classList.add('active')

        height = `${wrapStepInfo.offsetHeight + 100}px`
        wrapStepContent.style.height = height;
        setStep(0)
    }, [])

    useEffect(() => {
        const clearInfoRoom = async () => {
            await setLoading(true);
            dispatch(RoomActionCreator.ClearRoom());
            await setLoading(false);
        }
        clearInfoRoom();
        return () => clearInfoRoom()
    }, [dispatch])

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                await setLoading(true);
                const res = await axiosRoom.get(`/infoRoom/${id}`, {
                    headers: {
                        Authorization: token,
                    }
                })
                await dispatch(RoomUpdateActionCreator.ChangeInfoRoomUpdate(res?.data))
                await dispatch(RoomActionCreator.SetListQuestion([
                    {
                        question: '',
                        answer1: '',
                        answer2: '',
                        answer3: '',
                        answer4: '',
                        correct: '',
                        explain: '',
                        choose: '',
                    }
                ]))
                await setTimeout(() => {
                    setInfoRoomUpdate(res.data)
                }, 1000)
                await setLoading(false);
            }
            fetchData()
            return () => fetchData()
        } else {
            const fetchData = async () => {
                await setLoading(true);
                setTimeout(async () => {
                    // await setInfoRoomUpdate({
                    //     // nameRoom: '',
                    //     // authorName: '',
                    //     // testTimeRoom: '',
                    //     // activeTime: '',
                    //     // listUser: [],
                    //     // infoExamRoom: {
                    //     //     title: '',
                    //     //     description: '',
                    //     //     testTime: '',
                    //     //     field: '',
                    //     //     tags: [],
                    //     //     avatar: '',
                    //     //     authorName: '',
                    //     //     status: '',
                    //     //     listQuestion: [
                    //     //         {
                    //     //             question: '',
                    //     //             answer1: '',
                    //     //             answer2: '',
                    //     //             answer3: '',
                    //     //             answer4: '',
                    //     //             correct: '',
                    //     //             explain: '',
                    //     //             choose: '',
                    //     //         }
                    //     //     ]
                    //     // },
                    // })
                    await setInfoRoomUpdate('');
                    await dispatch(RoomActionCreator.ClearRoom())
                }, 1000)
                await setLoading(false);
            }
            fetchData();
            return () => fetchData();
        }
    }, [id, token, dispatch])

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

    const handleCreateRoom = async () => {
        try {
            const newRoom = { ...infoRoomRedux, infoExamRoom: { ...infoExamRoomRedux } }
            const res = await axiosRoom.post('/create', newRoom, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            dispatch(RoomActionCreator.ClearRoom());
            if (!type) {
                history.push('/room-exam');
            } else {
                history.push('/admin/room')
            }
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }

    const handleUpdateRoom = async () => {
        try {
            const newRoom = { ...infoRoomRedux, infoExamRoom: { ...infoExamRoomRedux } }
            const res = await axiosRoom.patch(`/update-room/${id}`, newRoom, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            dispatch(RoomActionCreator.ClearRoom());
            if (!type) {
                history.push('/');
            } else {
                history.push('/admin/room')
            }
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }

    return (
        <div className="wrapCreateExam">
            <Steps className="wrapSteps" current={step} onChange={(current) => setStep(current)}>
                <Step onClick={() => handleChangeMovePage("info")} title="Thông tin phòng thi" />
                <Step onClick={() => handleChangeMovePage("question")} title="Danh sách câu hỏi" />
                <Step onClick={() => handleChangeMovePage("view")} title="Kiểm tra lại thông tin" />
            </Steps>
            <section className="wrapStepContent">
                <div className="wrapStepInfo ">
                    <h2 style={{ marginTop: '1rem' }}>Thông tin phòng thi</h2>
                    <FormInfoRoom infoRoomUpdate={infoRoomUpdate} handleChangeMovePage={handleChangeMovePage} />
                </div>
                <div className="wrapStepQuestion ">
                    <h2 style={{ marginTop: '2rem', textAlign: 'center' }}>Tạo danh sách câu hỏi</h2>
                    <FormCreateRoom infoRoomUpdate={infoRoomUpdate} type="room" />
                </div>
                <div className="wrapStepView ">
                    <h2 style={{ marginTop: '2rem', textAlign: 'center' }}> Kiểm tra</h2>
                    <Row className="wrapStepReview">
                        <Col className="wrapReviewInfo" xs={24} sm={24} md={10} lg={10} >
                            <ReviewInfo handleChangeMovePage={handleChangeMovePage} handleCreateRoom={handleCreateRoom}
                                handleUpdateRoom={handleUpdateRoom} />
                        </Col>
                        <Col className="wrapReviewQuestionList" xs={24} sm={24} md={14} lg={14} >
                            <ReviewQuestions />
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    )
}

export default MainCreateRoom
