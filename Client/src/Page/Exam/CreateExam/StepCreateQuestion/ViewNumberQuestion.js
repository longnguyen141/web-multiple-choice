import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CreateExam, QuestionExamActionCreator } from '../../../../Redux/ActionCreator';

const ViewNumberQuestion = ({ propsListQuestion }) => {
    const listQuestionRedux = useSelector(state => state.questionExam.listQuestion)
    const indexQuestionCurrent = useSelector(state => state.questionExam.selected);
    const createListQuestionRedux = useSelector(state => state.createExam.listQuestion)
    const createIndexQuestionCurrent = useSelector(state => state.createExam.selected);
    const [loadData, setLoadData] = useState(false);

    const dispatch = useDispatch();
    const { id } = useParams()

    const handleAddNewQuestion = async () => {
        if (id) {
            await dispatch(QuestionExamActionCreator.AddNewQuestion())
            setTimeout(() => {
                dispatch(QuestionExamActionCreator.ChooseQuestion(listQuestionRedux.length))
            }, 200)
        } else {
            await dispatch(CreateExam.CreatExamAddNewQuestion())
            // setTimeout(() => {
            dispatch(CreateExam.CreatExamChooseQuestion(createListQuestionRedux.length))
            // }, 500)
        }
    }

    const handleSelectedQuestion = (index = null) => {
        if (id) {
            dispatch(QuestionExamActionCreator.ChooseQuestion(index))
        } else {
            dispatch(CreateExam.CreatExamChooseQuestion(index))
        }
    }

    const checkValidation = (index, value, indexRedux) => {
        if (index > value.length) return;
        const questionIndex = value[index];
        if (indexRedux === index) return 'active'
        else if (questionIndex.question === '' || questionIndex.answer1 === '' || questionIndex.answer2 === '' || questionIndex.answer3 === '' || questionIndex.answer4 === '' || questionIndex.correct === '')
            return 'wrong';
        if (questionIndex.question !== '' || questionIndex.answer1 !== '' || questionIndex.answer2 !== '' || questionIndex.answer3 !== '' || questionIndex.answer4 !== '' || questionIndex.correct !== '') return 'finish'
    }

    const handleRemoveQuestion = async (e, index) => {
        e.preventDefault();
        if (id) {
            if (index === 0) {
                await dispatch(QuestionExamActionCreator.RemoveQuestionRemoveQuestion(index))
                await dispatch(QuestionExamActionCreator.ChooseQuestion(1))
                await dispatch(QuestionExamActionCreator.ChooseQuestion(0))
            } else {
                await dispatch(QuestionExamActionCreator.ChooseQuestion(index - 1))
                dispatch(QuestionExamActionCreator.RemoveQuestion(index))
            }
            // createListQuestionRedux.pop();
            await setLoadData(!loadData)
        } else {
            if (index === 0) {
                await dispatch(CreateExam.CreateExamRemoveQuestion(index))
                await dispatch(CreateExam.CreatExamChooseQuestion(1))
                await dispatch(CreateExam.CreatExamChooseQuestion(0))
            } else {
                await dispatch(CreateExam.CreatExamChooseQuestion(index - 1))
                dispatch(CreateExam.CreateExamRemoveQuestion(index))
            }
            // createListQuestionRedux.pop();
            await setLoadData(!loadData)
        }
    }

    return (
        <>
            {/* <div className="wapItemQuestion active">{1}</div>
            <div className="wapItemQuestion finish">{2}</div>
            <div className="wapItemQuestion wrong">{3}</div> */}
            {(id ? listQuestionRedux : createListQuestionRedux)?.map((item, index) => (
                <div className='wrapSelectNumber'>
                    <div onClick={() => handleSelectedQuestion(index)} className={`wapItemQuestion ${checkValidation(index, id ? listQuestionRedux : createListQuestionRedux, id ? indexQuestionCurrent : createIndexQuestionCurrent)}`} key={index}>{index + 1}
                    </div>
                    {(id ? listQuestionRedux : createListQuestionRedux).length > 1 && (
                        <Button onClick={(e) => handleRemoveQuestion(e, index)} className='removeQuestion'>
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