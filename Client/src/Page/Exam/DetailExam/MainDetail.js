import { ClockCircleOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Row, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { axiosExam } from '../../../API/examAxios'
import { useSelector } from 'react-redux';

const MainContent = () => {
    const [infomationExam, setInfomationExam] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [listHotExam, setListHotExam] = useState([]);
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const history = useHistory();
    useEffect(() => {
        const fetchData = async () => {
            const data = await axiosExam.get(`/${id}`);
            setInfomationExam(data.data);
        }
        fetchData();
        return () => {
            fetchData();
        }
    }, [id])

    const handleMovePage = () => {
        if (auth.user.isLogged)
            history.push(`/exam/take-exam/${id}`);
        else {
            setOpenModal(true);
        }
    }


    return (
        <div className="detailExam__content" style={{ width: "90%", margin: '0 auto' }}>
            <h1 style={{ margin: '1rem 0' }}>Chi tiết bộ đề</h1>
            <Row style={{ position: 'relative' }}>
                <Col className='wrapContentLeft' xs={24} sm={24} md={24} lg={9} xl={9}>
                    <div>
                    </div>
                    <h2 className="wrapListHotExam__title">Thông tin bộ đề</h2>
                    <div style={{ padding: '10px', border: '1px solid #d5d5d5' }}>
                        <h2>{infomationExam.title}</h2>
                        <p className="txt">{infomationExam.description}</p>
                        <div className="wrapInfo">
                            <p className="wrapIcon"><UserOutlined />&nbsp;Tác giả: <span>{infomationExam.authorName ? infomationExam.authorName : "Nguyễn Văn A"}</span></p>
                            <p className="wrapIcon"><ClockCircleOutlined />&nbsp;Thời gian làm bài: <span>&nbsp;{infomationExam.testTime} phút</span></p>
                            <p className="wrapIcon"><QuestionCircleOutlined />&nbsp;Tổng số câu hỏi: <span>&nbsp;{infomationExam?.listQuestion?.length}</span></p>
                        </div>
                        <div className="wrapButton">
                            <Button type='primary' onClick={handleMovePage} >Bắt đầu</Button>
                        </div>
                    </div>
                </Col>
                <Col className="wrapContentDetail" xs={24} sm={24} md={24} lg={14} xl={14}>
                    <h2>{"Danh sách câu hỏi"}</h2>

                    <div className="wrapQuestionList">
                        {infomationExam?.listQuestion?.map((item, index) => (
                            <div className="wrapQuestion__item">
                                <h3 style={{ display: 'flex' }}><span style={{ minWidth: '3.5rem' }}>Câu {index + 1}: &nbsp;</span><p className="question" dangerouslySetInnerHTML={{ __html: item.question }}></p></h3>
                                <p className="option"><span>A: &nbsp; </span> <span dangerouslySetInnerHTML={{ __html: item.answer1 }}></span></p>
                                <p className="option"><span>B: &nbsp; </span> <span dangerouslySetInnerHTML={{ __html: item.answer2 }}></span></p>
                                <p className="option"><span>C: &nbsp; </span> <span dangerouslySetInnerHTML={{ __html: item.answer3 }}></span></p>
                                <p className="option"><span>D: &nbsp; </span> <span dangerouslySetInnerHTML={{ __html: item.answer4 }}></span></p>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
            <Modal onCancel={() => setOpenModal(false)} title="Yêu cầu đăng nhập" visible={openModal} onOk={() => history.push('/login')} >
                <h3 className="formItem-input ">
                    Vui lòng đăng nhập để thực hiện chức năng này
                </h3>
            </Modal>

        </div>
    )
}

export default MainContent
