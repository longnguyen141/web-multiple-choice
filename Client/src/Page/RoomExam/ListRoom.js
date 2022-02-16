import React, { useEffect, useState } from 'react'
import { Collapse } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { SelectRoomActionCreator } from '../../Redux/ActionCreator'
import { axiosRoom } from '../../API/roomAxios'
import axios from 'axios'
import moment from 'moment'

const { Panel } = Collapse

const ItemRoomComming = ({ item }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token)
    const infoSelectRoom = useSelector(state => state.selectRoom)

    const handleOnChangeRoom = async (item) => {
        const resUser = await axios.get(`/user/infoById/${item.idUser}`, {
            headers: {
                Authorization: token,
            }
        })
        await dispatch(SelectRoomActionCreator.ChangeRoom({ title: item.nameRoom, info: item, type: "coming", user: resUser.data }))
    }

    return (
        <div onClick={() => handleOnChangeRoom(item)} className={`wrapItemRoomComing ${(infoSelectRoom.title === item.nameRoom && infoSelectRoom.type === "coming") ? 'active' : ''}`}>
            <p>#&nbsp;{item.nameRoom}</p>
        </div>
    )
}

const ItemRoomActive = ({ item }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token)
    const infoSelectRoom = useSelector(state => state.selectRoom)
    const handleOnChangeRoom = async (item) => {
        const resUser = await axios.get(`/user/infoById/${item.idUser}`, {
            headers: {
                Authorization: token,
            }
        })
        await dispatch(SelectRoomActionCreator.ChangeRoom({ title: item.nameRoom, info: item, type: "active", user: resUser.data }))
    }
    return (
        <div onClick={() => handleOnChangeRoom(item)} className={`wrapItemRoomActive ${(infoSelectRoom.title === item.nameRoom && infoSelectRoom.type === "active") ? 'active' : ''}`} >
            <p>#&nbsp;{item.nameRoom}</p>
        </div>
    )
}

const ItemRoomClose = ({ item }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token)
    const infoSelectRoom = useSelector(state => state.selectRoom)
    const handleOnChangeRoom = async (item) => {
        const resUser = await axios.get(`/user/infoById/${item.idUser}`, {
            headers: {
                Authorization: token,
            }
        })
        await dispatch(SelectRoomActionCreator.ChangeRoom({ title: item.nameRoom, info: item, type: "closed", user: resUser.data }))
    }
    return (
        <div onClick={() => handleOnChangeRoom(item)} className={`wrapItemRoomActive ${(infoSelectRoom.title === item.nameRoom && infoSelectRoom.type === "closed") ? 'active' : ''}`} >
            <p>#&nbsp;{item.nameRoom}</p>
        </div>
    )
}


const ListRoom = ({ handleChangeRoom }) => {
    const [listRoomsComming, setListRoomsComming] = useState([]);
    const [listRoomsActive, setListRoomsActive] = useState([]);
    const [listRoomsClosed, setListRoomsClosed] = useState([]);
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosRoom.get(`/getRoomByUserJoin/${auth.user.email}`, {
                headers: { Authorization: token }
            });
            const today = new Date();
            const arrComming = res.data.filter(item => moment(item.activeTime).subtract(7, 'hours').diff(moment(today).toISOString()) > 0)
            const arrActive = res.data.filter(item => (moment(item.activeTime).subtract(7, 'hours').add(item.testTimeRoom, 'minutes').diff(moment(today))) >= 0 && moment(item.activeTime).subtract(7, 'hours').diff(moment(today)) < 0)

            const arrClosed = res.data.filter(item => (moment(item.activeTime).subtract(7, 'hours').add(item.testTimeRoom, 'minutes').diff(moment(today))) < 0)
            await setListRoomsClosed(arrClosed);
            await setListRoomsComming(arrComming)
            await setListRoomsActive(arrActive)
        }
        fetchData()
        return () => fetchData()
    }, [auth.user, token])

    const handleOnChangeRoom = (title) => {
        if (handleChangeRoom) {
            handleChangeRoom(title)
        }
    }


    return (
        <Collapse defaultActiveKey={['comming']}>
            <Panel header={"Phòng thi sắp hoạt động"} key="comming" className="wrapRoom">
                {listRoomsComming.map((item, index) => (
                    <ItemRoomComming key={index} handleOnChangeRoom={handleOnChangeRoom} item={item} />
                ))}
            </Panel>
            <Panel header={"Phòng thi đang hoạt động"} key="active" className="wrapRoom">
                {listRoomsActive.map((item, index) => (
                    <ItemRoomActive key={index} handleOnChangeRoom={handleOnChangeRoom} item={item} />
                ))}
            </Panel>
            <Panel header={"Phòng thi đã đóng"} key="close" className="wrapRoom">
                {listRoomsClosed.map((item, index) => (
                    <ItemRoomClose key={index} handleOnChangeRoom={handleOnChangeRoom} item={item} />
                ))}
            </Panel>
        </Collapse>
    )
}

export default ListRoom
