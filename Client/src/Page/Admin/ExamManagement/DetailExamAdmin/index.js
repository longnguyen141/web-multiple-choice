import { Breadcrumb, Button, Layout, Modal, Spin } from 'antd';
import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Container } from 'reactstrap';
import { axiosExam } from '../../../../API/examAxios';
import SlideBar from '../../../../Components/Admin/SlideBar';
import TabsDetail from './TabsDetail.admin';

const { Header, Sider, Content, Footer } = Layout;

const DetailExamAdmin = () => {
    const history = useHistory();
    const { id } = useParams();
    const token = useSelector(state => state.token)
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

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

    const handleDeleteExam = async () => {
        try {
            const res = await axiosExam.delete(`/deleteExam/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            history.push('/admin/exam');
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }
    return loading ? <Spin /> : (
        <Layout className="containerDashboard">
            <SlideBar />
            <Layout className="containerLayoutContent">
                <Header className="wrapHeaderLayout" >
                    Quản lý bộ đề
                </Header>
                <Content className="wrapLayoutContent">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item onClick={() => history.push('/admin/exam')}>Bộ đề</Breadcrumb.Item>
                        <Breadcrumb.Item>Chi tiết bộ đề</Breadcrumb.Item>
                    </Breadcrumb>

                    <Container style={{ backgroundColor: '#fff', padding: '1rem' }}>
                        <div className="wrapButtonAdmin">
                            <Button type="primary" onClick={() => history.push(`/admin/exam/update-exam/${id}`)}>chỉnh sửa</Button>
                            <Button onClick={() => setOpenConfirmDelete(true)} danger>xóa</Button>
                        </div>
                        <TabsDetail />
                    </Container>
                    <Modal title="Thông báo" visible={openConfirmDelete} onOk={handleDeleteExam} onCancel={() => setOpenConfirmDelete(false)}>
                        <h3>Bạn chắc chắn muốn xóa trường dữ liệu này?</h3>
                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default DetailExamAdmin
