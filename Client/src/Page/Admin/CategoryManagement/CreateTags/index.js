import { Breadcrumb, Layout, Spin } from 'antd';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import SlideBar from '../../../../Components/Admin/SlideBar';
import FormCreateCategory from './ForrmCreateTags';

const CreateTags = () => {
    const { Header, Content, Footer } = Layout;
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
                        <Breadcrumb.Item>Thêm thẻ</Breadcrumb.Item>
                    </Breadcrumb>
                    <FormCreateCategory />
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default CreateTags
