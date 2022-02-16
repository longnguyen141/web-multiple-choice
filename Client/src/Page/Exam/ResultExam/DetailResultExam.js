import { Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const DetailResultExam = ({ listQuestion }) => {
    const [loading, setLoading] = useState(true);
    const indexCurrent = useSelector(state => state.resultExam?.selected);
    useEffect(() => {
        const fnSetLoading = async () => {
            await setLoading(true);
            if (listQuestion && listQuestion.length > 0) {
                await setLoading(false);
            }
        }
        fnSetLoading();
        return () => fnSetLoading();

    }, [listQuestion])

    const checkTypeAnswer = (value) => {
        // if (listQuestion && listQuestion.lenght > 0) {
        if (value === listQuestion[indexCurrent]?.correct) return "correct";
        if (value === listQuestion[indexCurrent]?.choose && value !== listQuestion[indexCurrent]?.correct) return "wrong";
        return null;
        // }
    }

    return loading ? <Spin /> : (
        <>
            <div className="wrapQuestion">
                <p style={{ display: 'flex', alignContent: 'center' }}><span style={{ display: 'flex', alignContent: 'center' }} className="txtStrong">Câu {indexCurrent + 1}:</span>&nbsp;<span
                    dangerouslySetInnerHTML={{ __html: listQuestion && listQuestion.length > 0 && listQuestion[indexCurrent].question }}></span></p>
                <p className={`wrapQuestionItem ${checkTypeAnswer("A")}`}><strong>A: </strong>&nbsp;<label
                    htmlFor="answerA" dangerouslySetInnerHTML={{ __html: listQuestion && listQuestion.length > 0 && listQuestion[indexCurrent].answer1 }}
                ></label></p>
                <p className={`wrapQuestionItem ${checkTypeAnswer("B")}`}><strong>B: </strong>&nbsp;
                    <label dangerouslySetInnerHTML={{ __html: listQuestion && listQuestion.length > 0 && listQuestion[indexCurrent].answer2 }}
                        htmlFor="answerB"></label></p>
                <p className={`wrapQuestionItem ${checkTypeAnswer("C")}`} ><strong>C: </strong>&nbsp;<label
                    dangerouslySetInnerHTML={{ __html: listQuestion && listQuestion.length > 0 && listQuestion[indexCurrent].answer3 }}
                    htmlFor="answerC"></label></p>
                <p className={`wrapQuestionItem ${checkTypeAnswer("D")}`}><strong>D: </strong>&nbsp;<label
                    dangerouslySetInnerHTML={{ __html: listQuestion && listQuestion.length > 0 && listQuestion[indexCurrent].answer4 }}
                    htmlFor="answerD"></label></p>
            </div>

            {listQuestion && listQuestion.length > 0 && listQuestion[indexCurrent].explain && (
                <div className="wrapExplain">
                    <h3>Phần giải thích</h3>
                    <p className="contentExplain" dangerouslySetInnerHTML={{ __html: listQuestion && listQuestion.length > 0 && listQuestion[indexCurrent].explain }}></p>
                </div>
            )}

        </>
    )
}

export default DetailResultExam
