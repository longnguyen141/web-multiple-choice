import React from 'react';
const InfoExam = ({ infomationExam }) => {

    return (
        <div className="wrapInfoExamAdmin">
            <div className="infoItem">
                <h3>Tiêu đề: </h3>
                <p className="infoItem__content">{infomationExam.title}</p>
            </div>
            <div className="infoItem">
                <h3>Mô tả: </h3>
                <p className="infoItem__content">{infomationExam.description}</p>
            </div>
            <div className="infoItem">
                <h3>Ảnh:</h3>
                <div className="infoItem__content">
                    <img width="200" src={infomationExam?.avatar ? infomationExam.avatar : "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"} alt="" />
                </div>
            </div>
            <div className="infoItem">
                <h3>Tác giả: </h3>
                <p className="infoItem__content">{!infomationExam.authorName ? "Nguyễn Văn A" : infomationExam.authorName}</p>
            </div>
            <div className="infoItem">
                <h3>Thời gian làm bài: </h3>
                <p className="infoItem__content">{infomationExam.testTime} phút</p>
            </div>
            <div className="infoItem">
                <h3>Tổng số câu hỏi: </h3>
                <p className="infoItem__content">{infomationExam?.listQuestion?.length || 0} câu</p>
            </div>
            <div className="infoItem">
                <h3>Thẻ danh mục: </h3>
                <div className="infoItem__content wrapTags">
                    {infomationExam?.tags?.map((item, index) => (
                        <span className="tagsItem" key={index}>{item}</span>
                    ))}
                </div>
            </div>
            <div className="infoItem">
                <h3>Thời gian tạo: </h3>
                <p className="infoItem__content">22/10/2021</p>
            </div>
        </div>
    )
}

export default InfoExam
