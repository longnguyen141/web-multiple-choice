import { Breadcrumb, Layout, Spin, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { axiosExam } from '../../../API/examAxios';
import SlideBar from '../../../Components/Admin/SlideBar';
import { handleMovePageAdmin } from '../../../Service/MovePageAdmin';

const ListExams = () => {
    const { Header, Content, Footer } = Layout;
    const [value, setValue] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
    const history = useHistory();

    const [listExam, setListExam] = useState([]);
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
        const fetchExam = async () => {
            const res = await axiosExam.get('/', null);
            setListExam(res.data)
        }
        fetchExam();
    }, [])

    let { filteredInfo, sortedInfo } = value;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const dispath = useDispatch();


    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',

        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',

        },
        {
            title: 'Thời gian làm bài',
            dataIndex: 'testTime',
            key: 'testTime',

        },

        {
            title: 'Hành động',
            dataIndex: '_id',
            key: '_id',
            render: (id, record) =>
                id ? (
                    <>
                        <div  >
                            <p className='pointer' onClick={() => handleMovePageAdmin(`/admin/exam/${id}`, 'listExams', dispath, history)}>Xem chi tiết </p>
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
                    Quản lý Bộ đề
                </Header>
                <Content className="wrapLayoutContent">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item onClick={() => history.push('/admin/exam')}>Bộ đề</Breadcrumb.Item>
                        <Breadcrumb.Item>Danh sách bộ đề</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="wrapContentMain" >
                        <div className="wrapButton" style={{ justifyContent: 'flex-end' }}>
                            <button onClick={() => handleMovePageAdmin('/admin/exam/create', 'addExam', dispath, history)} className="submit">Thêm bộ đề</button>
                        </div>
                        <Table className="wrapTabelContent" columns={columns} dataSource={listExam} onChange={handleChange} />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default ListExams
