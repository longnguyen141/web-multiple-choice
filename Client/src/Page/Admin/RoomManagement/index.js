import { Breadcrumb, Layout, Spin, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { axiosRoom } from '../../../API/roomAxios';
import SlideBar from '../../../Components/Admin/SlideBar';
import { handleMovePageAdmin } from '../../../Service/MovePageAdmin';

const ListRooms = () => {
    const { Header, Content, Footer } = Layout;
    const { id } = useParams();
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });

    const [listValue, setListValue] = useState([]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    })

    const history = useHistory();
    const auth = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)
    const check = localStorage.getItem('login')
    useEffect(() => {
        if (!check) {
            history.push('/admin/login')
        } else {
            if (auth.user.email && auth.user.role === 1) {
                setLoading(false);
            }
        }
    }, [auth.user, check, history])


    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosRoom.get('/');
            const newArr = [];
            for (let value of res.data) {
                value = {
                    ...value,
                    key: value._id
                }
                newArr.push(value)
            }
            setListValue(newArr)
        }
        fetchData();
    }, [])
    const today = new Date();
    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const dispath = useDispatch();
    const data = [
        {
            key: '1',
            name: 'John Brown',
            description: 'Tổng hợp Câu hỏi 1',
            timeStart: '11/11/2021',
            status: 'hoàn thành',
            timeTest: 50

        },
        {
            key: '2',
            name: 'Jim Green',
            description: 'Tổng hợp Câu hỏi 2',
            timeStart: '11/11/2021',
            status: 'hoàn thành',
            timeTest: 50,

        },
        {
            key: '3',
            name: 'Joe Black',
            description: 'Tổng hợp Câu hỏi 3',
            timeStart: '11/11/2021',
            status: 'chưa bắt đầu',
            timeTest: 40,

        },
        {
            key: '4',
            name: 'Jim Red',
            description: 'Tổng hợp Câu hỏi 4',
            timeStart: '11/11/2021',
            status: 'đang kiểm tra',
            timeTest: 15,

        },
    ];

    const columns = [
        {
            title: 'Tên phòng thi',
            dataIndex: 'nameRoom',
            key: 'nameRoom',
        },
        {
            title: 'Thời gian làm bài',
            dataIndex: 'testTimeRoom',
            key: 'testTimeRoom',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: '',
            key: 'y',
            render: (_, record) =>
                data.length >= 1 ? (
                    <>
                        {moment(record?.activeTime).format("DD/MM/YYYY hh:mm A")}
                    </>
                ) : null,
        },
        {
            title: 'Trạng thái',
            dataIndex: '',
            key: 'ab',
            render: (_, record) =>
                data.length >= 1 ? (
                    <>
                        {moment(record?.activeTime).diff(moment(today)) > 0 ? "chưa hoạt động" : (
                            (moment(record?.activeTime).add(record?.testTimeRoom, 'minutes')).diff(moment(today)) > 0 ? "đang hoạt động" : "đã hoàn thành"
                        )}
                    </>
                ) : null,
        },

        {
            title: 'Hành động',
            dataIndex: '',
            key: 'x',
            render: (_, record) =>
                data.length >= 1 ? (
                    <>
                        <div onClick={() => handleMovePageAdmin(`/admin/room/${_._id}`, 'listRooms', dispath, history)}>
                            <p className='pointer'>Xem chi tiết</p>
                        </div>
                    </>
                ) : null,
        },
    ];

    const handleChange = (filters, sorter) => {
        setValue({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    return loading ? <Spin /> : (
        <Layout className="containerDashboard">
            <SlideBar />
            <Layout className="containerLayoutContent">
                <Header className="wrapHeaderLayout" >
                    Quản lý phòng thi
                </Header>
                <Content className="wrapLayoutContent">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item onClick={() => history.push('/admin/exam')}>Phòng thi</Breadcrumb.Item>
                        <Breadcrumb.Item>Danh sách phòng thi</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="wrapContentMain" >
                        <div className="wrapButton" style={{ justifyContent: 'flex-end' }}>
                            <button onClick={() => handleMovePageAdmin('/admin/room-create', 'addRoom', dispath, history)} className="submit">{"Thêm phòng thi"}</button>
                        </div>
                        <Table className="wrapTabelContent" columns={columns} dataSource={listValue} onChange={handleChange} />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight © 2021</Footer>
            </Layout>
        </Layout>
    )
}

export default ListRooms
