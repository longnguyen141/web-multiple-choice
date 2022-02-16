import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { axiosResultRoom } from '../../../API/resultRoomAxios';

const ListRoomJoin = () => {
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
    const { id } = useParams();
    const token = useSelector(state => state.token)
    const [listUser, setListUser] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    })

    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const history = useHistory();
    const dispath = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const resData = await axiosResultRoom.get(`/getByIdUser/${id}`, {
                headers: {
                    Authorization: token,
                }
            })
            await setListUser(resData.data);
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
            title: 'Điểm',
            dataIndex: '',
            key: 'x',
            render: (role, record) =>
                record.enable === true ? (
                    <p>{Math.round((record.point / record.quantityQuestion * 10) * 100) / 100}</p>
                ) : (
                    <p>{"chưa có kết quả"}</p>
                )
        },
        {
            title: 'Action',
            dataIndex: '_id',
            key: '_id',
            render: (id, record) => {
                return (
                    id ? (
                        <>
                            <div title="Sure to delete?" >
                                <button disabled={!record.enable && true} className={`pointer ${record.enable && "btn-update"}`} style={{ width: '120px', padding: '0.5rem 1rem' }}
                                    onClick={() => history.push(`/room-exam/result/${record.idRoom}`)}>Xem chi tiết </button>
                            </div>
                        </>
                    ) : null
                )
            }
        },
    ];

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
            <Table className="wrapTabelContent" columns={columns} dataSource={listUser} onChange={handleChange} />
        </>
    )

}

export default ListRoomJoin
