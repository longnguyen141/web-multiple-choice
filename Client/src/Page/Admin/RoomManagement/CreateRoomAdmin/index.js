import { Breadcrumb, Layout, Spin } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Container } from 'reactstrap';
import SlideBar from '../../../../Components/Admin/SlideBar';
import MainCreateRoom from '../../../RoomExam/CreateRoom/MainCreateRoom';
const { Header, Content, Footer } = Layout;

const CreateRoomAdmin = () => {
    const history = useHistory();
    const { id } = useParams();
    const auth = useSelector(state => state.auth);
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

    return loading ? <Spin /> : (
        <Layout className="containerDashboard">
            <SlideBar />
            <Layout className="containerLayoutContent">
                <Header className="wrapHeaderLayout" >
                    Quản lý phòng thi
                </Header>
                <Content className="wrapLayoutContent">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item onClick={() => history.push('/admin/room')}>Phòng thi</Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? "Chỉnh sửa phòng thi" : "Thêm phòng thi"}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Container style={{ backgroundColor: '#fff', padding: '1rem' }}>
                        <MainCreateRoom type="admin" />
                    </Container>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default CreateRoomAdmin
