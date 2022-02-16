import * as yup from 'yup';
import axios from 'axios';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosUser } from '../../API/userAxios';
import logo from '../../Assets/images/LogoTN.png';
import { AuthActionCreator } from '../../Redux/ActionCreator';
import { Modal, Spin } from 'antd'


const LoginAdmin = () => {
  const borderError = '0.5px solid red'
  const auth = useSelector(state => state.auth);
  const border = '0.5px solid #7b7a79'
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [dataLogin, setDataLogin] = useState({
    email: '',
    password: ''
  })
  const [openModal, setOpenModal] = useState(false);
  const [openModalNotification, setOpenModalNotification] = useState(false);
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

  const check = localStorage.getItem('login')
  useEffect(() => {
    if (check === 'true') {
      if (auth.user.email && auth.user.role === 1) {
        history.push('/admin')

      } else {
        setOpenModalNotification(true)
        setLoading(false);
      }
    } else {
      setLoading(false);

    }
  }, [auth.user, history, check])

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const email = dataLogin.email
      const password = dataLogin.password
      const res = await axios.post('/user/admin/login', { email, password })
      // if(res.data.)
      toast.success(res.data.msg)
      localStorage.setItem("login", true);
      dispatch(AuthActionCreator.Login());
      history.push('/admin');
    } catch (err) {
      err.response.data.msg && toast.error(err.response.data.msg)
    }
  }

  const handleMovePage = () => {
    history.push('/')
  }
  return (
    <section class="ftco-section">
      {loading ? <Spin /> :
        <>
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-6 col-lg-5">
                <div class="login-wrap p-4 p-md-5">
                  <div class="d-flex align-items-center justify-content-center">
                    {/* <span class="fa fa-user-o"></span> */}
                    <img width={150} src={logo} alt="" />
                  </div>
                  <h3 class="text-center mb-4">Đăng nhập quản trị viên</h3>
                  <form class="login-form">
                    <div class="form-group">
                      <input value={dataLogin.email} type="text" onChange={(e) => setDataLogin({ ...dataLogin, email: e.target.value })} class="form-control rounded-left" placeholder="Email" required />
                    </div>
                    <div class="form-group d-flex">
                      <input value={dataLogin.password} type="password" onChange={(e) => setDataLogin({ ...dataLogin, password: e.target.value })} class="form-control rounded-left" placeholder="mật khẩu" required />
                    </div>
                    <div class="form-group d-md-flex">
                      <div class="w-50">
                      </div>
                      <div class="w-50 text-md-right">
                        <a href="##" onClick={() => setOpenModal(true)}>Đặt lại mật khẩu</a>
                      </div>
                    </div>
                    <div class="form-group">
                      <button onClick={handleLogin} type="submit" class="btn btn-primary rounded submit p-3 px-5">Đăng nhập</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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
        </>}
      <Modal title="Thông báo" visible={openModalNotification} onOk={() => handleMovePage()} onCancel={() => handleMovePage(false)}>
        <h3>Tài khoản của bạn có quyền đăng nhập chức năng này</h3>

      </Modal>
    </section>
  )
}

export default LoginAdmin