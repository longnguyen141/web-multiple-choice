import { Table } from 'ant-table-extensions';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import xlsx from 'xlsx';
import { axiosResult } from '../../../../API/resultExamAxios';

const ListUserTakeExam = ({ infoExam }) => {
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
    const [valueExport, setValueExport] = useState('');
    const [listUserAll, setListUserAll] = useState([])
    const handleChange = (pagination, filters, sorter) => {
        setValue({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };
    const [loadData, setLoadData] = useState(false);
    const [infoListUser, setInfoListUser] = useState([]);
    const token = useSelector(state => state.token);

    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const history = useHistory();
    const dispath = useDispatch();


    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosResult.post('/getByExam', { idExam: infoExam._id }, {
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
    }, [token, infoExam])

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
                        TimeFinish: moment(item.createdAt).format('DD-MM-YYYY HH:mm A'),
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

    const exportTable = () => {
        const workSheet = xlsx.utils.json_to_sheet(valueExport);
        const workBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workBook, workSheet, "list");
        //buffer
        // let buf = xlsx.write(workBook, { bookType: 'xlsx', type: 'buffer' });
        //Binary string
        xlsx.write(workBook, { bookType: 'xlsx', type: 'binary' })
        xlsx.writeFile(workBook, "DanhSach.xlsx")
    }

    useEffect(() => {

    }, [])

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
            dataIndex: '',
            align: 'center',
            key: 'x',
            ellipsis: true,
            render: (id, record) =>
            (
                <>
                    {listUserAll.map((item, index) => item._id === record.idUser && (<div key={index}>{item.email}</div>))}
                </>
            )
        },
        {
            title: 'Thời gian hoàn thành',
            dataIndex: '',
            align: 'center',
            key: 'y',
            render: (id, record) =>
                id ? (
                    <>
                        <p className="pointer" >{moment(record.createdAt).format('DD-MM-YYYY HH:mm A')}</p>
                    </>
                ) : null,
        },
        {
            title: 'Point',
            dataIndex: '',
            align: 'center',
            key: 'y',
            sorter: (a, b) => a.address - b.address,
            sortOrder: sortedInfo.columnKey === 'point' && sortedInfo.order,
            ellipsis: true,
            render: (id, record) =>
                id ? (
                    <>
                        <p className="pointer" >{Math.round((record.point / record.listQuestion.length) * 10 * 100) / 100}</p>
                    </>
                ) : null,
        },
    ];
    return (
        <>
            <button className='btnImport' onClick={exportTable}>Tải danh sách</button>
            <Table className="wrapTabelContent" columns={columns} dataSource={infoListUser} onChange={handleChange} />
        </>
    )
}

export default ListUserTakeExam
