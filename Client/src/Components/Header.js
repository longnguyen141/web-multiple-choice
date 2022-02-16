import { BellOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Dropdown, Empty, Menu, Modal, Skeleton, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { axiosExam } from '../API/examAxios';
import { axiosUser } from '../API/userAxios';
import logo from '../Assets/images/LogoTN.png';
import db from '../Firebase';
import { AuthActionCreator, CreateExam, RoomActionCreator } from '../Redux/ActionCreator';

const Header = () => {

    const history = useHistory();
    const dispath = useDispatch();
    const [loading, setLoading] = useState(false);
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const [openModal, setOpenModal] = useState(false)
    const [modalSearch, setModalSearch] = useState(false);
    const searchRef = useRef(null)
    const [listNotification, setListNotification] = useState([]);
    const [checkSeenNotification, setCheckSeenNotification] = useState('');
    const [viewSearch, setViewSearch] = useState({
        exam: [],
        user: [],
    })

    console.log(auth, "auth")

    const [find, setFind] = useState('');

    useEffect(() => {
        const fetchNotification = async () => {
            await db.collection('notifications').orderBy('timestamp', 'desc').onSnapshot(async (snap) => {
                let newData = [...snap.docs.map(doc => ({
                    id: doc.id, data: doc.data()
                }))]
                const listData = await newData.filter(item => item.data.id === auth.user._id);
                setListNotification(listData);
                setCheckSeenNotification(listData.filter(item => item.data?.seen !== true))
            })
        }
        fetchNotification()
        return () => fetchNotification();
    }, [auth.user])

    useEffect(() => {
        const login = localStorage.getItem('login');
        if (login) {
            const getToken = async () => {
                const res = await axios.post('/user/refresh_token', null);
                dispath(AuthActionCreator.GET_TOKEN(res.data?.access_token))
            }
            getToken()
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

    const handleLogout = async () => {
        await axiosUser.get('/logout', {
            headers: { Authorization: token }
        })
        await localStorage.removeItem('login');
        await AuthActionCreator.LOGOUT();
        await history.push('/login');
    }
    const handleClickNotification = async (item) => {
        await db.collection('notifications').doc(item.id).update({
            ...item.data, seen: true,
        })
        item.data.enable && await history.push(item.data.link);
        localStorage.setItem('timeClickNotification', new Date());
    }

    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + " ..." : str;
    }

    const handleMovePage = async (link) => {
        await setModalSearch(false)
        if (auth && auth.user !== [] && auth.isLogged === true) {
            await dispath(CreateExam.CreatExamClearExam())
            await dispath(RoomActionCreator.ClearRoom())
            await history.push(link)
        } else {
            setOpenModal(true);
        }
    }
    const handleOke = () => {
        history.push('/login')
    }

    const handleChangeSearch = async (e) => {
        let valueSearchTemp = e.target.value;
        await setFind(e.target.value)
        await setModalSearch(true)
        if (searchRef.current) {
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(async () => {
            await setLoading(true);
            if (valueSearchTemp !== '') {
                const resListExam = await axiosExam.get('/');
                const resListUser = await axiosUser.get('/getExamByUser');
                const listUser = resListUser.data.user;
                const listLength = resListUser.data.listLength;

                for (let i = 0; i < resListUser.data.user.length; i++) {
                    listUser[i].quantityExam = listLength[i];
                }

                const filterExam = await resListExam.data.filter(item => {
                    const temp = item.tags.map(value => value.toUpperCase().includes(valueSearchTemp.trim().toUpperCase()))
                    return (item.title.toUpperCase().includes(valueSearchTemp.trim().toUpperCase()) || temp.includes(true))
                })

                const filterUser = await listUser.filter(item => item.name.toUpperCase().includes(valueSearchTemp.trim().toUpperCase()))
                // await filterUser.map(async (item) => {
                //     const quantityExam = await axiosUser.get(`/getExamByUser/${item._id}`)
                //     item.quantityExam = quantityExam.data
                // })
                setViewSearch({
                    exam: filterExam,
                    user: filterUser
                })

            } else {
                await setViewSearch({
                    exam: '',
                    user: []
                });
            }
            await setLoading(false);
        }, 300)
    }

    const handleOnMouseDown = (e) => {
        e.preventDefault()
    }

    return (
        <div className="header">
            <div className="header__navbar">
                <img onClick={() => history.push('/')} src={logo} alt="" />
                <p onClick={() => handleMovePage('/exam/create')} className="header__navbar--text">Tạo bộ đề</p>
                <p onClick={() => handleMovePage('/room-exam')} className="header__navbar--text">Phòng thi online</p>
                <p onClick={() => history.push('/exam')} className="header__navbar--text">Ôn tập trắc nghiệm</p>
            </div>
            {/* <div className="search ">
                <input placeholder="key search" className="input__search" value={find} onChange={handleChangeSearch} />
                <Button icon={<SearchOutlined />} onClick={handleChangeSearchStatus} className="button__search" />
                <div hidden={find !== "" ? false : true} className='content__search'>
                    {find}
                </div>
            </div> */}
            <form className="formSearch" >
                <input className="search__input" value={find}
                    onBlur={() => setModalSearch(false)}
                    onChange={(e) => handleChangeSearch(e)}
                    type="text" placeholder="Nhập từ khóa tìm kiếm" />
                <button className="search__submit" type="submit" >{(!loading) ? <SearchOutlined /> : <Spin />}</button>
                <div className="valueSearch" style={{ background: '#fff' }} hidden={(modalSearch === true && find !== '') === true ? false : true}>
                    <div className="search__post">
                        <h2 className="searchData__title">Bộ đề</h2>
                        {loading ? <Spin /> : (
                            <>
                                {viewSearch.exam.length > 0 ? (
                                    <div>
                                        {viewSearch.exam?.map(item => (
                                            <div onMouseDown={(e) => handleOnMouseDown(e)} onClick={() => handleMovePage(`/exam/${item._id}`)} className="postsearch__item" key={item._id}>
                                                <img style={{ width: '150px' }} src={item.avatar ? item.avatar : "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"} alt="" />
                                                <div style={{ marginLeft: '8px' }}>
                                                    <h3>
                                                        {item.title}
                                                    </h3>
                                                    <p>Tác giả: {item.authorName}</p>
                                                    <p>Thời gian làm bài: {item.testTime} phút</p>
                                                    <div>
                                                        {item.tags.map(value => <p style={{ padding: '5px 12px', backgroundColor: '#5fcac7', width: '90px', textAlign: 'center' }}>{value}</p>)}
                                                    </div>
                                                </div>
                                                {/* <p style={{ color: '#5488c7', fontWeight: '600' }}>{item.data.displayName} <span style={{ color: '#999', fontWeight: '400' }}> Đã đăng vào <Moment format="ddd DD/MM/YYYY hh:mm A">{item.data.timestamp.seconds * 1000}</Moment></span></p> */}
                                                {/* <div className={`postSearch__item k${item._}`} >{
                                                setTimeout(() => {
                                                    createContent(item.id, truncate(item.data.content, 220))
                                                    return;
                                                }, 10)

                                            }</div> */}
                                            </div>
                                        ))}
                                    </div>
                                ) : (<div>Không có nội dung phù hợp</div>)}
                            </>

                        )}
                    </div>
                    <div className="search__post">
                        <h2 className="searchData__title">Người dùng</h2>
                        {loading ? <Spin /> : (
                            <>
                                {viewSearch.user.length > 0 ? (
                                    <div>
                                        {viewSearch.user?.map(item => (
                                            <div onMouseDown={(e) => handleOnMouseDown(e)} onClick={() => handleMovePage(`/profile/${item._id}`)} className="postsearch__item" key={item._id}>
                                                <img style={{ width: '100px' }} src={item.avatar ? item.avatar : "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"} alt="" />
                                                <div style={{ marginLeft: '8px' }}>
                                                    <p style={{ fontSize: '15px' }}>
                                                        <span>Tên người dùng: </span> &nbsp;<strong style={{ color: '#000' }}>{item.name}</strong>
                                                    </p>
                                                    <p style={{ fontSize: '15px' }}>
                                                        <span>Email: </span> &nbsp;<strong style={{ color: '#000' }}>{item.email}</strong>
                                                    </p>
                                                    <p><span>Số bộ đề đã tạo:</span> <strong>{item?.quantityExam}</strong></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (<div>Không có nội dung phù hợp</div>)}
                            </>

                        )}
                    </div>

                </div>
            </form>
            <Modal onCancel={() => setOpenModal(false)} title="Yêu cầu đăng nhập" visible={openModal} onOk={() => handleOke()} >
                <h3 className="formItem-input ">
                    Vui lòng đăng nhập để thực hiện chức năng này
                </h3>
            </Modal>

            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '2rem' }}>
                    <Dropdown trigger={['click']} placement="bottomCenter" arrow overlay={
                        <Menu mode='horizontal' id='scrollableDiv' style={{
                            overflow: 'auto', minWidth: '25vw', maxWidth: '25vw', display: 'flex', flexDirection: 'column', maxHeight: '50vh'
                        }}>
                            <InfiniteScroll
                                dataLength={listNotification.length}
                                next={<Spin />}
                                hasMore={listNotification.length < 0}
                                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                endMessage={listNotification.length > 5 ? <Divider plain>It is all, nothing more 🤐</Divider> : <></>}
                                scrollableTarget="scrollableDiv">
                                {listNotification && listNotification.length > 0 ? listNotification.map((item, index) => (
                                    <Menu.Item onClick={() => handleClickNotification(item)} className='wrap-notification-item' key={index} style={{ display: 'flex' }}>
                                        <img width={50} height={50} className='img-notification' src={item.data.avatar} alt='' />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <p><span style={{ fontWeight: 'bold' }}>{item.data.userName} &nbsp;</span><span>{truncate(item.data.message, 80)}</span></p>
                                            <Moment format="ddd DD/MM/YYYY hh:mm A">{item.data?.timestamp?.seconds * 1000}</Moment>
                                            {/* <p>{moment(
                                            item?.data?.timestamp?.seconds
                                        )}</p> */}
                                        </div>
                                        <div style={{ minWidth: '10px' }}>
                                            {!item.data?.seen &&
                                                (
                                                    <Badge color={!item.data?.seen && "blue"} text="" />
                                                )}
                                        </div>
                                    </Menu.Item>
                                )) : (<Empty />)}
                            </InfiniteScroll>
                        </Menu>
                    }>
                        <Badge count={checkSeenNotification.length}>
                            <Button shape='circle' icon={<BellOutlined />} />
                        </Badge>
                    </Dropdown>
                </div>
                {auth.isLogged ? (
                    <>
                        <Dropdown trigger={['hover']} placement="bottomCenter" arrow overlay={
                            <Menu >
                                <Menu.Item onClick={() => history.push(`/profile/${auth.user._id}`)} key="0">
                                    Trang cá nhân
                                </Menu.Item>
                                <Menu.Item onClick={() => history.push('/admin')}>
                                    Dashboard
                                </Menu.Item>
                                <Menu.Item onClick={() => handleLogout()} key="3">Đăng xuất</Menu.Item>
                            </Menu>
                        }>


                            <div className="header__user">
                                <Avatar className="avatar" style={{ marginRight: '10px' }} src={auth?.user?.avatar}>{auth.user?.name?.charAt(0).toUpperCase()}</Avatar>
                                <DownOutlined />
                            </div>
                        </Dropdown>
                    </>
                ) : (
                    <div className="header__login">
                        <Button onClick={() => history.push('/login')} >Login </Button>
                        <Button onClick={() => history.push('/register')}>Register</Button>
                    </div>
                )}
            </div>


        </div>
    )
}

export default Header