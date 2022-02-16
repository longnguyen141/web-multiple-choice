import { Breadcrumb, Button, Layout, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Container } from 'reactstrap';
import { axiosRoom } from '../../../../API/roomAxios';
import SlideBar from '../../../../Components/Admin/SlideBar';
import TabsRoomDetail from './TabsRoomDetail.admin';

const { Header, Content, Footer } = Layout;

const DetailInfoRoomAdmin = () => {
    const { id } = useParams();
    const history = useHistory();
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
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

    const handleDeleteRoom = async () => {
        try {
            const res = await axiosRoom.delete(`/delete-room/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            history.push('/admin/room');
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }
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
                        <Breadcrumb.Item>Chi tiết phòng thi</Breadcrumb.Item>
                    </Breadcrumb>
                    <Container style={{ backgroundColor: '#fff', padding: '1rem' }}>
                        <div className="wrapButtonAdmin">
                            <Button type="primary" onClick={() => history.push(`/admin/update-room/${id}`)}>Chỉnh sửa</Button>
                            <Button onClick={() => setOpenConfirmDelete(true)} danger>Xóa</Button>
                        </div>
                        <TabsRoomDetail />
                    </Container>
                    <Modal title="Thông báo" visible={openConfirmDelete} onOk={handleDeleteRoom} onCancel={() => setOpenConfirmDelete(false)}>
                        <h3>Bạn chắc chắn muốn xóa trường dữ liệu này?</h3>
                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default DetailInfoRoomAdmin
