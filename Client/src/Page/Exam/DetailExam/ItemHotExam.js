import { ClockCircleOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'


const ItemHotExam = ({ item, index }) => {
    return (
        <div className="wrapItem" key={index}>
            <div className="wrapContent">
                <h2 className="title">{item?.title}</h2>
                <p className="description">
                    {item?.description}
                </p>
                <div className="wrapListTag">
                    {item?.tags.map((value, index) => (
                        <p key={index}>{value}</p>
                    ))}
                </div>
                <div className="wrapInfo">
                    <Tooltip title="Tên tác giả" placement="bottom">
                        <p className="wrapIcon"><UserOutlined />&nbsp; <span>{item?.authorName}</span></p>
                    </Tooltip>
                    <Tooltip title="Thời gian" placement="bottom">
                        <p className="wrapIcon"><ClockCircleOutlined />&nbsp;  <span>{item?.testTime} phút</span></p>
                    </Tooltip>
                    <Tooltip title="Số câu hỏi" placement="bottom">
                        <p className="wrapIcon"><QuestionCircleOutlined />&nbsp;  <span>{item?.listQuestion?.length} câu hỏi</span></p>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default ItemHotExam
