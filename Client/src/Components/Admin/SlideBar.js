import {
    ContainerOutlined, HomeOutlined, OrderedListOutlined, PieChartOutlined, PlusOutlined, ScheduleOutlined, UserOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import LogoTN from '../../Assets/images/LogoTN.png';
import { AuthActionCreator, CreateExam, RoomActionCreator, RoomUpdateActionCreator } from '../../Redux/ActionCreator';
import { handleMovePageAdmin } from '../../Service/MovePageAdmin';


const { Sider } = Layout;

const SlideBar = () => {
    const auth = useSelector(state => state.auth)
    const history = useHistory();
    const defaultKey = useSelector(state => state.selectSidebar)
    const dispath = useDispatch();
    const token = useSelector(state => state.token);

    const [collapsed, setCollapsed] = useState(false);
    const toggle = () => {
        setCollapsed(!collapsed);
    }
    useEffect(() => {
        const login = localStorage.getItem('login');
        if (login) {
            const getToken = async () => {
                const res = await axios.post('/user/refresh_token', null);
                dispath(AuthActionCreator.GET_TOKEN(res.data.access_token))
            }
            getToken()
        } else {

        }
    }, [auth.isLogged, dispath])

    useEffect(() => {
        if (token) {
            const getUser = () => {
                dispath(AuthActionCreator.Login())
                return AuthActionCreator.fetchUser(token).then(res => {
                    dispath(AuthActionCreator.GET_USER(res))
                })
            }
            getUser()
        }
    }, [token, dispath])

    const handleCreateExamAdmin = (url, key, dispath, history) => {
        dispath(CreateExam.CreatExamClearExam());
        handleMovePageAdmin(url, key, dispath, history)
    }
    const handleCreateRoomAdmin = (url, key, dispath, history) => {
        setTimeout(() => {
            dispath(RoomActionCreator.ClearRoom());
        }, 2000)
        dispath(RoomUpdateActionCreator.ClearRoomUpdate());
        handleMovePageAdmin(url, key, dispath, history)
    }

    // const handleSelectSideBar = (url, key) => {
    //     dispath(SelectSidebarActionCreator.ChangeItem(key))
    //     history.push(url)
    // }
    return (
        <Sider className="wrapSidebar" collapsible collapsed={collapsed} onCollapse={toggle}>
            <div className="logo" >
                <img style={{ cursor: 'pointer' }} onClick={() => history.push('/')} src={LogoTN} width={80} alt="" />
            </div>
            <Menu theme="dark" defaultSelectedKeys={[`${defaultKey}`]} mode="inline">
                <Menu.Item onClick={() => handleMovePageAdmin('/admin', 'dashboard', dispath, history)} key="dashboard" icon={<PieChartOutlined />}>
                    Th???ng k??
                </Menu.Item>
                <SubMenu key="user" icon={<UserOutlined />} title="Qu???n l?? user">
                    <Menu.Item onClick={() => handleMovePageAdmin('/admin/user/create', 'addUser', dispath, history)} icon={<PlusOutlined />} key="addUser">Th??m ng?????i d??ng</Menu.Item>
                    <Menu.Item onClick={() => handleMovePageAdmin('/admin/user', 'listUsers', dispath, history)} icon={<OrderedListOutlined />} key="listUsers">Danh s??ch ng?????i d??ng</Menu.Item>
                </SubMenu>
                <SubMenu key="exam" icon={<ContainerOutlined />} title="Qu???n l?? b??? ?????">
                    <Menu.Item onClick={() => handleCreateExamAdmin('/admin/exam/create', 'addExam', dispath, history)} icon={<PlusOutlined />} key="addExam">Th??m b??? ?????</Menu.Item>
                    <Menu.Item onClick={() => handleMovePageAdmin('/admin/exam', 'listExams', dispath, history)} icon={<OrderedListOutlined />} key="listExams">Danh s??ch b??? ?????</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<ScheduleOutlined />} title="Qu???n l?? l??nh v???c">
                    <Menu.Item onClick={() => handleMovePageAdmin('/admin/category/create', 'addCategory', dispath, history)} icon={<PlusOutlined />} key="addCategory">Th??m l??nh v???c</Menu.Item>
                    <Menu.Item onClick={() => handleMovePageAdmin('/admin/category', 'listCategories', dispath, history)} icon={<OrderedListOutlined />} key="listCategories">Danh s??ch l??nh v???c</Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" icon={<HomeOutlined />} title="Qu???n l?? ph??ng thi">
                    <Menu.Item onClick={() => handleCreateRoomAdmin('/admin/room-create', 'addRoom', dispath, history)} icon={<PlusOutlined />} key="addRoom">Th??m ph??ng thi</Menu.Item>
                    <Menu.Item onClick={() => handleMovePageAdmin('/admin/room', 'listRooms', dispath, history)} icon={<OrderedListOutlined />} key="listRooms">Danh s??ch ph??ng thi</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    )
}

export default SlideBar
