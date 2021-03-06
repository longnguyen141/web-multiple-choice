import { CameraOutlined, LaptopOutlined } from '@ant-design/icons';
import { Spin, Tabs } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container } from 'reactstrap';
import { axiosUser } from '../../../API/userAxios';
import Footer from '../../../Components/Footer';
import Header from '../../../Components/Header';
import { AuthActionCreator } from '../../../Redux/ActionCreator';
import ListExamProfile from './ListExam.profile';
import ListExamTakeProfile from './ListExamTake.profile';
import ListRoomCreateByUserProfile from './ListRoomCreateByUser.profile';
import ListRoomJoin from './ListRoomJoin';


const Profile = () => {
    const [loadingImage, setLoadingImage] = useState(false);
    const token = useSelector(state => state.token);
    const auth = useSelector(state => state.auth);
    const [infoUser, setInfoUser] = useState('');
    const [imgAvatar, setImageAvatar] = useState('');
    const avatarRef = useRef(null);
    const [checkAuth, setCheckAuth] = useState(false);
    const dispatch = useDispatch();
    const { TabPane } = Tabs;
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [dataProfile, setDataProfile] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    })

    useEffect(() => {
        setTimeout(async () => {
            await setLoading(false)
            await dispatch(AuthActionCreator.LOAD_PAGE())
        }, 1800)
        return () => setLoading(false);
    }, [dispatch, id])


    // useEffect(() => {
    //     const loadData = async () => {
    //         await setLoading(true);
    //         const res = await axiosUser.get(`/infoById/${id}`, {
    //             headers: {
    //                 Authorization: token
    //             }
    //         })

    //         await setLoading(false)
    //     }
    //     loadData()
    //     return () => loadData();

    // }, [auth.user, id, token])

    useEffect(() => {
        const fetchData = async () => {
            // await setLoading(true)
            const res = await axiosUser.get(`/infoById/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            if (auth.user._id === res.data._id) {
                await setCheckAuth(true);
            } else {
                await setCheckAuth(false);
            }
            await setDataProfile({
                name: res.data.name,
                password: res.data.password,
                confirmPassword: res.data.password,
            })
            // await setLoading(false)
        }

        fetchData()
        return () => fetchData()
    }, [token, id, auth.user])

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosUser.get(`/infoById/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            await setInfoUser(res.data);
            await setImageAvatar(res.data.avatar)

        }
        fetchData();
        return () => fetchData();
    }, [token, id])

    const handleUpdateProfile = async () => {
        try {
            const res = await axios.patch(`/user/update/${id}`, { name: dataProfile.name, password: dataProfile.password, avatar: imgAvatar }, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }

    }

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        try {
            await setLoadingImage(true);
            const file = e.target.files[0];
            if (!file) return toast.error("Vui l??ng t???i l??n file ???nh")
            if (file.size > 1024 * 1024) return toast.error("File qu?? l???n vui l??ng ki???m tra l???i")
            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return toast.error("File kh??ng ph?? h???p vui l??ng ki???m tra l???i");
            let formData = new FormData();
            formData.append('file', file)
            const resImage = await axios.post('/api/upload__avatar', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            });
            await setImageAvatar(resImage.data.url);
            await setLoadingImage(false)

        } catch (error) {
            error.response?.data?.msg && toast.error(error.response?.data?.msg)
        }

    }

    return loading ? <Spin /> : (
        <>
            <Header />
            <Container >
                <div id="profile" className="row">
                    <div className="col-lg-4 col-md-12 content-left">
                        <div className='wrapLogo'>
                            <div onClick={() => avatarRef.current.click()} className='wrapAvatar'>
                                <CameraOutlined />
                            </div>
                            {/* <Avatar src={imgAvatar === '' ? infoUser?.avatar : imgAvatar} ></Avatar> */}
                            {loadingImage === true ? <Spin /> :
                                <img width={200} src={imgAvatar} alt="" />
                            }
                        </div>
                        <input style={{ padding: '8px 16px', borderRadius: '4px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }} ref={avatarRef} type="file" hidden onChange={handleChangeAvatar} />
                        <label style={{ marginBottom: '-10px' }}>Email:</label>
                        <input style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '4px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }} value={infoUser.email} disabled />
                        <label style={{ marginBottom: '-10px' }}>T??n ng?????i d??ng:</label>
                        <input style={{ padding: '8px 16px', borderRadius: '4px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }} value={dataProfile.name} onChange={(e) => setDataProfile({ ...dataProfile, name: e.target.value })} placeholder="name" />
                        {checkAuth === true ? (<>
                            <label style={{ marginBottom: '-10px' }}>M???t kh???u:</label>
                            <input style={{ padding: '8px 16px', borderRadius: '4px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }} value={dataProfile.password} onChange={(e) => setDataProfile({ ...dataProfile, password: e.target.value })} placeholder="password" type="password" />
                            <label style={{ marginBottom: '-10px' }}>Nh???p l???i m???t kh???u:</label>
                            <input style={{ padding: '8px 16px', borderRadius: '4px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }} value={dataProfile.confirmPassword} onChange={(e) => setDataProfile({ ...dataProfile, confirmPassword: e.target.value })} placeholder="confirm password" type="password" />
                            <button style={{ padding: '8px 16px', borderRadius: '4px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }} onClick={handleUpdateProfile} className="btn-update">Update</button>
                        </>) : <></>}
                    </div>
                    <div className="col-lg-8 col-md-12">
                        <div>
                            <Tabs defaultActiveKey="0">
                                <TabPane
                                    key={0}
                                    tab={
                                        <span className="wrapIcon">
                                            <LaptopOutlined />
                                            B??? ????? ???? t???o
                                        </span>
                                    }
                                >
                                    <ListExamProfile />
                                </TabPane>
                                {checkAuth === true ? (
                                    <>
                                        <TabPane
                                            key={1}
                                            tab={
                                                <span className="wrapIcon">
                                                    <LaptopOutlined />
                                                    B??? ???? tham gia
                                                </span>
                                            }
                                        >
                                            <ListExamTakeProfile />
                                        </TabPane>
                                        <TabPane
                                            key={2}
                                            tab={
                                                <span className="wrapIcon">
                                                    <LaptopOutlined />
                                                    Ph??ng thi ???? tham gia
                                                </span>
                                            }
                                        >
                                            <ListRoomJoin />
                                        </TabPane>
                                        <TabPane
                                            key={3}
                                            tab={
                                                <span className="wrapIcon">
                                                    <LaptopOutlined />
                                                    Ph??ng thi ???? t???o
                                                </span>
                                            }
                                        >
                                            <ListRoomCreateByUserProfile />
                                        </TabPane>
                                    </>
                                ) : <></>}

                                {/* <TabPane
                                    key={4}
                                    tab={
                                        <span className="wrapIcon">
                                            <LaptopOutlined />
                                            ph??ng thi tham gia ch??a ho???t ?????ng
                                        </span>
                                    }
                                >
                                    <ListRoomNotActiveYet infoUser={infoUser} />
                                </TabPane> */}

                            </Tabs>
                        </div>
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default Profile
