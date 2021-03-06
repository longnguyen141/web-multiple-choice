import { Modal } from 'antd';
import { FastField, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { axiosUser } from '../../API/userAxios';
import imageRegister from '../../Assets/images/bg2.jpeg';


const Register = ({ handleChangeMovePage }) => {
    const [openModal, setOpenModal] = useState(false);

    const borderError = '0.5px solid red'
    const border = '0.5px solid #7b7a79'

    const handleOke = () => {
        if (!handleChangeMovePage) return;
        setOpenModal(false);
        handleChangeMovePage();
    }

    const handleCancel = () => {
        setOpenModal(false)
    }

    return (
        <div className="user signupBx">
            <div className="formBx">
                <div className="wrapFormBox" >
                    <h2>Create an account</h2>
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}

                        onSubmit={async (values, actions) => {
                            const data = {
                                name: values.name,
                                email: values.email,
                                password: values.password,
                                confirmPassword: values.password,
                            }
                            const { name, email, password } = data;
                            try {
                                const res = await axiosUser.post('/register', { name, email, password })
                                // .catch(err => (
                                //     toast.error(err.data.msg)
                                // ))
                                actions.resetForm({
                                    values: {
                                        name: "",
                                        email: "",
                                        password: "",
                                        confirmPassword: "",
                                    }
                                })
                                toast.success(res.data.msg)
                                setOpenModal(true);
                            } catch (err) {
                                err.response.data.msg && toast.error(err.response.data.msg)
                            }
                        }}

                        validationSchema={
                            yup.object().shape({
                                name: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                                email: yup.string().email("Vui l??ng nh???p ????ng email c???a b???n").required('Vui l??ng ?????y ????? th??ng tin.'),
                                password: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                                confirmPassword: yup.string()
                                    .oneOf([yup.ref('password'), null], 'M???t kh???u kh??ng kh???p').required('Vui l??ng ?????y ????? th??ng tin.'),
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
                                        name='name'
                                        id='name'
                                        value={values.name}
                                        placeholder="T??n ng?????i d??ng"
                                        onChange={handleChange}
                                        style={{ border: errors.name && touched.name ? borderError : border }}
                                        className="input-item"
                                    />
                                    {
                                        errors.name && touched.name && (
                                            <span className="errors">
                                                &emsp;{errors.name}
                                            </span>
                                        )
                                    }
                                </div>

                                <div className="formItem-input ">
                                    <FastField
                                        name='email'
                                        id='email'
                                        value={values.email}
                                        style={{ border: errors.email && touched.email ? borderError : border }}
                                        placeholder="Email"
                                        onChange={handleChange}
                                        className="input-item"
                                    />
                                    {
                                        errors.email && touched.email && (
                                            <span className="errors">
                                                &emsp;{errors.email} </span>
                                        )
                                    }
                                </div>

                                <div className="formItem-input ">
                                    <FastField
                                        name='password'
                                        id='password'
                                        value={values.password}
                                        style={{ border: errors.password && touched.password ? borderError : border }}
                                        placeholder="M???t kh???u"
                                        onChange={handleChange}
                                        className="input-item"
                                        type="password"
                                    />
                                    {
                                        errors.password && touched.password && (
                                            <span className="errors">
                                                &emsp;{errors.password} </span>
                                        )
                                    }
                                </div>
                                <div className="formItem-input ">
                                    <FastField
                                        name='confirmPassword'
                                        id='confirmPassword'
                                        value={values.confirmPassword}
                                        style={{ border: errors.confirmPassword && touched.confirmPassword ? borderError : border }}
                                        placeholder="confirmPassword"
                                        onChange={handleChange}
                                        className="input-item"
                                        type="password"
                                    />
                                    {
                                        errors.confirmPassword && touched.confirmPassword && (
                                            <span className="errors">
                                                &emsp;{errors.confirmPassword} </span>
                                        )
                                    }
                                </div>
                                <div className="wrapButtonSubmit">
                                    <button className="btn-submit">????ng k??</button>
                                </div>
                                <Modal title={"X??c nh???n t??i kho???n"} visible={openModal} onOk={handleOke} onCancel={handleCancel}>
                                    <div className="ModalActivation">
                                        <h2>Vui l??ng x??c nh???n ????ng k?? ??? email c???a b???n</h2>
                                    </div>
                                </Modal>
                            </Form>
                        )}
                    </Formik>
                    <p className="signin">B???n ???? c?? t??i kho???n <a href="#login" onClick={handleChangeMovePage}>Sign In.</a></p>
                </div>
            </div>
            <div className="imgBx">
                <img src={imageRegister} alt="img2" />
            </div>
        </div>
    )
}

export default Register
