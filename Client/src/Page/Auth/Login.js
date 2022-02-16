import { Modal } from 'antd';
import axios from 'axios';
import { FastField, Form, Formik } from 'formik';
import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { axiosUser } from '../../API/userAxios';
import { AuthActionCreator } from '../../Redux/ActionCreator';
import ActivationEmail from './ActivationEmail';
import ResetPassword from './ResetPassword';


const Login = ({ handleChangeMovePage }) => {
    const borderError = '0.5px solid red'
    const border = '0.5px solid #7b7a79'
    const dispatch = useDispatch();
    const history = useHistory()
    const [openModal, setOpenModal] = useState(false);

    const handleOke = async (email) => {
        if (!email) return toast.error("Vui lòng nhập địa chỉ email của tài khoản");
        try {
            const res = await axiosUser.post('/forgot', { email });
            toast.success(res?.data.msg);
            setOpenModal(false)

        } catch (error) {
            error.response.data.msg && toast.error(error?.response?.data.msg)
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const res = await axios.post('/user/login', { email, password })
            toast.success(res.data.msg)
            localStorage.setItem("login", true);
            dispatch(AuthActionCreator.Login());
            history.push('/');
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }

    const responseGoogle = async (response) => {
        try {
            const res = await axios.post('/user/google_login', { tokenId: response.tokenId });
            toast.success(res.data.msg)
            localStorage.setItem("login", true);
            dispatch(AuthActionCreator.Login());
            history.push('/');

        } catch (err) {
            err.response?.data.msg && toast.error(err.response?.data.msg)
        }
    }

    return (
        <div className="user signinBx">
            <div className="imgBx">
                {/* <img src="../../Assets/images/bg1.jpeg" alt="img1" /> */}
                <img src='https://images.pexels.com/photos/4406335/pexels-photo-4406335.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' alt="img1" />
            </div>
            <ActivationEmail />
            <ResetPassword />
            <div className="formBx">
                <div className="wrapFormBox" >
                    <h2>Sign In</h2>
                    <Formik
                        initialValues={{
                            emailForgot: '',
                            email: '',
                            password: '',
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const data = {
                                email: values.email,
                                emailForgot: values.emailForgot,
                                password: values.password,
                            }
                            const { email, password } = data;

                            try {
                                const res = await axiosUser.post('/login', { email, password })
                                toast.success(res.data.msg)
                                localStorage.setItem('login', true);
                                dispatch(AuthActionCreator.Login());
                                history.push('/');
                            } catch (err) {
                                err.response?.data.msg && toast.error(err.response?.data.msg)
                            }
                        }}
                        validationSchema={
                            yup.object().shape({
                                email: yup.string().email().required('Vui lòng đầy đủ thông tin.'),
                                emailForgot: yup.string().email().required('Vui lòng đầy đủ thông tin.'),
                                password: yup.string().required('Vui lòng đầy đủ thông tin.'),
                            })
                        }
                    >
                        {({
                            values,
                            handleSubmit,
                            handleChange,
                            errors,
                            touched
                        }) => (
                            <Form className="wrapFormInfo" onSubmit={handleSubmit}>
                                <div className="formItem-input ">
                                    <FastField
                                        name='email'
                                        id='email'
                                        value={values.email}
                                        placeholder="Email"
                                        label="Email"
                                        onChange={handleChange}
                                        style={{ border: errors.email && touched.email ? borderError : border }}
                                        className="input-item"
                                    />
                                    {
                                        errors.email && touched.email && (
                                            <span className="errors">
                                                &emsp;{errors.email}
                                            </span>
                                        )
                                    }
                                </div>
                                <div className="formItem-input ">
                                    <FastField
                                        name='password'
                                        id='password'
                                        value={values.password}
                                        placeholder="password"
                                        label="password"
                                        onChange={handleChange}
                                        style={{ border: errors.password && touched.password ? borderError : border }}
                                        className="input-item"
                                        type="password"
                                    />
                                    {
                                        errors.password && touched.password && (
                                            <span className="errors">
                                                &emsp;{errors.password}
                                            </span>
                                        )
                                    }
                                </div>
                                <div className="wrapForgot">
                                    <p onClick={() => setOpenModal(true)}>quên mật khẩu?</p>
                                </div>

                                <div className="wrapButtonSubmit">
                                    <button onClick={() => handleLogin(values.email, values.password)} type="submit" className="btn-submit">Đăng nhập</button>
                                </div>
                            </Form>

                        )}
                    </Formik>
                    <Formik
                        initialValues={{
                            emailForgot: '',

                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const data = {
                                emailForgot: values.emailForgot,
                            }
                            const { emailForgot } = data;
                            try {
                                const res = await axiosUser.post('/forgot', { emailForgot });
                                toast.success(res?.data.msg);
                                setOpenModal(false)

                            } catch (error) {
                                error.response.data.msg && toast.error(error?.response?.data.msg)
                            }
                        }}
                        validationSchema={
                            yup.object().shape({
                                emailForgot: yup.string().email("Email không đúng định dạng").required('Vui lòng đầy đủ thông tin.'),
                            })
                        }
                    >
                        {({
                            values,
                            handleSubmit,
                            handleChange,
                            errors,
                            touched
                        }) => (
                            <Form className="wrapFormInfo" onSubmit={handleSubmit}>
                                <Modal onCancel={() => setOpenModal(false)} title="Đặt lại mặt khẩu" visible={openModal} onOk={() => handleOke(values.emailForgot)} >
                                    <div className="formItem-input ">
                                        <h3>Email:</h3>
                                        <FastField
                                            name='emailForgot'
                                            id='emailForgot'
                                            value={values.emailForgot}
                                            placeholder="Nhập email để đặt lại mật khẩu"
                                            label="emailForgot"
                                            onChange={handleChange}
                                            style={{ border: errors.emailForgot && touched.emailForgot ? borderError : border }}
                                            className="input-item"
                                        />
                                        {
                                            errors.emailForgot && touched.emailForgot && (
                                                <span className="errors">
                                                    &emsp;{errors.emailForgot}
                                                </span>
                                            )
                                        }
                                    </div>
                                </Modal>
                            </Form>
                        )}
                    </Formik>

                    <p className="signup">Bạn chưa có tài khoản? <a href="#register" onClick={handleChangeMovePage} >Sign Up.</a></p>
                    <div style={{ textAlign: "center" }} className="signin__social">
                        {/* <Button type="ghost" shape="circle" onClick={loginWithFB}>
                            <img width="25px" src="https://cdn3.iconfinder.com/data/icons/capsocial-round/500/facebook-512.png" alt="img" />
                        </Button> */}
                        <GoogleLogin
                            style={{ marginTop: '1rem' }}
                            clientId="744768201382-8lngv121sj8koavcafta9e7seo9evntj.apps.googleusercontent.com"
                            buttonText="Đăng nhập với google"
                            onSuccess={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        {/* <Button shape='circle' type="ghost" onClick={loginWithGmail}>
                            <img width="25px" src="https://cdn.iconscout.com/icon/free/png-256/google-2981831-2476479.png" alt="img" />
                        </Button> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
