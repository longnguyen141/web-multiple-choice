import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TakeRoomActionCreator } from '../../../Redux/ActionCreator';

const NumberQuestionTakeRoom = ({ resetRadio }) => {
    const listQuestionRedux = useSelector(state => state.takeRoom?.listQuestion)
    const indexQuestionCurrent = useSelector(state => state.takeRoom?.selected);
    const dispatch = useDispatch();

    const resetChooseAnswer = () => {
        if (!resetRadio) return;
        else resetRadio()
    }

    const handleSelectedQuestion = (index = null) => {
        resetChooseAnswer()
        dispatch(TakeRoomActionCreator.ChooseQuestion(index))
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
            {listQuestionRedux?.map((item, index) => (
                <div onClick={() => handleSelectedQuestion(index)} className={`wapItemQuestion ${checkValidation(index)}`} key={index}>{index + 1}</div>
            ))}
        </>
    )
}

export default NumberQuestionTakeRoom
