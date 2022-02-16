import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TakeRoomActionCreator } from '../../../Redux/ActionCreator';

const InfoQuestion = () => {
    const answerDRef = useRef(null);
    const answerCRef = useRef(null);
    const answerBRef = useRef(null);
    const answerARef = useRef(null);
    const listQuestionRedux = useSelector(state => state.takeRoom?.listQuestion)
    const indexQuestionCurrent = useSelector(state => state.takeRoom?.selected);
    const dispatch = useDispatch();
    const handleChangeChooseAnswer = (index, value) => {
        dispatch(TakeRoomActionCreator.ChangeChooseQuestionRoom({ index, value }))
    }


    return (
        <>
            <p style={{ display: 'flex' }}><span className="txtStrong">Câu {indexQuestionCurrent + 1}:</span>&nbsp;
                <span dangerouslySetInnerHTML={{ __html: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[indexQuestionCurrent]?.question }}></span></p>
            <p onClick={() => answerARef.current.click()} className="wrapQuestionItem"><input ref={answerARef}
                onChange={() => console.log('')}
                checked={listQuestionRedux[indexQuestionCurrent]?.choose === "A" ? true : false}
                onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "A")} className="anwerRadio" type="radio" name="exam" id="answerA" />&nbsp;<strong >A:</strong>&nbsp;<label onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "A")} htmlFor="answerA"
                    dangerouslySetInnerHTML={{ __html: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[indexQuestionCurrent]?.answer1 }}></label></p>

            <p onClick={() => answerBRef.current.click()} className="wrapQuestionItem"><input ref={answerBRef}
                onChange={() => console.log('')}
                checked={listQuestionRedux[indexQuestionCurrent]?.choose === "B" ? true : false}
                onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "B")} className="anwerRadio" type="radio" name="exam" id="answerB" />&nbsp;<strong >B:</strong>&nbsp;<label htmlFor="answerB"
                    onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "B")}
                    dangerouslySetInnerHTML={{ __html: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[indexQuestionCurrent]?.answer2 }}></label></p>

            <p onClick={() => answerCRef.current.click()} className="wrapQuestionItem">
                <input
                    onChange={() => console.log('')} ref={answerCRef} onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "C")}
                    checked={listQuestionRedux[indexQuestionCurrent]?.choose === "C" ? true : false}
                    className="anwerRadio" type="radio" name="exam" id="answerC" />&nbsp;<strong >C:</strong>&nbsp;<label htmlFor="answerC"
                        onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "C")}
                        dangerouslySetInnerHTML={{ __html: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[indexQuestionCurrent]?.answer3 }}></label>
            </p>

            <p onClick={() => answerDRef.current.click()} className="wrapQuestionItem">
                <input ref={answerDRef} onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "D")}
                    onChange={() => console.log('')}
                    checked={listQuestionRedux[indexQuestionCurrent]?.choose === "D" ? true : false}
                    className="anwerRadio" type="radio" name="exam" id="answerD" />&nbsp;<strong >D:</strong>&nbsp;<label
                        htmlFor="answerD"
                        onClick={() => handleChangeChooseAnswer(indexQuestionCurrent, "D")}
                        dangerouslySetInnerHTML={{ __html: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[indexQuestionCurrent]?.answer4 }}></label></p>
        </>
    )
}
export default InfoQuestion;
