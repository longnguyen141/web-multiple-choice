import React from 'react'
const ListQuestion = ({ ListQuestion }) => {

    return (
        <div className="wrapQuestionList">
            {ListQuestion?.map((item, index) => (
                <div className="wrapQuestion__item">
                    <h3 className="question" ><span style={{ minWidth: '3.5rem' }}>Câu {index + 1}: </span><span
                        dangerouslySetInnerHTML={{ __html: item.question }}></span></h3>
                    <p className="option"><span>A: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer1 }}></span></p>
                    <p className="option"><span>B: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer2 }}></span></p>
                    <p className="option"><span>C: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer3 }}></span></p>
                    <p className="option"><span>D: </span> <span className="contentText" dangerouslySetInnerHTML={{ __html: item.answer4 }}></span></p>
                    <p ><span className="txtStrong">Đáp án: </span> <span className='txtStrong' style={{ color: 'green' }}>{item.correct.toUpperCase()}</span></p>
                    <p className="explain"><span className="txtStrong" style={{ minWidth: '5.5rem' }}>Giải thích: </span>
                        <span dangerouslySetInnerHTML={{ __html: item?.explain }}></span></p>
                </div>
            ))}
        </div>
    )
}

export default ListQuestion
