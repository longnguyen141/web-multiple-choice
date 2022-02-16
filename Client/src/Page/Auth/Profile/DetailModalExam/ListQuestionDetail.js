import React from 'react'

const ListQuestionDetail = ({ infoExam }) => {
    return (
        <div className="wrapQuestionList">
            {infoExam?.listQuestion.map((item, index) => (
                <div key={index} className="wrapQuestion__item">
                    <h3 className="question"> <span style={{ minWidth: '4rem' }}>Câu {index + 1}:&nbsp;</span> <span
                        dangerouslySetInnerHTML={{ __html: item.question }}></span></h3>
                    <p className="option"><span>A: &nbsp;</span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer1 }}></span></p>
                    <p className="option"><span>B: &nbsp;</span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer2 }}></span></p>
                    <p className="option"><span>C: &nbsp;</span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer3 }}></span></p>
                    <p className="option"><span>D: &nbsp;</span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer4 }}></span></p>
                    <p ><span className="txtStrong">Đáp án: &nbsp;</span> <span className='txtStrong' style={{color:'green'}}>{item.correct.toUpperCase()}</span></p>
                    <p className="explain"><span className="txtStrong" style={{ minWidth: '5.5rem' }}>Giải thích: </span>
                        <span dangerouslySetInnerHTML={{ __html: item?.explain }}></span></p>
                </div>
            ))}
        </div>
    )
}

export default ListQuestionDetail
