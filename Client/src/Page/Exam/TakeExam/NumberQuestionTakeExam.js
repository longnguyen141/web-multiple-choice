import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TakeExamActionCreator } from '../../../Redux/ActionCreator';

const NumberQuestionTakeExam = ({ resetRadio }) => {
    const listQuestionRedux = useSelector(state => state.takeExam?.listQuestion)
    const indexQuestionCurrent = useSelector(state => state.takeExam?.selected);
    const dispatch = useDispatch();

    const resetChooseAnswer = () => {
        if (!resetRadio) return;
        else resetRadio()
    }

    const handleSelectedQuestion = (index = null) => {
        resetChooseAnswer()
        dispatch(TakeExamActionCreator.ChooseQuestion(index))
    }
    const checkValidation = (index) => {
        if (index > listQuestionRedux.length) return;
        const questionIndex = listQuestionRedux[index];
        if (indexQuestionCurrent === index) return 'active'
        if (questionIndex.choose === '')
            return 'wrong';
        if (questionIndex.choose !== '') return 'finish'
    }

    return (
        <>
            {/* <div className="wapItemQuestion active">{1}</div>
            <div className="wapItemQuestion finish">{2}</div>
            <div className="wapItemQuestion wrong">{3}</div> */}
            {listQuestionRedux?.map((item, index) => (
                <div onClick={() => handleSelectedQuestion(index)} className={`wapItemQuestion ${checkValidation(index)}`} key={index}>{index + 1}</div>
            ))}
        </>
    )
}

export default NumberQuestionTakeExam
