import { InfoCircleOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Modal, Switch, Table, Tabs } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosResultRoom } from '../../../API/resultRoomAxios';
import { axiosRoom } from '../../../API/roomAxios';
import { axiosUser } from '../../../API/userAxios';
import db from '../../../Firebase';
import DetailInfoRoomTabs from '../../Admin/RoomManagement/DetailInfoRoom/DetailInfoRoom.admin';
import ListQuestionRoom from '../../Admin/RoomManagement/DetailInfoRoom/ListQuestionRoom.admin';
import ListUserJoinRoom from '../../Admin/RoomManagement/DetailInfoRoom/ListUserJoinRoom.admin';

const ListRoomCreateByUserProfile = () => {
    const auth = useSelector(state => state.auth);
    const [openModal, setOpenModal] = useState(false)
    const [openModalSwitch, setOpenModalSwitch] = useState(false);
    const [switchRoom, setSwitchRoom] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
    const { id } = useParams();
    const [valueRoom, setValueRoom] = useState('')
    const token = useSelector(state => state.token)
    const [listUser, setListUser] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    })
    const today = new Date();

    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const history = useHistory();
    const dispath = useDispatch();
    const { TabPane } = Tabs;

    useEffect(() => {
        const fetchData = async () => {
            const resData = await axiosRoom.get(`/getRoomCreateByUser/${id}`, {
                headers: {
                    Authorization: token,
                }
            })
            await setListUser(resData.data);
        }
        fetchData()
        return () => fetchData()
    }, [token, id, reloadData])

    const columns = [
        {
            title: 'T??n ph??ng thi ',
            dataIndex: 'nameRoom',
            key: 'nameRoom',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            filteredValue: filteredInfo.nameRoom || null,
            onFilter: (value, record) => record.nameRoom.includes(value),
            sorter: (a, b) => a.nameRoom.length - b.nameRoom.length,
            sortOrder: sortedInfo.columnKey === 'nameRoom' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Th???i gian ho???t ?????ng', key: 'createdAt', render: (item) => (
                <span>
                    {moment(item.createdAt).format('dddd DD/MM/YYYY, h:mm:ss A')}
                </span>
            ),
        },
        {
            title: 'S??? th??nh vi??n tham gia',
            dataIndex: '',
            key: 'x',
            render: (role, record) =>
            (
                <p>{record?.listUser?.length}</p>
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
                            <p className="pointer" onClick={() => handleViewDetail(record._id)}>Xem chi ti???t </p>
                        </div>
                    </>
                ) : null,
        },
    ];

    const handleViewDetail = async (id) => {
        await setLoading(true)
        const res = await axiosRoom.get(`/infoRoom/${id}`, {
            headers: {
                Authorization: token
            }
        })
        const resResultRoom = await axiosResultRoom.get(`/getByIdRoom/${id}`, {
            headers: {
                Authorization: token
            }
        })

        const resLiserUser = await axiosUser.get(`/all_info`, {
            headers: {
                Authorization: token
            }
        })

        res.data.infoExamRoom.listQuestion.forEach(item => {
            item.choose = ""
        })

        const listUserJoin = res.data.listUser;
        const listUSerTaked = resResultRoom.data;

        await setSwitchRoom(res.data?.enable)
        await setValueRoom(res.data)
        await setOpenModal(true);

        if (listUserJoin.length === listUSerTaked.length) {
            return;
        } else {
            const listUserSkipTake = [];
            listUserJoin.forEach(item => {
                if (listUSerTaked.findIndex(value => value.email === item.emailItemUser) < 0) {
                    listUserSkipTake.push(item.emailItemUser);
                }
            })
            if (moment(res.data.activeTime).add(res.data.testTimeRoom, 'minutes').diff(new Date(), 'minutes') < 0) {
                listUserSkipTake.map(async (skipItem) => {
                    const newData = resLiserUser.data.filter(user => user.email === skipItem);
                    const data = {
                        idRoom: id,
                        idUser: newData[0]._id,
                        userName: newData[0].name,
                        nameRoom: res.data.nameRoom,
                        email: newData[0].email,
                        point: 0,
                        quantityQuestion: res.data.infoExamRoom.listQuestion.length,
                        timeTestRoom: res.data.testTime,
                        listQuestion: res.data.infoExamRoom.listQuestion,
                    }
                    await axiosResultRoom.post('/', data, {
                        headers: {
                            Authorization: token,
                        }
                    })
                })
            }

        }

    }
    const checkStatus = () => {
        if (valueRoom !== '') {
            if (moment(valueRoom.activeTime).add(valueRoom.testTimeRoom, 'minutes').diff(moment(today), 'minutes') > 0) {
                return true;
            }
            if (moment(valueRoom.activeTime).add(valueRoom.testTimeRoom, 'minutes').diff(moment(today), 'minutes') < 0) {
                return false
            }
        }
        return true;
    }
    useEffect(() => {

    }, [valueRoom, today])

    const reLoadValue = async () => {
        await setReloadData(!reloadData);
    }

    const handleChange = (pagination, filters, sorter) => {
        setValue({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    const handleDeleteRoom = async () => {
        try {
            const res = await axiosRoom.delete(`/delete-room/${valueRoom._id}`, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            await setOpenConfirmDelete(false)
            await setOpenModal(false)
            reLoadValue();
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }
    const handleUpdateSwitch = async () => {
        setOpenModal(false);
        try {
            await setSwitchRoom(!switchRoom);
            if (switchRoom === true) {
                valueRoom.listUser.forEach(async (item) => {
                    await db.collection('notifications').add({
                        id: auth.user._id,
                        avatar: auth.user.avatar,
                        userName: auth.user.name,
                        email: item?.emailItemUser,
                        enable: true,
                        message: `???? cho ph??p quy???n truy c???p ??i???m thi c???a b???n t???i ph??ng thi ${valueRoom?.nameRoom} h??y ki???m tr??? t???i ????y`,
                        link: `/room-exam/result/${valueRoom?._id}`,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                })
            } else {
                valueRoom.listUser.forEach(async (item) => {
                    await db.collection('notifications').add({
                        id: auth.user._id,
                        avatar: auth.user.avatar,
                        userName: auth.user.name,
                        enable: false,
                        email: item?.emailItemUser,
                        message: `???? thu h???i quy???n truy c???p ??i???m thi c???a b???n t???i ph??ng thi ${valueRoom?.nameRoom} h??y ki???m tr??? t???i ????y`,
                        link: `/room-exam/result/${valueRoom?._id}`,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                })
            }
            const res = await axiosResultRoom.post(`/update-enable`, { idRoom: valueRoom._id, idUser: id, type: switchRoom }, {
                headers: { Authorization: token }
            })
            await toast.success(res.data.msg);
        } catch (err) {
            err.response?.data.msg && toast.error(err.response?.data.msg)
        }
    }

    return (
        <>
            <Table className="wrapTabelContent" columns={columns} dataSource={listUser} onChange={handleChange} />
            <Modal className="modalProfileRoom" style={{ top: '5vh' }} title="Chi ti???t ph??ng thi" visible={openModal} onOk={handleUpdateSwitch} onCancel={() => setOpenModal(false)}>
                <div className="wrapButtonAdmin" style={{ alignItems: "center" }}>
                    <Switch
                        disabled={checkStatus()}
                        checked={switchRoom}
                        checkedChildren={"Tr??? ??i???m"}
                        // checkedChildren={<CheckOutlined />}
                        unCheckedChildren={"Ch??a tr??? ??i???m"}
                        // unCheckedChildren={<CloseOutlined />}
                        defaultChecked
                        onClick={() => setSwitchRoom(!switchRoom)}
                    />
                    <Button type="primary" onClick={() => history.push(`/room-exam/update-room/${valueRoom._id}`)}>edit</Button>
                    <Button onClick={() => setOpenConfirmDelete(true)} danger>delete</Button>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={
                            <span className="wrapIcon">
                                <InfoCircleOutlined />
                                Th??ng tin ph??ng thi
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
                                Danh s??ch c??u h???i
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
                                Danh s??ch tham gia ph??ng thi
                            </span>
                        }
                        key="3"
                    >
                        <ListUserJoinRoom valueRoom={valueRoom} reLoadValue={reLoadValue} reloadData={reloadData} />
                    </TabPane>
                </Tabs>
                <Modal title="Th??ng b??o" visible={openConfirmDelete} onOk={handleDeleteRoom} onCancel={() => setOpenConfirmDelete(false)}>
                    <h3>B???n ch???c ch???n mu???n x??a tr?????ng d??? li???u n??y?</h3>
                </Modal>

            </Modal>
        </>
    )
}


export default ListRoomCreateByUserProfile
