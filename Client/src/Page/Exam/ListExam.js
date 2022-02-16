import { LaptopOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { axiosCategory } from '../../API/categoryAxios'
import TabContent from './TabContent'


const ListExam = () => {
    const { TabPane } = Tabs
    const [listTags, setListTags] = useState([]);
    useEffect(() => {
        const fetchListTags = async () => {
            await axiosCategory.get('/').then(res => setListTags(res.data))
        }
        fetchListTags();
        return () => fetchListTags()
    }, [])
    return (
        <div className="wrapTabsCategory">
            <h1 style={{marginTop:'10px'}}>Bộ đề ôn tập</h1>
            <div className="wrapTabsCategory__list">
                <Tabs defaultActiveKey="0" >
                    {listTags.map((item, index) => (
                        <TabPane
                            key={index}
                            tab={
                                <span className="wrapIcon">
                                    <LaptopOutlined />
                                    {item.displayName}
                                </span>
                            }
                        >
                            <TabContent tagId={item._id} tagChild={item.childrents} />
                        </TabPane>
                    ))}
                </Tabs>
            </div>

        </div>
    )
}

export default ListExam
