import { Col } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

const ItemExam = ({ item, listHighlight = [] }) => {
    const history = useHistory();


    return (
        <>
            <Col className="wrapItem" xs={24} sm={24} md={24} lg={24} xl={12}>
                <img onClick={() => history.push(`/exam/${item._id}`)} className="imgItem" src="https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"
                    alt="imgExam"
                />
                <div className="wrapContent">
                    <h2 onClick={() => history.push(`/exam/${item._id}`)} className="title">{item.title}</h2>
                    <p className="description">
                        {item.description}
                    </p>
                    <div className="wrapListTag">
                        {item.tags.map((valueTag, index) => (
                            <p className={`itemTag`} key={index} >{valueTag}</p>
                        ))}
                    </div>
                    <div className="wrapInfo">
                        <p>Tên tác giả: <span>{item.authorName ? item.authorName : "Nguyễn Văn A"}</span></p>
                        <p>Thời gian làm bài: <span>60 phút</span></p>
                        <p>Số câu hỏi: <span>50 câu</span></p>
                    </div>
                </div>
            </Col>

        </>
    )
}

export default ItemExam
