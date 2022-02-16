import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { axiosRoom } from '../../../API/roomAxios';
import { axiosUser } from '../../../API/userAxios';
import moment from 'moment';
import { Modal, Table, Tooltip, Avatar } from 'antd';
import axios from 'axios';
import { SelectRoomActionCreator } from '../../../Redux/ActionCreator';

const ListRoomNotActiveYet = ({ infoUser }) => {
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
    const { id } = useParams();
    const [openModal, setOpenModal] = useState(false)
    const token = useSelector(state => state.token)
    const [listRoom, setListRoom] = useState([]);
    const [listUserAll, setListUserAll] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    })
    const [listUserJoinRoom, setListUserJoinRoom] = useState([])
    const [infoRoom, setInfoRoom] = useState('');

    const [time, setTime] = useState({
        minutes: 0,
        seconds: 0,
    });

    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosRoom.get(`/`);
            const today = new Date(new Date().getTime());
            const arrComming = res.data.filter(item => moment(item.activeTime).diff(moment(today)) > 0)
            await setListRoom(arrComming);
            const resUserAll = await axios.get('/user/all_info', {
                headers: {
                    Authorization: token,
                }
            })
            setListUserAll(resUserAll.data);
        }
        fetchData()
        return () => fetchData()
    }, [token, id])


    const columns = [
        {
            title: 'Tên phòng thi ',
            dataIndex: 'nameRoom',
            key: 'nameRoom',
            sorter: (a, b) => a.nameRoom.length - b.nameRoom.length,
            sortOrder: sortedInfo.columnKey === 'nameRoom' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Thời gian hoàn thành', key: 'createdAt', render: (item) => (
                <span>
                    {moment(item.createdAt).format('dddd DD/MM/YYYY, h:mm:ss A')}
                </span>
            ),
        },
        {
            title: 'Số lượng thành viên',
            dataIndex: '',
            key: 'x',
            render: (role, record) =>
            (
                <p>{record.listUser.length}</p>
            )
        },
        {
            title: 'Action',
            dataIndex: '_id',
            key: '_id',
            render: (id, record) =>
                id ? (
                    <>
                        <div title="Sure to delete?" >
                            <p className="pointer" onClick={() => handleOpenDetail(record)}>Xem chi tiết </p>
                        </div>
                    </>
                ) : null,
        },
    ];

    const handleOpenDetail = async (record) => {
        const arrListUser = []
        record?.listUser?.forEach(data => {
            arrListUser.push(data.emailItemUser)
        })

        const newArr = listUserAll.filter(item => arrListUser?.includes(item.email))
        newArr.forEach(item => {
            record?.listUser?.forEach(tmp => {
                if (tmp.emailItemUser === item.email) {
                    item.key = item._id
                    item.timeFinish = tmp.timeFinish
                    item.point = tmp.point
                }
            })
        })
        await setListUserJoinRoom(newArr)
        const today = new Date();
        await setInfoRoom(record)
        await setTime({ minutes: moment(record?.activeTime).add(record?.testTimeRoom, 'minutes').diff(moment(today), 'minutes'), seconds: moment(record?.activeTime).add(record?.testTimeRoom, 'minutes').diff(moment(today), 'seconds') % 60 })
        await setOpenModal(true)
    }

    useEffect(() => {
        const countDownTime = setInterval(() => {
            if (time.seconds > 0) {
                setTime({
                    ...time,
                    seconds: time.seconds - 1,
                })
            }
            if (time.seconds === 0) {
                if (time.minutes === 0) {
                    clearInterval(countDownTime)
                } else {
                    setTime({
                        seconds: 59,
                        minutes: time.minutes - 1,
                    })
                }
            }
        }, 1000)
        return () => clearInterval(countDownTime)
    }, [time])

    const handleMovePageRoom = async (infoRoom) => {

        const resUser = await axios.get(`/user/infoById/${infoUser._id}`, {
            headers: {
                Authorization: token,
            }
        })
        await dispatch(SelectRoomActionCreator.ChangeRoom({ title: infoRoom.nameRoom, info: infoRoom, type: "coming", user: resUser.data }))
        history.push('/room-exam')

    }

    const handleDelete = () => {
        console.log("delete")
    }

    const handleChange = (pagination, filters, sorter) => {
        setValue({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };
    return (
        <>
            <Table className="wrapTabelContent" columns={columns} dataSource={listRoom} onChange={handleChange} />
            <Modal title="Thông tin chi tiết" visible={openModal} onOk={() => setOpenModal(false)} onCancel={() => setOpenModal(false)}>
                <h2>{infoRoom.nameRoom}</h2>
                <p>Người tạo phòng: <span>{infoRoom?.auth ? infoRoom?.auth : "Nguyễn Văn Long"}</span></p>
                <p>Thời gian thi: <span>{infoRoom.testTimeRoom} phút</span></p>
                <p>Thời gian bắt đầu thi: <span>{moment(infoRoom?.activeTime).add(infoRoom?.testTimeRoom, 'minutes').format('DD/MM/YYYY hh:mm A')}</span> </p>
                <p>Thời gian thi còn: <span>{`${time.minutes} phút ${time.seconds} giây`}</span></p>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>Số người dùng tham gia: <span>&nbsp;{infoRoom?.listUser?.length}</span> &nbsp;&nbsp;
                    <span >
                        <Avatar.Group maxCount={5}>
                            {listUserJoinRoom?.map((item, index) => (
                                <Tooltip key={index} title={item.name}>
                                    <Avatar src={item.avatar}>{item.avatar ? item.avatar : item.name.charAt(0).toUpperCase()}</Avatar>
                                </Tooltip>
                            ))}
                        </Avatar.Group>
                    </span>
                </p>
                <div className="wrapButton">
                    <button onClick={() => handleMovePageRoom(infoRoom)} className="btnSend">Đến phòng thi</button>
                </div>

            </Modal>
        </>
    )
}

export default ListRoomNotActiveYet
