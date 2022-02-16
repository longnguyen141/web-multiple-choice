import { Col, Row, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import InfoRoom from './InfoRoom'
import InfoRoomClosed from './InfoRoomClosed'
import ListRoom from './ListRoom'
import moment from 'moment'
import { RoomActionCreator } from '../../Redux/ActionCreator'

const MainRoom = () => {
    const history = useHistory();
    const dispatch = useDispatch()
    const roomSelected = useSelector(state => state.selectRoom);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetch = async () => {
            await setLoading(true)
            if (roomSelected.info !== '') {
                await setLoading(false)
            }
        }
        fetch()
    }, [roomSelected])

    const handleMoveCreateRoom = async (link) => {
        await dispatch(RoomActionCreator.ClearRoom())
        await history.push(link);
    }

    return (
        <div className="containerMainRooms">

            <Row className="wrapContentMainRoom">

                <Col className="wrapListRoom" xs={24} sm={24} md={7} lg={7}>
                    <div className="wrapButton left">
                        <button className="btnSend" onClick={() => handleMoveCreateRoom('/room-exam/create')}>Tạo phòng thi mới</button>
                    </div>
                    <h2>
                        Danh sach phong thi
                    </h2>
                    <ListRoom />

                </Col>
                <Col className="wrapInfoRoom" xs={24} sm={24} md={16} lg={16}>
                    {loading === true ? <Spin /> :
                        roomSelected.type === "closed" ?
                            <InfoRoomClosed date={moment(roomSelected?.info?.activeTime).subtract(7, 'hours')} /> :
                            <InfoRoom date={moment(roomSelected?.info?.activeTime).subtract(7, 'hours')} />
                    }
                </Col>
            </Row>
        </div>
    )
}

export default React.memo(MainRoom)
