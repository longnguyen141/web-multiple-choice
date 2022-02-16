import { Col, Popconfirm, Row, Select, Spin, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { axiosResultRoom } from '../../../../API/resultRoomAxios';
import { axiosRoom } from '../../../../API/roomAxios';


const { Option } = Select;

const ListUserJoinRoom = ({ valueRoom, reLoadValue, reloadData }) => {
    const token = useSelector(state => state.token);
    const [infoListUserJoin, setInfoListUserJoin] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false)
    const [listSelect, setListSelect] = useState([]);
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    })

    useEffect(() => {
        setLoading(reloadData)
    }, [reloadData])


    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('/user/all_info', {
                headers: {
                    Authorization: token,
                }
            })

            const listChildren = [];
            const arrayData = [];
            valueRoom?.listUser?.forEach(data => {
                arrayData.push(data.emailItemUser)
            })

            const dataFilter = res.data.filter(item => !arrayData?.includes(item.email))
            dataFilter.forEach(item => listChildren.push(<Option key={item.email}>{item.email}</Option>))

            await setChildren(listChildren);
            const newArr = res.data.filter(item => arrayData?.includes(item.email))
            newArr.forEach(item => {
                valueRoom?.listUser?.forEach(tmp => {
                    if (tmp.emailItemUser === item.email) {
                        item.key = item._id
                        item.timeFinish = tmp.timeFinish
                        item.point = tmp.point
                    }
                })
            })

            const resRoom = await axiosResultRoom.get(`/getByIdRoom/${valueRoom._id}`, {
                headers: { Authorization: token }
            })

            // await setInfoListUserJoin(newArr);
            await setInfoListUserJoin(resRoom.data);
        }
        fetchData()
        return () => fetchData()
    }, [token, valueRoom, loading])


    const handleRemove = async (record) => {
        try {
            const newData = []
            for (let value of listSelect) {
                newData.push({
                    emailItemUser: value,
                    point: 0,
                    timeFinish: 0,
                })
            }
            if (reLoadValue) {
                reLoadValue();
            }
            const dataUserJoin = valueRoom.listUser.filter(item => item.emailItemUser !== record.email)
            await axiosRoom.patch(`/addUserJoin/${valueRoom._id}`, { ...valueRoom, listUser: dataUserJoin }, {
                headers: { Authorization: token }
            })
            toast.success("Xoá người dùng khỏi phòng thành công");

        } catch (error) {
            error.response.data.msg && toast.error(error?.response?.data.msg)
        }
    }

    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const history = useHistory();
    const dispath = useDispatch();

    const columns = [
        {
            title: 'Name',
            dataIndex: 'userName',
            key: 'userName',
            align: 'center',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            filteredValue: filteredInfo.userName || null,
            onFilter: (value, record) => record.userName.includes(value),
            sorter: (a, b) => a.userName.length - b.userName.length,
            sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            align: 'center',
            key: 'email',
            ellipsis: true,
        },
        {
            title: 'Thời gian hoàn thành',
            dataIndex: 'createdAt',
            align: 'center',
            key: 'createdAt',
            sorter: (a, b) => a.createdAt - b.createdAt,
            sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Điểm',
            dataIndex: 'point',
            align: 'center',
            key: 'point',
            sorter: (a, b) => a.address - b.address,
            sortOrder: sortedInfo.columnKey === 'point' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Action',
            dataIndex: '_id',
            align: 'center',
            key: '_id',
            render: (id, record) =>
                id ? (
                    <>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleRemove(record)} >
                            <p className="pointer" >Xóa</p>
                        </Popconfirm>
                    </>
                ) : null,
        },
    ];

    const handleAddUserJoin = async () => {
        try {

            const newData = []
            for (let value of listSelect) {
                newData.push({
                    emailItemUser: value,
                    point: 0,
                    timeFinish: 0,
                })
            }
            const dataNewUserJoin = valueRoom.listUser.concat(newData)
            const res = await axiosRoom.patch(`/addUserJoin/${valueRoom._id}`, { ...valueRoom, listUser: dataNewUserJoin }, {
                headers: { Authorization: token }
            })
            await setListSelect([])
            if (reLoadValue) {
                await reLoadValue();
            }
            toast.success(res?.data.msg);

        } catch (error) {
            error.response.data.msg && toast.error(error?.response?.data.msg)
        }
    }

    function handleChangeSelect(value) {
        setListSelect(value);
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

    const exportTable = () => {

    }

    return !valueRoom ? <Spin /> : (
        <>
            <button className='btnImport' onClick={exportTable}>Tải danh sách</button>
            {moment(valueRoom.activeTime).add(valueRoom.testTimeRoom, 'minutes').diff(moment(new Date()), 'minutes') < 0 ? <></> : (
                <Row className="wrapSelect">
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <h3 className="txt">Mời người dùng tham gia phòng thi:</h3>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <Select value={listSelect} mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" onChange={handleChangeSelect}>
                            {children}
                        </Select>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4} style={{ textAlign: 'center' }}>
                        <button onClick={handleAddUserJoin} className="btnAdd">Thêm</button>
                    </Col>

                </Row>
            )}
            <Table className="wrapTabelContent" columns={columns} dataSource={infoListUserJoin} onChange={handleChange} pagination={pagination} />
        </>
    )
}

export default ListUserJoinRoom
