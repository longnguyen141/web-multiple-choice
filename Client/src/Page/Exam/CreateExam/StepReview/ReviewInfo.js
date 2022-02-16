import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ReviewInfo = ({ handleChangeMovePage, type, handleUpdateExam, handleCreateExam }) => {
    const infoExamRedux = useSelector(state => state.questionExam.infoExam)
    const questionRedux = useSelector(state => state.questionExam.listQuestion)
    const { id } = useParams();
    // const dataRedux = useSelector(state => state.questionExam.listQuestion)
    const infoCreateRedux = useSelector(state => state.createExam.infoExam);
    const dataCreateRedux = useSelector(state => state.createExam.listQuestion);
    console.log(infoExamRedux, infoCreateRedux);
    return (
        <div className="containerInfoExam">
            <h2>Thông tin</h2>
            <p><span className="txtStrong">Tiêu đề: </span><span>{id ? (infoExamRedux && infoExamRedux?.title) : (infoCreateRedux && infoCreateRedux?.title)}</span></p>
            <p><span className="txtStrong">Mô tả: </span><span>{id ? (infoExamRedux && infoExamRedux?.description) : (infoCreateRedux && infoCreateRedux?.description)}</span></p>
            <p><span className="txtStrong">Thời gian làm bài: </span><span>{id ? (infoExamRedux && infoExamRedux?.testTime) : (infoCreateRedux && infoCreateRedux?.testTime)} phút</span></p>
            <p><span className="txtStrong">Tổng số câu: </span><span>{id ? (questionRedux ? questionRedux.length : 0) : (dataCreateRedux ? dataCreateRedux.length : 0)} câu</span></p>
            <div className="wrapButton">
                <button className="submit" onClick={() => handleChangeMovePage("info")}>Sửa</button>
                <button style={{ maxWidth: '150px' }} onClick={id ? handleUpdateExam : handleCreateExam} className="btn-update">{id ? "Cập nhật bộ đề" : "Tạo bộ đề"}</button>
            </div>
        </div>
    )
}

export default ReviewInfo
