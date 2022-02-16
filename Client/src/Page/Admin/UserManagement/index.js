import { Breadcrumb, Layout, Popconfirm, Spin, Table, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { axiosUser } from '../../../API/userAxios';
import SlideBar from '../../../Components/Admin/SlideBar';
import { handleMovePageAdmin } from '../../../Service/MovePageAdmin';

const ListUsers = () => {
    const { Header, Content, Footer } = Layout;
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
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
        const fetchUser = async () => {
            const resData = await axiosUser.get('/all_info', {
                headers: {
                    Authorization: token,
                }
            })
            setListUser(resData.data);
        }
        fetchUser()
        return () => fetchUser()
    }, [token])

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            action: 'Delete'
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            action: 'Delete'
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            action: 'Delete'
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
            action: 'Delete'
        },
    ];

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name.includes(value),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.age - b.age,
            sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
            ellipsis: true,
            render: email => (
                <Tooltip placement="bottom" title={email}>
                    {email}
                </Tooltip>
            ),
        },
        {
            title: 'Thời gian tạo', key: 'createdAt', render: (item) => (
                <Tooltip title={moment(item.createdAt).subtract(6, 'days').calendar()} >
                    <span>
                        {moment(item.createdAt).format('dddd DD/MM/YYYY, h:mm:ss A')}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Phân quyền',
            dataIndex: 'role',
            key: 'x',
            render: (role, record) =>
            (
                <p>{role}</p>
            )
        },
        {
            title: 'Hành động',
            dataIndex: '_id',
            key: '_id',
            render: (id, record) =>
                id ? (
                    <>
                        <div >
                            <p className='pointer' onClick={() => handleMovePageAdmin(`/admin/user/${id}`, 'listUsers', dispath, history)}>Xem chi tiết </p>
                        </div>
                    </>
                ) : null,
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


    return loading ? <Spin /> : (
        <Layout className="containerDashboard">
            <SlideBar />
            <Layout className="containerLayoutContent">
                <Header className="wrapHeaderLayout" >
                    Quản lý người dùng
                </Header>
                <Content className="wrapLayoutContent">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item onClick={() => history.push('/admin/user')}>Người dùng</Breadcrumb.Item>
                        <Breadcrumb.Item>Danh sách người dùng</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="wrapContentMain" >
                        <div className="wrapButton" style={{ justifyContent: 'flex-end' }}>
                            <button onClick={() => handleMovePageAdmin('/admin/user/create', 'addUser', dispath, history)} className="submit">Thêm người dùng</button>
                        </div>
                        <Table className="wrapTabelContent" columns={columns} dataSource={listUser} onChange={handleChange} />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default ListUsers
