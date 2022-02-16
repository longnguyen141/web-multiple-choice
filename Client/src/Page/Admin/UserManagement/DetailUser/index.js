import { Breadcrumb, Button, Layout, Modal, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Container } from 'reactstrap';
import { axiosUser } from '../../../../API/userAxios';
import SlideBar from '../../../../Components/Admin/SlideBar';

const { Header, Sider, Content, Footer } = Layout;

const DetailUser = () => {
    const auth = useSelector(state => state.auth)
    const history = useHistory();
    const { id } = useParams();
    const token = useSelector(state => state.token)
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
    const [infoUser, setInfoUser] = useState('');
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
            await axiosUser.get('/all_info', {
                headers: {
                    Authorization: token,
                }
            }).then(res => {
                setInfoUser(...res.data?.filter(item => item._id === id))
            }
            )
        }
        fetchData();
        return () => fetchData()
    }, [id, token])
    const handleDeleteUser = async () => {
        try {
            if (auth?.user?._id === id) return toast.error("Bạn không thể xóa tài khoản hiện tại đang sử dụng")

            const res = await axiosUser.delete(`/delete/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            history.push('/admin/user');
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }

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
                        <Breadcrumb.Item>Chi tiết người dùng</Breadcrumb.Item>
                    </Breadcrumb>

                    <Container style={{ backgroundColor: '#fff', padding: '1rem' }}>
                        <div className="wrapButtonAdmin">
                            <Button type="primary" onClick={() => history.push(`/admin/user/update/${id}`)}>Chỉnh sửa</Button>
                            <Button onClick={() => setOpenConfirmDelete(true)} danger>xóa</Button>
                        </div>
                        <div className="wrapInfoExamAdmin">
                            <div className="infoItem">
                                <h3>Email: </h3>
                                <p className="infoItem__content">{infoUser.email}</p>
                            </div>
                            <div className="infoItem">
                                <h3>Name: </h3>
                                <p className="infoItem__content">{infoUser.name}</p>
                            </div>
                            <div className="infoItem">
                                <h3>Avatar:</h3>
                                <div className="infoItem__content">
                                    <img style={{ objectFit: 'contain' }} width="200" height="200" src={infoUser.avatar} alt="avatar" />
                                </div>
                            </div>
                            <div className="infoItem">
                                <h3>Rule: </h3>
                                <p className="infoItem__content">{infoUser.role}</p>
                            </div>
                            <div className="infoItem">
                                <h3>Ngày tạo: </h3>
                                <p className="infoItem__content">{moment(infoUser.createdAt)
                                    .format('ddd DD/MM/YYYY hh:mm A')}</p>
                            </div>
                            <div className="infoItem">
                                <h3>Ngày update: </h3>
                                <p className="infoItem__content">{moment(infoUser.updatedAt)
                                    .format('ddd DD/MM/YYYY hh:mm A')}</p>
                            </div>
                        </div>

                    </Container>
                    <Modal title="Thông báo" visible={openConfirmDelete} onOk={handleDeleteUser} onCancel={() => setOpenConfirmDelete(false)}>
                        <h3>Bạn chắc chắn muốn xóa trường dữ liệu này?</h3>
                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default DetailUser
