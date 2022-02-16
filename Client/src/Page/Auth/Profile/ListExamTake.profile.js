import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { axiosResult } from '../../../API/resultExamAxios';

const ListExamTakeProfile = () => {
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
            const resData = await axiosResult.get(`/getByIdUser/${id}`, {
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
            title: 'Tiêu đề ',
            dataIndex: 'titleExam',
            key: 'titleExam',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            filteredValue: filteredInfo.titleExam || null,
            onFilter: (value, record) => record.titleExam.includes(value),
            sorter: (a, b) => a.titleExam.length - b.titleExam.length,
            sortOrder: sortedInfo.columnKey === 'titleExam' && sortedInfo.order,
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
            (
                <p>{record.point / record.quantityQuestion * 10}</p>
            )
        },
        {
            title: 'Action',
            dataIndex: '_id',
            key: '_id',
            render: (id, record) => {
                return id ? (
                    <>
                        <div title="Sure to delete?" >
                            <p className="pointer" onClick={() => history.push(`/exam/take-exam/${record.idExam}/result`)}>Xem chi tiết </p>
                        </div>
                    </>
                ) : null
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

export default ListExamTakeProfile
