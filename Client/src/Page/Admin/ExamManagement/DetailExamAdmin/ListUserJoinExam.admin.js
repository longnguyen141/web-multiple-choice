import { Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import xlsx from 'xlsx'
import { useHistory, useParams } from 'react-router-dom';
import { axiosResult } from '../../../../API/resultExamAxios';
import axios from 'axios';
import moment from 'moment';

const ListUserJoinExam = () => {
    const { id } = useParams()
    const [infoListUser, setInfoListUser] = useState([]);
    const [listUserAll, setListUserAll] = useState([])
    const [loadData, setLoadData] = useState(false);
    const token = useSelector(state => state.token);
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    })

    const [valueExport, setValueExport] = useState('')

    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const history = useHistory();
    const dispath = useDispatch();
    const data = [
        {
            key: '1',
            name: 'John Brown',
            timeTest: 32,
            timeJoin: '22/11/2021',
            point: 8
        },
        {
            key: '2',
            name: 'Jim Green',
            timeTest: 42,
            timeJoin: '22/11/2021',
            point: 7
        },
        {
            key: '3',
            name: 'Joe Black',
            timeTest: 32,
            timeJoin: '22/11/2021',
            point: 8
        },
        {
            key: '4',
            name: 'Jim Red',
            timeTest: 32,
            timeJoin: '22/11/2021',
            point: 9
        },
    ];

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Thời gian hoàn thành',
            dataIndex: 'TimeFinish',
            key: 'timeTest',

        },
        {
            title: 'Email',
            dataIndex: 'Email',
            key: 'email',

        },
        {
            title: 'Điểm',
            dataIndex: 'point',
            key: 'point',

        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosResult.post('/getByExam', { idExam: id }, {
                headers: {
                    Authorization: token,
                }
            })
            const resUser = await axios.get('/user/all_info', { headers: { Authorization: token } })

            await setListUserAll(resUser.data);
            await setInfoListUser(res.data);
            await setLoadData(!loadData);
        }
        fetchData()
        return () => fetchData();
    }, [token, id])

    useEffect(() => {
        if (listUserAll && listUserAll.length > 0 && infoListUser && infoListUser.length > 0) {
            const fetchDateExport = async () => {
                let dataExport = [];
                await infoListUser.forEach(item => {
                    const index = listUserAll.findIndex(value => value._id === item.idUser)
                    console.log(item)
                    dataExport.push({
                        Name: item.userName,
                        Email: index !== -1 && listUserAll[index].email,
                        TimeFinish: moment(item.createdAt).subtract(7, 'hours').format('ddd DD-MM-YYYY HH:mm A'),
                        point: Math.round(item.point / item.listQuestion.length * 10) * 100 / 100,
                    })
                    return <div key={item._id}></div>
                })
                await setValueExport(dataExport);
            }
            fetchDateExport()
            return () => fetchDateExport()
        }
    }, [listUserAll, infoListUser, loadData])

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
        const newList = [];
        for (let value of valueExport) {
            const newObject = {
                Tên: value.Name,
                Thời_gian_hoàn_thành: value.TimeFinish,
                Email: value.Email,
                Điểm: value.point,
            }
            newList.push(newObject);
        }
        const workSheet = xlsx.utils.json_to_sheet(newList);
        const workBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workBook, workSheet, "list");
        //buffer
        // let buf = xlsx.write(workBook, { bookType: 'xlsx', type: 'buffer' });
        //Binary string
        xlsx.write(workBook, { bookType: 'xlsx', type: 'binary' })
        xlsx.writeFile(workBook, "DanhSach.xlsx")
    }

    return (
        <>
            <button className='btnImport' onClick={exportTable}>Tải danh sách</button>
            <Table className="wrapTabelContent" columns={columns} dataSource={valueExport} onChange={handleChange} pagination={pagination} />
        </>
    )
}

export default ListUserJoinExam
