import { Breadcrumb, Layout, Spin } from 'antd';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import SlideBar from '../../../../Components/Admin/SlideBar';
import FormCreateCategory from './FormCreateCategory';

const CreateCategory = () => {
    const { Header, Content, Footer } = Layout;
    const history = useHistory();
    const { id } = useParams();
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

    return loading ? <Spin /> : (
        <Layout className="containerDashboard">
            <SlideBar />
            <Layout className="containerLayoutContent">
                <Header className="wrapHeaderLayout" >
                    Quản lý lĩnh vực
                </Header>
                <Content className="wrapLayoutContent">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item onClick={() => history.push('/admin/category')}>Lĩnh vực</Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? "Chỉnh sửa lĩnh vực" : "Thêm lĩnh vực"}</Breadcrumb.Item>
                    </Breadcrumb>
                    <FormCreateCategory />
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default CreateCategory
