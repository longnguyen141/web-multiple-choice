import { Spin } from 'antd'
import { FastField, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Container } from 'reactstrap'
import * as yup from 'yup'
import { axiosCategory } from '../../../../API/categoryAxios'
import CustomFieldSelect from '../../../../Components/CustomField/CustomFieldSelect'


const FormUpdateTags = ({ category }) => {
    const token = useSelector(state => state.token);
    const history = useHistory()
    // const category = useSelector(state => state.selectUpdateTags);
    const [valueTags, setValueTags] = useState('');

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const borderError = '0.5px solid red'
    const border = '0.5px solid #7b7a79'
    const options = [{
        key: 'status-1',
        value: "Hoạt động",
    }, { key: 'status-2', value: "Ẩn" }];

    useEffect(() => {
        const setData = async () => {
            console.log(...category?.childrents?.filter(item => item._id === id))
            await setValueTags(...category?.childrents?.filter(item => item._id === id))
            await setLoading(false);
        }
        setData()
        return () => setData();
    }, [id, category])


    return loading === true ? <Spin /> : (
        <Container>
            <Formik
                initialValues={{
                    nameCategory: valueTags?.nameCategory,
                    statusCategory: valueTags?.statusCategory,
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    const data = {
                        nameCategory: values.nameCategory,
                        statusCategory: values.statusCategory,
                    }
                    const index = category.childrents?.findIndex(item => item._id === id);
                    category.childrents[index] = {
                        ...category.childrents[index],
                        ...data
                    }
                    try {
                        const res = await axiosCategory.post('/editTags', category, {
                            headers: {
                                Authorization: token
                            }
                        })
                        toast.success(res.data.msg)
                        history.push('/admin/category');
                    } catch (err) {
                        err.response.data.msg && toast.error(err.response.data.msg)
                    }
                }}
                validationSchema={
                    yup.object().shape({
                        nameCategory: yup.string().required('Vui lòng đầy đủ thông tin.')
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
                    <Form className="wrapFormCreateCategory" onSubmit={handleSubmit}>
                        <div className="formItem-input ">
                            <h4>Tên thẻ: </h4>
                            <FastField
                                name='nameCategory'
                                id='nameCategory'
                                value={values.nameCategory}
                                style={{ border: errors.nameCategory && touched.nameCategory ? borderError : border }}
                                placeholder="VD: CNTT"
                                onChange={handleChange}
                                className="input-item"
                            />
                            {
                                errors.nameCategory && touched.nameCategory && (
                                    <span className="errors">
                                        &emsp;{errors.nameCategory}
                                    </span>
                                )
                            }
                        </div>

                        <div className="formItem-input">
                            <h4>Trạng thái: </h4>
                            <FastField
                                name="statusCategory"
                                id="statusCategory"
                                component={CustomFieldSelect}
                                options={options}
                                value={values.statusCategory}
                                placeholder="user123"
                                type="check"
                                style={{ border: errors.statusCategory && touched.statusCategory ? borderError : border }}
                                className="input-item select"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="wrapButton">
                            <button type="submit" className="btnImport">Lưu thông tin</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    )
}

export default FormUpdateTags
