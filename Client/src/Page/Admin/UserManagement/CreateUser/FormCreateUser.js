import { Spin } from 'antd'
import axios from 'axios'
import { FastField, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Container } from 'reactstrap'
import * as yup from 'yup'
import { axiosUser } from '../../../../API/userAxios'
import CustomFieldSelect from '../../../../Components/CustomField/CustomFieldSelect'


const FormCreateUser = () => {
    const [loading, setLoading] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const borderError = '0.5px solid red'
    const border = '0.5px solid #7b7a79'
    const token = useSelector(state => state.token);
    const [imgAvatar, setImgAvatar] = useState('');
    const { id } = useParams();
    const history = useHistory();
    const options = [{
        key: 1,
        value: "admin",
    }, { key: 0, value: "user" }];

    const [infoUser, setInfoUser] = useState('');

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                await setLoading(true);
                await axiosUser.get('/all_info', {
                    headers: {
                        Authorization: token,
                    }
                }).then(res => {
                    const data = res.data?.filter(item => item._id === id);
                    setInfoUser(data[0])
                    setImgAvatar(data[0].avatar)
                })

                await setLoading(false)
            }
            fetchData();
            return () => fetchData()
        }
        else {
            const fetchData = async () => {
                await setLoading(true)
                await setLoadingAvatar(true)
                await setInfoUser({})
                setTimeout(async () => {
                    await setInfoUser({})
                    await setImgAvatar('')
                }, 1000)
                await setLoadingAvatar(false)
                await setLoading(false);
            }
            fetchData();
            return () => fetchData();
        }
    }, [id, token])

    const handleUpdateUser = async (values) => {
        const newValue = { ...values, avatar: imgAvatar }
        await axiosUser.patch(`/update/${id}`, newValue, {
            headers: {
                Authorization: token
            }
        }).then(res => toast.success(res.data.msg))
            .catch(err => toast.error(err.response?.data?.msg
            ))
        history.push('/admin/user')
    }
    const handleChangeImage = async (e) => {
        try {
            await setLoadingAvatar(true);
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

            await setImgAvatar(resImage.data.url);
            await setLoadingAvatar(false);
        } catch (error) {
            error.response?.data?.msg && toast.error(error.response?.data?.msg)
        }
    }
    const handleCreateUser = async (values) => {
        const newValue = { ...values, avatar: imgAvatar }
        await axiosUser.post('/createUser', newValue, {
            headers: {
                Authorization: token
            }
        }).then(res => toast.success(res.data.msg))
            .catch(err => toast.error(err.response?.data?.msg
            ))
        history.push('/admin/user')
    }
    return loading ? <Spin /> : (
        <Container>
            <Formik
                initialValues={{
                    email: (infoUser && infoUser.email) || '',
                    name: (infoUser && infoUser.name) || '',
                    password: (infoUser && infoUser.password) || '',
                    rePassword: (infoUser && infoUser.password) || '',
                    role: (infoUser && infoUser.role) || 0,
                    // avatar: (infoUser && infoUser.avatar) || imgAvatar || 'https://res.cloudinary.com/dtxt7omes/image/upload/v1635342980/avatar/cptpmqqrgu501ax9d4dd.jpg',
                }}
                onSubmit={async (values, { setSubmitting }) => {

                }}
                validationSchema={
                    yup.object().shape({
                        email: yup.string().email("email sai c?? ph??p").required("Vui l??ng nh???p ????? th??ng tin"),
                        // email: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        name: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        password: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        avatar: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        rePassword: yup.string()
                            .oneOf([yup.ref('password'), null], "Vui l??ng nh???p ch??nh x??c l???i m???t kh???u")
                            .required('Vui l??ng ?????y ????? th??ng tin'),
                        // tags: yup.array().required('Vui l??ng ?????y ????? th??ng tin.'),
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
                    <Form className="wrapFormCreateUser" onSubmit={handleSubmit}>
                        <div className="formItem-input ">
                            <h4>Email: </h4>
                            <FastField
                                // readOnly="true"
                                readOnly={id ? true : false}
                                name='email'
                                id='email'
                                value={values.email}
                                placeholder="VD: user1@gmail.com"
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
                            <h4>T??n ng?????i d??ng: </h4>
                            <FastField
                                name='name'
                                id='name'
                                value={values.name}
                                style={{ border: errors.name && touched.name ? borderError : border }}
                                placeholder="VD: Nguy???n V??n A"
                                onChange={handleChange}
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
                            <h4>M???t kh???u: </h4>
                            <FastField
                                name='password'
                                id='password'
                                value={values.password}
                                style={{ border: errors.password && touched.password ? borderError : border }}
                                placeholder="user123"
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

                        <div className="formItem-input">
                            <h4>Nh???p l???i m???t kh???u: </h4>
                            <FastField
                                name="rePassword"
                                id="rePassword"
                                type="password"
                                value={values.rePassword}
                                placeholder="user123"
                                style={{ border: errors.rePassword && touched.rePassword ? borderError : border }}
                                className="input-item"
                                onChange={handleChange}
                            />
                            {
                                errors.rePassword && touched.rePassword && (
                                    <span className="errors">
                                        &emsp;{errors.rePassword}
                                    </span>
                                )
                            }
                        </div>
                        <div className="formItem-input">
                            <h4>Ph??n quy???n: </h4>
                            <FastField
                                name="role"
                                id="role"
                                component={CustomFieldSelect}
                                options={options}
                                value={values.role}
                                type="check"
                                style={{ border: errors.role && touched.role ? borderError : border }}
                                className="input-item select"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="wrapUploadFile" >
                            <h4>???nh ?????i di???n:</h4>
                            <input
                                type='file'
                                id='avatar'
                                name='avatar'
                                onChange={handleChangeImage} >
                            </input>
                            {loadingAvatar ? <Spin /> :
                                <img name='avatar'
                                    id='avatar'
                                    width="200"
                                    height="200"
                                    style={{ objectFit: 'contain' }}
                                    onChange={handleChange}
                                    src={imgAvatar ? imgAvatar : "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"} alt="" />}
                        </div>
                        <div className="wrapButton">
                            <button type="submit" onClick={() => (id ? handleUpdateUser(values) : handleCreateUser(values))} className="btnImport">L??u th??ng tin</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    )
}

export default FormCreateUser
