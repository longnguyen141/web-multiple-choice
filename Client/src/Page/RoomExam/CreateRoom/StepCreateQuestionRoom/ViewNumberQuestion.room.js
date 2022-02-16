import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RoomActionCreator, RoomUpdateActionCreator } from '../../../../Redux/ActionCreator';
import { useParams } from 'react-router-dom';

const ViewNumberQuestion = ({ propsListQuestion, number }) => {
    const { id } = useParams();
    const listQuestionRedux = useSelector(state => state?.room?.infoExamRoom?.listQuestion)
    const indexQuestionCurrent = useSelector(state => state?.room?.selected);
    const listQuestionReduxUpdate = useSelector(state => state?.updateRoom?.infoExamRoom?.listQuestion)
    const indexQuestionCurrentUpdate = useSelector(state => state?.updateRoom?.selected);
    const [loadData, setLoadData] = useState(false);
    const dispatch = useDispatch();

    const handleAddNewQuestion = async () => {
        if (id) {
            await dispatch(RoomUpdateActionCreator.AddNewQuestionUpdate())
            // await setTimeout(() => {
            dispatch(RoomUpdateActionCreator.ChooseQuestionUpdate(listQuestionReduxUpdate.length))
            // }, 200)
        } else {
            await dispatch(RoomActionCreator.AddNewQuestion())
            // await setTimeout(() => {
            dispatch(RoomActionCreator.ChooseQuestion(listQuestionRedux.length))
            // }, 200)
        }
    }
    const handleSelectedQuestion = (index = null) => {
        if (id) {
            dispatch(RoomUpdateActionCreator.ChooseQuestionUpdate(index))
        } else {
            dispatch(RoomActionCreator.ChooseQuestion(index))
        }
    }

    // const checkValidation = (index) => {
    //     if (index > listQuestionRedux.length) return;
    //     const questionIndex = listQuestionRedux[index];
    //     if (indexQuestionCurrent === index) return 'active'
    //     else if (questionIndex.question === '' || questionIndex.answer1 === '' || questionIndex.answer2 === '' || questionIndex.answer3 === '' || questionIndex.answer4 === '' || questionIndex.correct === '')
    //         return 'wrong';
    //     if (questionIndex.question !== '' || questionIndex.answer1 !== '' || questionIndex.answer2 !== '' || questionIndex.answer3 !== '' || questionIndex.answer4 !== '' || questionIndex.correct !== '') return 'finish'
    // }
    const checkValidation = (index, value, indexRedux) => {
        if (index > value.length) return;
        const questionIndex = value[index];
        if (indexRedux === index) return 'active'
        else if (questionIndex?.question === '' || questionIndex?.answer1 === '' || questionIndex?.answer2 === '' || questionIndex?.answer3 === '' || questionIndex?.answer4 === '' || questionIndex?.correct === '')
            return 'wrong';
        if (questionIndex?.question !== '' || questionIndex?.answer1 !== '' || questionIndex?.answer2 !== '' || questionIndex?.answer3 !== '' || questionIndex?.answer4 !== '' || questionIndex?.correct !== '') return 'finish'
    }

    const handleRemoveQuestion = async (e, index) => {
        e.preventDefault();
        if (id) {
            if (index === 0) {
                await dispatch(RoomUpdateActionCreator.RemoveQuestionUpdate(index))
                await dispatch(RoomUpdateActionCreator.ChooseQuestionUpdate(1))
                await dispatch(RoomUpdateActionCreator.ChooseQuestionUpdate(0))
            } else {
                await dispatch(RoomUpdateActionCreator.ChooseQuestionUpdate(index - 1))
                await dispatch(RoomUpdateActionCreator.RemoveQuestionUpdate(index))
            }
        } else {
            if (index === 0) {
                await dispatch(RoomActionCreator.RemoveQuestion(index))
                await dispatch(RoomActionCreator.ChooseQuestion(1))
                await dispatch(RoomActionCreator.ChooseQuestion(0))
            } else {
                await dispatch(RoomActionCreator.ChooseQuestion(index - 1))
                await dispatch(RoomActionCreator.RemoveQuestion(index))
            }

        }
        await setLoadData(!loadData)

    }

    return (
        <>
            {/* <div className="wapItemQuestion active">{1}</div>
            <div className="wapItemQuestion finish">{2}</div>
            <div className="wapItemQuestion wrong">{3}</div> */}
            {(id ? listQuestionReduxUpdate : listQuestionRedux)?.map((item, index) => (
                <div className='wrapSelectNumber'>
                    <div onClick={() => handleSelectedQuestion(index)} className={`wapItemQuestion ${checkValidation(index, id ? listQuestionReduxUpdate : listQuestionRedux, (id ? indexQuestionCurrentUpdate : indexQuestionCurrent))}`} key={index}>{index + 1}</div>
                    {(id ? listQuestionReduxUpdate : listQuestionRedux).length > 1 && (
                        <Button
                            onClick={(e) => handleRemoveQuestion(e, index)}
                            className='removeQuestion'>
                            <MinusOutlined />
                        </Button>
                    )}
                </div>
            ))}
            <button onClick={handleAddNewQuestion} className="wapItemQuestion addNew">
                <PlusOutlined />
            </button>
        </>
    )
}

export default ViewNumberQuestion
