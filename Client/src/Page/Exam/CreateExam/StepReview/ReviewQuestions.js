import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ReviewQuestions = () => {
    const { id } = useParams();
    const dataRedux = useSelector(state => state.questionExam.listQuestion)
    const dataCreateRedux = useSelector(state => state.createExam.listQuestion);
    return (
        <div className="containerQuestionList">
            <div className="wrapQuestionList">
                {(id ? dataRedux : dataCreateRedux)?.map((item, index) => (
                    <div key={index} className="wrapQuestion__item">
                        {/* <div ></div> */}
                        <h3 ><span style={{ minWidth: '3.5rem' }}>Câu {index + 1}: </span><span className="question" dangerouslySetInnerHTML={{ __html: item.question }}></span></h3>
                        <p className="option"><span>A: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer1 }}></span></p>
                        <p className="option"><span>B: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer2 }}></span></p>
                        <p className="option"><span>C: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer3 }}></span></p>
                        <p className="option"><span>D: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer4 }}></span></p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ReviewQuestions
