import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TakeExamActionCreator } from '../../../Redux/ActionCreator';

const NumberQuestionResult = ({ listQuestion }) => {
    const indexQuestionCurrent = useSelector(state => state.resultExam?.selected);
    const dispatch = useDispatch();

    const handleSelectedQuestion = (index = null) => {
        dispatch(TakeExamActionCreator.ChooseQuestion(index))
    }
    const checkValidation = (index) => {
        if (index > listQuestion.length) return;
        const questionIndex = listQuestion[index];
        if (indexQuestionCurrent === index) return 'active'
        if (questionIndex.choose !== questionIndex.correct)
            return 'wrong';
        if (questionIndex.choose === questionIndex.correct) return 'finish'
    }

    return (
        <>
            {/* <div className="wapItemQuestion active">{1}</div>
            <div className="wapItemQuestion finish">{2}</div>
            <div className="wapItemQuestion wrong">{3}</div> */}
            {listQuestion?.map((item, index) => (
                <div onClick={() => handleSelectedQuestion(index)} className={`wapItemQuestion ${checkValidation(index)}`} key={index}>{index + 1}</div>
            ))}
        </>
    )
}

export default NumberQuestionResult
