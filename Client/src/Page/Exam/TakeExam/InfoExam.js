import { LeftCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

const InfoExam = ({ data, handleSubmitExam }) => {
    const [show, setShow] = useState(false);

    const [number, setNumber] = useState({
        minutes: data.testTime,
        seconds: 0,
    });

    useEffect(() => {
        const countDownTime = setInterval(() => {
            if (number.seconds > 0) {

                setNumber({
                    ...number,
                    seconds: number.seconds - 1,
                })
            }
            if (number.seconds === 0) {
                if (number.minutes === 0) {
                    clearInterval(countDownTime)
                } else {

                    setNumber({
                        seconds: 59,
                        minutes: number.minutes - 1,
                    })
                }
            }
        }, 1000)
        return () => clearInterval(countDownTime)
    }, [number])

    useEffect(() => {
        if (number.minutes === 0 && number.seconds === 0) {
            if (!handleSubmitExam) return;
            if (handleSubmitExam) {
                handleSubmitExam();
            }
        }
    }, [number, handleSubmitExam])
    const handleShowInfo = () => {
        setShow(!show);
    }
    return (
        <div className={`wrapInfoExam ${show ? 'active' : ''}`} >
            <h3>{data?.title}</h3>
            <p>Số lượng câu hỏi: <span>{data?.listQuestion?.length} câu</span></p>
            <p>Thời gian làm bài: <span>{data?.testTime} phút</span></p>
            <p>Thời gian còn lại: <span>{`${number.minutes} : ${number.seconds > 9 ? number.seconds : (0 + `${number.seconds}`)}`}</span></p>
            <button onClick={handleShowInfo} className={`btnShowInfo ${show ? 'active' : ''}`}><LeftCircleOutlined /></button>
        </div>
    )
}

export default React.memo(InfoExam)
