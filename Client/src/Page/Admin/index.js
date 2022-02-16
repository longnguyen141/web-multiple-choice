import { ClockCircleOutlined, DownOutlined, FormOutlined, ProfileOutlined, TeamOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, Spin, Avatar } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React, { useEffect, useState } from 'react';
import SlideBar from '../../Components/Admin/SlideBar';
import { axiosCategory } from '../../API/categoryAxios';
import { axiosExam } from '../../API/examAxios';
import { axiosUser } from '../../API/userAxios';
import { axiosRoom } from '../../API/roomAxios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AuthActionCreator } from '../../Redux/ActionCreator';

const { Header, Content } = Layout;
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [valuePie, setValuePie] = useState('');
    const [valueColumn, setValueColumn] = useState([]);
    const [valueMain, setValueMain] = useState([]);
    const today = new Date();
    const token = useSelector(state => state.token);
    const history = useHistory()
    const auth = useSelector(state => state.auth)

    console.log(auth, "auth")

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosCategory.get('/count');
            await setValuePie(res.data);

            const resNewTags = await axiosCategory.get('/countMonth');
            const resNewExams = await axiosExam.get('/countMonth');
            const resNewUsers = await axiosUser.get('/countMonth');
            const resNewRooms = await axiosRoom.get('/countMonth');
            await setValueColumn([resNewTags.data, resNewExams.data, resNewUsers.data, resNewRooms.data])

            const resAllUser = await axiosUser.get('/all_info', {
                headers: {
                    Authorization: token
                }
            });
            const resAllTags = await axiosCategory.get('/');
            const resAllExams = await axiosExam.get('/');
            const resAllRoom = await axiosRoom.get('/');
            const newArr = [resAllUser.data.length, resAllTags.data.length, resAllExams.data.length, resAllRoom.data.length]
            await setValueMain(newArr)
        }
        fetchData();
        return () => fetchData();
    }, [token])

    const options = {
        chart: {
            type: 'pie',
            width: 550,
            options3d: {
                enabled: true,
                alpha: 45
            },
            style: {
                fontFamily: 'Times New Roman',

            }
        },
        title: {
            text: `Biểu đồ thống kê lĩnh vực đã được sử dụng `
        },
        // subtitle: {
        //     text: '3D donut in Highcharts'
        // },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: [{
            name: 'Delivered amount',
            allowPointSelect: true,
            keys: ['name', 'y', 'selected', 'sliced'],
            data: valuePie
        }]
    };

    const options_ = {

        chart: {
            type: 'column',
            width: 550,
            style: {
                fontFamily: 'Times New Roman',

            }
        },
        title: {
            text: `Số lượng bộ đề, người dùng, lĩnh vực, phòng thi được thêm mới trong tháng ${today.getMonth() + 1}/${today.getFullYear()}`
        },
        // subtitle: {
        //     text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
        // },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Số lượng'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
        },

        series: [
            {
                name: "Danh sách",
                colorByPoint: true,
                data: [
                    {
                        name: "Lĩnh vực",
                        y: valueColumn[0],
                        drilldown: "Lĩnh vực"
                    },
                    {
                        name: "Bộ đề ôn tập",
                        y: valueColumn[1],
                        drilldown: "Bộ đề ôn tập"
                    },
                    {
                        name: "Người dùng",
                        y: valueColumn[2],
                        drilldown: "Người dùng"
                    },
                    {
                        name: "Phòng thi",
                        y: valueColumn[3],
                        drilldown: "Phòng thi"
                    },
                ]
            }
        ],
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
        return () => setLoading(false);
    }, [auth.user])

    const handleLogout = async () => {
        await axiosUser.get('/logout', {
            headers: { Authorization: token }
        })
        await localStorage.removeItem('login');
        await AuthActionCreator.LOGOUT();
        await history.push('/admin/login');
    }

    React.useEffect(() => {

    }, [])
    return loading ? <Spin /> : (
        <Layout className="containerDashboard">
            <SlideBar />
            <Layout className="containerLayoutContent">
                <Header className="wrapHeaderLayout" >
                    <p>
                        Thống kê
                    </p>
                    <Dropdown trigger={['hover']} placement="bottomCenter" arrow overlay={
                        <Menu  >
                            <Menu.Item onClick={() => history.push('/')}>
                                Trang người dùng
                            </Menu.Item>
                            <Menu.Item onClick={() => handleLogout()} key="3">Đăng xuất</Menu.Item>
                        </Menu>
                    }>
                        <div className="header__user">
                            <Avatar className="avatar" style={{ marginRight: '10px' }} src={auth?.user?.avatar}>{auth.user?.name?.charAt(0).toUpperCase()}</Avatar>
                            <DownOutlined />
                        </div>
                    </Dropdown>
                </Header>
                <Content className="wrapLayoutContent">
                    <div className="wrapContentMain dasboard" >
                        <div className='wrapItemDashboard greenStyle'><TeamOutlined />  &nbsp;{valueMain[0]} người dùng</div>
                        <div className='wrapItemDashboard brownStyle'><ProfileOutlined />  &nbsp;{valueMain[1]} lĩnh vực</div>
                        <div className='wrapItemDashboard blueStyle'><FormOutlined />  &nbsp;{valueMain[2]} Bộ đề ôn tập</div>
                        <div className='wrapItemDashboard redStyle'><ClockCircleOutlined />  &nbsp;{valueMain[3]} Phòng thi</div>
                    </div>
                    <div className='row' style={{ marginTop: '1rem', justifyContent: 'center' }}>
                        <div className='chartLeft col-6'>
                            <HighchartsReact highcharts={Highcharts} options={options} />
                        </div>
                        <div className='chartLeft col-6'>
                            <HighchartsReact highcharts={Highcharts} options={options_} />
                        </div>
                    </div>
                    {/* <div> */}

                    {/* </div> */}
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ©2021 </Footer>
            </Layout>
        </Layout>
    )
}

export default Dashboard
