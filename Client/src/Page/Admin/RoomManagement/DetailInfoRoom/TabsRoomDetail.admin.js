import { InfoCircleOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { axiosRoom } from '../../../../API/roomAxios'
import DetailInfoRoomTabs from './DetailInfoRoom.admin'
import ListQuestionRoom from './ListQuestionRoom.admin'
import ListUserJoinRoom from './ListUserJoinRoom.admin'

const TabsRoomDetail = () => {
    const { TabPane } = Tabs
    const { id } = useParams();
    const token = useSelector(state => state.token)
    const [valueRoom, setValueRoom] = useState('')
    const [reloadData, setReloadData] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosRoom.get(`/infoRoom/${id}`, {
                headers: {
                    Authorization: token,
                }
            })
            await setValueRoom(res.data);
        }
        fetchData();
        return () => fetchData()
    }, [token, id, reloadData]);

    const reLoadValue = async () => {
        await setReloadData(!reloadData);
    }

    return (
        <Tabs defaultActiveKey="1">
            <TabPane
                tab={
                    <span className="wrapIcon">
                        <InfoCircleOutlined />
                        Thông tin phòng thi
                    </span>
                }
                key="1"
            >
                <DetailInfoRoomTabs valueRoom={valueRoom} />
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
                <ListQuestionRoom valueRoom={valueRoom} />
            </TabPane>
            <TabPane
                tab={
                    <span className="wrapIcon">
                        <TeamOutlined />
                        Danh sách tham gia phòng thi
                    </span>
                }
                key="3"
            >
                <ListUserJoinRoom valueRoom={valueRoom} reLoadValue={reLoadValue} />
            </TabPane>
        </Tabs>
    )
}

export default TabsRoomDetail
