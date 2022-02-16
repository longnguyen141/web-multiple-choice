import { InfoCircleOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { axiosExam } from '../../../../API/examAxios'
import InfoExam from './InfoExam.admin'
import ListQuestion from './ListQuestion.admin'
import ListUserJoinExam from './ListUserJoinExam.admin'

const TabsDetail = () => {
    const { TabPane } = Tabs;
    const [infomationExam, setInfomationExam] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const data = await axiosExam.get(`/${id}`);
            setInfomationExam(data.data);
        }
        fetchData();
        return () => {
            fetchData();
        }
    }, [id])
    return (
        <Tabs defaultActiveKey="1">
            <TabPane
                tab={
                    <span className="wrapIcon">
                        <InfoCircleOutlined />
                        Thông tin bộ đề
                    </span>
                }
                key="1"
            >
                <InfoExam infomationExam={infomationExam} />
            </TabPane>
            <TabPane
                tab={
                    <span className="wrapIcon">
                        <OrderedListOutlined />
                        Danh sách câu hỏi
                    </span>
                }
                key="2"
            >
                <ListQuestion ListQuestion={infomationExam.listQuestion} />
            </TabPane>
            <TabPane
                tab={
                    <span className="wrapIcon">
                        <TeamOutlined />
                        Danh sách tham gia kiểm tra
                    </span>
                }
                key="3"
            >
                <ListUserJoinExam />
            </TabPane>
        </Tabs>
    )
}

export default TabsDetail
