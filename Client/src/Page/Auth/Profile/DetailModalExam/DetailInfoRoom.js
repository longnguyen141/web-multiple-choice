import { Col, Row } from 'antd'
import moment from 'moment'
import React from 'react'

const DetailInfoRoom = ({ infoExam }) => {
    return (
        <div className="wrapInfoExamAdmin">
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Tiêu đề: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>{infoExam?.title}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Mô tả: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>{infoExam?.description}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Ảnh đại diện phòng:</h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <img width="200" src={(infoExam && infoExam.avatar !== '') ? infoExam?.avatar : "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"} alt="" />
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Trạng thái của phòng: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p style={{ fontWeight: 'bold' }}>{infoExam?.status}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3>Người tạo: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>{infoExam?.authorName}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Thời gian làm bài: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>

                    <p>{infoExam?.testTime}</p>
                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Tổng số câu hỏi: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <p>{infoExam?.listQuestion?.length}</p>

                </Col>
            </Row>
            <Row className="infoItem">
                <Col xs={24} sm={24} md={8} lg={8}>

                    <h3>Thẻ danh mục: </h3>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <div className="wrapTags">
                        {infoExam?.tags?.map((item, index) => (
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
                    <p>{moment(infoExam?.createdAt).format('dddd DD/MM/YYYY, h:mm:ss A')}</p>
                </Col>
            </Row>
        </div>
    )
}

export default DetailInfoRoom
