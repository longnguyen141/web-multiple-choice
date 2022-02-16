import { LeftCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const InfoExam = ({ data, handleCheckExamNoAnswer }) => {
    const [show, setShow] = useState(false);

    const [number, setNumber] = useState({
        minutes: moment(data.activeTime).add(data.testTimeRoom, 'minutes').diff(moment(new Date()), 'minutes'),
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
            if (!handleCheckExamNoAnswer) return;
            if (handleCheckExamNoAnswer) {
                handleCheckExamNoAnswer();
            }
        }
    }, [number, handleCheckExamNoAnswer])
    const handleShowInfo = () => {
        setShow(!show);
    }
    return (
        <div className={`wrapInfoExam ${show ? 'active' : ''}`} >
            <h3>{data?.title}</h3>
            <p>Số lượng câu hỏi: <span>{data?.infoExamRoom?.listQuestion?.length} câu</span></p>
            <p>Thời gian làm bài: <span>{data?.testTimeRoom} phút</span></p>
            <p>Thời gian còn lại: <span>{`${number.minutes > 9 ? number.minutes + " phút" : (0 + `${number.minutes} phút`)} : ${number.seconds > 9 ? number.seconds + " giây" : (0 + `${number.seconds} giây`)}`}</span></p>
            <button onClick={handleShowInfo} className={`btnShowInfo ${show ? 'active' : ''}`}><LeftCircleOutlined /></button>
        </div>
    )
}

export default React.memo(InfoExam)
