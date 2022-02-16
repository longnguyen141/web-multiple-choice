import { Col, Row, Spin } from 'antd';
import React, { useState } from 'react';
import moment from 'moment'
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DetailInfoRoomTabs = ({ valueRoom, scrollY }) => {
    const [infoUserCreateRoom, setInfoCreateRoom] = useState('');
    const [loading, setLoading] = useState(true);
    const token = useSelector(state => state.token);
    const [status, setStatus] = useState('đã hoàn thành');
    const today = new Date();

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`/user/infoById/${valueRoom.idUser}`, {
                headers: {
                    Authorization: token,
                }
            })
            await setInfoCreateRoom(res.data);
            await setLoading(false);
        }
        fetchData();
        return () => fetchData()
    }, [token, valueRoom?.idUser])

    useEffect(() => {
        if (moment(valueRoom.activeTime).diff(moment(today), 'minutes') > 0) {
            setStatus('chưa hoạt động')
        } else
            if (moment(valueRoom.activeTime).add(valueRoom.testTimeRoom, 'minutes').diff(moment(today), 'minutes') > 0) {
                setStatus('đang hoạt động')
            }
    }, [valueRoom, today])

    return loading ? <Spin /> : (
        <div className="wrapInfoExamAdmin">
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Tên phòng thi: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>{valueRoom.nameRoom}</p>
                </Col>
            </Row>
            {/* <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Mô tả: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>Tổng hợp 230 câu hỏi trắc nghiệm môn thiết kế website có đáp án đầy đủ nhằm giúp các bạn dễ dàng ôn tập lại toàn bộ các kiến thức. Để ôn tập hiệu quả các bạn có thể ôn theo từng phần trong bộ câu hỏi này bằng cách trả lời các câu hỏi và xem lại đáp án và lời giải chi tiết. Sau đó các bạn hãy chọn tạo ra đề ngẫu nhiên để kiểm tra lại kiến thức đã ôn</p>
                </Col>
            </Row> */}
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Ảnh đại diện phòng:</h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>

                    <img width="200" src="https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp" alt="" />
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Trạng thái của phòng: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p style={{ fontWeight: 'bold' }}>{status}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Người tạo: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>{infoUserCreateRoom.name ? infoUserCreateRoom.name : "Long 12"}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Thời gian làm bài: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>

                    <p>{valueRoom.testTimeRoom}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Thời gian phòng hoạt động: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    {/* <p>12/11/2021</p> */}
                    <p>{moment(valueRoom.activeTime).format('dddd DD/MM/YYYY, h:mm:ss A')}</p>

                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Tổng số câu hỏi: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>{valueRoom?.infoExamRoom?.listQuestion?.length}</p>

                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Thẻ danh mục: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <div className="wrapTags">
                        {valueRoom?.infoExamRoom?.tags?.map((item, index) => (
                            <span key={index} className="tagsItem">{item}</span>
                        ))}
                    </div>

                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Thời gian tạo: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    {/* <p>22/10/2021</p> */}
                    <p>{moment(valueRoom.createdAt).format('dddd DD/MM/YYYY, h:mm:ss A')}</p>
                </Col>
            </Row>
        </div>
    )
}

export default DetailInfoRoomTabs
