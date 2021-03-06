import { Spin } from 'antd'
import axios from 'axios'
import { FastField, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { axiosCategory } from '../../../../API/categoryAxios'
import CustomFieldSelect from '../../../../Components/CustomField/CustomFieldSelect'
import CustomTextarea from '../../../../Components/CustomField/CustomTextarea'
import { QuestionExamActionCreator, SelectFieldActionCreator, CreateExam } from '../../../../Redux/ActionCreator'


const FormInfo = ({ handleChangeMovePage, propsExam }) => {
    const borderError = '0.5px solid red'
    const border = '0.5px solid #7b7a79'
    const selectField = useSelector(state => state.selectField);
    const [loading, setLoading] = useState(false);
    const [loadingImageAvatar, setLoadingImageAvatar] = useState(false);
    const [options, setOptions] = useState([]);
    const dispatch = useDispatch();
    const imgRef = useRef(null);
    const infoExamRedux = useSelector(state => state.questionExam.infoExam);
    const examRedux = useSelector(state => state.questionExam)
    const auth = useSelector(state => state.auth);
    const [valueExam, setValueExam] = useState('');
    const [listTags, setListTags] = useState([]);
    const { id } = useParams();
    const token = useSelector(token => token.token);
    const [imgAvatar, setImgAvatar] = useState('')
    const selectedStatus = [
        { key: 'private', value: 'private' }, { key: 'public', value: 'public' }
    ]

    useEffect(() => {
        if (id) {
            const loadingComponent = async () => {
                await setLoading(true);
                await dispatch(QuestionExamActionCreator.ChangeInfoExam(propsExam))
                await setValueExam(propsExam)
                await setLoading(false);
            }
            loadingComponent();
            return () => loadingComponent()
        } else {
            const loadingComponent = async () => {
                await setLoading(true);
                await setValueExam('')
                await setLoading(false);
            }
            loadingComponent();
            return () => loadingComponent()
        }
    }, [id, propsExam, dispatch])

    useEffect(() => {
        if (id) {
            const fetchListTags = async () => {
                await setLoading(true);
                const res = await axiosCategory.get('/', null);
                const listValue = res?.data?.filter(item => item.status === 'status-1');
                await setListTags(listValue)
                await setTimeout(() => {
                    if (infoExamRedux.field !== "")
                        dispatch(SelectFieldActionCreator.ChangeField(infoExamRedux.field ? infoExamRedux.field : null))
                    else
                        dispatch(SelectFieldActionCreator.ChangeField(null))
                }, 1000)
                await setLoading(false)
            }
            fetchListTags();
            return () => fetchListTags();
        } else {
            const fetchListTags = async () => {
                await setLoading(true);
                const res = await axiosCategory.get('/', null);
                const listValue = res?.data?.filter(item => item.status === 'status-1');
                await dispatch(SelectFieldActionCreator.ChangeField(listValue[0]?._id))
                await setListTags(listValue)
                await setLoading(false)
            }
            fetchListTags();
            return () => fetchListTags();
        }
    }, [dispatch, id])

    useEffect(() => {
        const fetchOption = async () => {
            for (let item of listTags) {
                if (item._id === selectField) {
                    const listOptionActive = item?.childrents?.filter(item => item.statusCategory === 'status-1');
                    await setOptions(listOptionActive);
                }
            }
        }
        fetchOption()
        return () => fetchOption()

    }, [listTags, selectField])

    const handleChangeImage = async (e) => {
        try {
            await setLoadingImageAvatar(true);
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
            await setLoadingImageAvatar(false);
        } catch (error) {
            error.response?.data?.msg && toast.error(error.response?.data?.msg)
        }
    }

    const handleSetInfoExam = (values) => {
        if (!handleChangeMovePage) return;
        if (id) {
            if (values.tags.length < 1) {
                values.tags = propsExam.tags;
            }
            dispatch(QuestionExamActionCreator.ChangeInfoExam({ ...values, avatar: imgAvatar }))
        } else {
            dispatch(CreateExam.CreatExamChangeInfoExam({ ...values, avatar: imgAvatar }))
        }
        if (values.title !== '' && values.description !== '' && values.time !== '' && values.tags?.length > 0) {
            handleChangeMovePage("question");
        }
    }

    const checkKeyPress = (evt) => {
        var theEvent = evt || window.event;
        var key;
        // Handle paste
        if (theEvent.type === 'paste') {
            key = evt.clipboardData.getData('text/plain');
        } else {
            // Handle key press
            key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    return loading ? (<Spin />) : (
        <Formik
            initialValues={{
                title: (propsExam && propsExam.title) || '',
                description: (propsExam && propsExam.description) || '',
                testTime: (propsExam && propsExam.testTime) || '',
                tags: (propsExam && propsExam.tags) || [],
                status: (propsExam && propsExam.status) || 'public',
                avatar: (propsExam && propsExam.avatar) || '',
                field: (propsExam && propsExam.field) || listTags[0]?._id,
                authorName: (propsExam && propsExam.authorName) || auth?.user?.name,
            }}
            onSubmit={async (values, { setSubmitting }) => {

            }}
            validationSchema={
                (!propsExam.tags) ?
                    yup.object().shape({
                        title: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        description: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        testTime: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        field: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        tags: yup.array().min(1, "Vui l??ng ch???n ??t nh???t m???t th???"),
                        // tags: yup.array().required('Vui l??ng ?????y ????? th??ng tin.'),
                    })
                    : yup.object().shape({
                        title: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        description: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        testTime: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        field: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                        // tags: yup.array().required('Vui l??ng ?????y ????? th??ng tin.'),
                    })
            }
        >
            {({
                values,
                handleSubmit,
                handleChange,
                setFieldValue,
                errors,
                touched
            }) => (
                <Form className="wrapFormInfo" onSubmit={handleSubmit}>
                    {console.log(propsExam.tags)}
                    <div className="formItem-input ">
                        <h4>Ti??u ?????: </h4>
                        <FastField
                            name='title'
                            id='title'
                            value={values.title}
                            placeholder="Ti??u ?????"
                            label="Ti??u ?????"
                            onChange={handleChange}
                            style={{ border: errors.title && touched.title ? borderError : border }}
                            className="input-item"
                        />
                        {
                            errors.title && touched.title && (
                                <span className="errors">
                                    &emsp;{errors.title}
                                </span>
                            )
                        }
                    </div>
                    <div className="formItem-input ">
                        <h4>M?? t???: </h4>
                        <FastField
                            name='description'
                            id='description'
                            component={CustomTextarea}
                            value={values.description}
                            style={{ border: errors.description && touched.description ? borderError : border }}
                            placeholder="description"
                            onChange={handleChange}
                            className="input-item"
                        />
                    </div>

                    <div className="formItem-input ">
                        <h4>Th???i gian l??m b??i: </h4>
                        <input
                            onKeyPress={(event) => checkKeyPress(event)}
                            name='testTime'
                            id='testTime'
                            value={values.testTime}
                            style={{ border: errors.testTime && touched.testTime ? borderError : border }}
                            placeholder="Th???i gian l??m b??i"
                            onChange={handleChange}
                            className="input-item"
                            type="number"
                        />
                        {
                            errors.testTime && touched.testTime && (
                                <span className="errors">
                                    &emsp;{errors.testTime} </span>
                            )
                        }
                    </div>
                    <div className="formItem-input">
                        <h4>Ch???n tr???ng th??i: </h4>
                        <FastField
                            name="status"
                            id="status"
                            value={values.status}
                            component={CustomFieldSelect}
                            options={selectedStatus}
                            type="check"
                            placeholder="Ch???n tr???ng th??i"
                            style={{ border: errors.status && touched.status ? borderError : border }}
                            className="input-item select"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="formItem-input">
                        <h4>Ch???n l??nh v???c: </h4>
                        <FastField
                            name="field"
                            id="field"
                            value={values.field}
                            component={CustomFieldSelect}
                            options={listTags}
                            placeholder="Ch???n l??nh v???c c???a b??? ?????"
                            style={{ border: errors.field && touched.field ? borderError : border }}
                            onChange={handleChange}
                            className="input-item select"
                        // onChange={(e) => {
                        //     setFieldValue('field', e.target.value)
                        //     setFieldValue('tags', [])
                        // }}
                        />
                    </div>
                    <div className="formItem-input">
                        <h4>Ch???n th??? danh m???c: </h4>
                        <FastField
                            name="tags"
                            id="tags"
                            component={CustomFieldSelect}
                            defaultValue={values.tags}
                            // value={values.tags}
                            options={options}
                            type="tags"
                            placeholder="Ch???n danh m???c c???a b??? ?????"
                            style={{ border: errors.tags && touched.tags ? borderError : border }}
                            className="input-item select"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="wrapUploadFile" >
                        <h4>???nh ?????i di???n b??? ?????:</h4>
                        <input ref={imgRef} type="file" onChange={handleChangeImage} />
                        {loadingImageAvatar ? <Spin /> : (
                            <img style={{ maxWidth: '120px' }} src={`${imgAvatar ? imgAvatar : 'https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp'}`} alt="imgAvatar" onClick={() => imgRef.current.click()} />
                        )}
                        {/* <Button icon={<UploadOutlined />}>Upload</Button> */}
                    </div>
                    <div className="wrapButtonSubmit">
                        <button onClick={() => handleSetInfoExam(values)} type="submit" className="btn-submit">Ti???p theo</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default FormInfo
