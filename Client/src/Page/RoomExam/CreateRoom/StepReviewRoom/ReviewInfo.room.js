import moment from 'moment';
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ReviewInfo = ({ handleChangeMovePage, type, handleCreateRoom, handleUpdateRoom }) => {
    const { id } = useParams();
    const infoExamRedux = useSelector(state => state.room.infoRoom)
    const questionRedux = useSelector(state => state.room.infoExamRoom.listQuestion)
    const listQuestionRoomRedux = useSelector(state => state.updateRoom.infoExamRoom?.listQuestion)
    const infoRoomUpdateRedux = useSelector(state => state.updateRoom.infoRoom)
    console.log(listQuestionRoomRedux, questionRedux)
    // console.log(infoExamRedux, infoExamRedux)
    return (
        <div className="containerInfoExam" style={{ marginRight: '10px' }}>
            <h2>Thông tin</h2>
            <p><span className="txtStrong">Tiêu đề: </span><span>{id ? (infoRoomUpdateRedux && infoRoomUpdateRedux.nameRoom) : (infoExamRedux && infoExamRedux?.nameRoom)}</span></p>
            <p><span className="txtStrong">Thời gian làm bài: </span><span>{id ? (infoRoomUpdateRedux && infoRoomUpdateRedux.testTimeRoom) : (infoExamRedux && infoExamRedux?.testTimeRoom)} phút</span></p>
            <p><span className="txtStrong">Thời gian phòng thi hoạt động: </span><br /><span>{id ? (infoRoomUpdateRedux.activeTime && moment(infoRoomUpdateRedux.activeTime).format("DD/MM/YYYY hh:mm A")) : (infoExamRedux.activeTime && moment(infoExamRedux.activeTime).format("DD/MM/YYYY hh:mm A"))}</span></p>
            <p><span className="txtStrong">Tổng số câu: </span><span>{id ? (listQuestionRoomRedux && listQuestionRoomRedux.length) : (questionRedux && questionRedux.length)} câu</span></p>
            <div className="wrapButton">
                <button className="submit" onClick={() => handleChangeMovePage("info")}>Sửa</button>
                <button style={{ marginLeft: '1rem' }} onClick={!id ? handleCreateRoom : handleUpdateRoom} className="buttonCreateExam">{!id ? "Tạo phòng" : "Chỉnh sửa phòng thi"}</button>
            </div>
        </div>
    )
}

export default ReviewInfo
