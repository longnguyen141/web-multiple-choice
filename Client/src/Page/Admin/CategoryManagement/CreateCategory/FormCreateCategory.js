import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Spin } from 'antd'
import { FastField, FieldArray, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Container } from 'reactstrap'
import * as yup from 'yup'
import { axiosCategory } from '../../../../API/categoryAxios'
import CustomFieldSelect from '../../../../Components/CustomField/CustomFieldSelect'


const FormCreateCategory = () => {
    const token = useSelector(state => state.token);
    const history = useHistory()
    const borderError = '0.5px solid red'
    const border = '0.5px solid #7b7a79'
    const options = [{
        key: 'status-1',
        value: "Hoạt động",
    }, { key: 'status-2', value: "Ẩn" }];
    const { id } = useParams();
    const [valueCategory, setValueCategory] = useState({});
    const [loading, setLoading] = useState(false)

    const randomNumber = () => {
        return Math.floor(Math.random() * 1000);
    }
    const handleAddChildrent = (arrayHelpers) => {
        arrayHelpers.push({
            nameCategory: '',
            statusCategory: 'status-1',
            types: 'type-1',
            key: new Date().getTime() + randomNumber(),
        })
    }

    useEffect(() => {
        if (id) {
            const fetchValueCategory = async () => {
                await setLoading(true);
                const res = await axiosCategory.get(`/getCategory/${id}`, {
                    headers: {
                        Authorization: token
                    }
                })
                setValueCategory(res.data)
                await setLoading(false);
            }
            fetchValueCategory();
            return () => fetchValueCategory();
        } else {
            const fetchValueCategory = async () => {
                await setLoading(true);
                setValueCategory({})
                await setLoading(false);
            }
            fetchValueCategory();
            return () => fetchValueCategory();
        }
    }, [id, token])


    return loading ? <Spin /> : (
        <Container>
            <Formik
                initialValues={{
                    displayName: (valueCategory && valueCategory.displayName) || '',
                    status: (valueCategory && valueCategory.status) || 'status-1',
                    childrents: (valueCategory && valueCategory.childrents) || [{
                        nameCategory: '',
                        statusCategory: 'status-1',
                        types: 'type-1',
                        key: new Date().getTime() + randomNumber(),
                    }],
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    const data = {
                        displayName: values.displayName,
                        status: values.status,
                        childrents: values.childrents,
                        key: new Date().getTime() + randomNumber(),
                    }
                    try {
                        if (id) {
                            const dataUpdate = {
                                ...valueCategory,
                                ...data
                            }
                            const res = await axiosCategory.post(`/editTags`, dataUpdate, {
                                headers: {
                                    Authorization: token
                                }
                            })
                            toast.success(res.data.msg)
                        } else {
                            const res = await axiosCategory.post('/create', data, {
                                headers: {
                                    Authorization: token
                                }
                            })
                            toast.success(res.data.msg)
                        }


                        history.push('/admin/category');
                    } catch (err) {
                        err.response.data.msg && toast.error(err.response.data.msg)
                    }
                }}
                validationSchema={
                    yup.object().shape({
                        displayName: yup.string().required('Vui lòng đầy đủ thông tin.'),
                        childrents: yup.array().of(
                            yup.object().shape({
                                nameCategory: yup.string().max(25, "Tên lĩnh vực phải ít hơn 25 ký tự").required("Vui lòng nhập đầy đủ thông tin")
                            })
                        )
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
                            <h4>Tên lĩnh vực: </h4>
                            <FastField
                                name='displayName'
                                id='displayName'
                                value={values.displayName}
                                style={{ border: errors.displayName && touched.displayName ? borderError : border }}
                                placeholder="VD: CNTT"
                                onChange={handleChange}
                                className="input-item"
                            />
                            {
                                errors.displayName && touched.displayName && (
                                    <span className="errors">
                                        &emsp;{errors.displayName}
                                    </span>
                                )
                            }
                        </div>

                        <div className="formItem-input">
                            <h4>Trạng thái: </h4>
                            <FastField
                                name="status"
                                id="status"
                                component={CustomFieldSelect}
                                options={options}
                                value={values.status}
                                placeholder="user123"
                                type="check"
                                style={{ border: errors.status && touched.status ? borderError : border }}
                                className="input-item select"
                                onChange={handleChange}
                            />
                        </div>
                        <FieldArray
                            name="childrents"
                            render={arrayHelpers => (
                                <div className="wrapFormCategoryChild">
                                    {values.childrents && values.childrents.length > 0 ? (
                                        values.childrents.map((tag, index) => (
                                            <div key={index}>
                                                <div className="wrapFormCategoryChildItem" key={index}>
                                                    <div className="wrapArrayField">
                                                        <div className="formItem-input">
                                                            <h5>Tên thẻ:</h5>
                                                            <FastField style={{
                                                                border: (errors?.childrents &&
                                                                    errors.childrents[index] &&
                                                                    errors.childrents[index].nameCategory &&
                                                                    touched?.childrents &&
                                                                    touched.childrents[index] &&
                                                                    touched.childrents[index].nameCategory) ? borderError : border
                                                            }} placeholder="VD: Javascript" className="input-item" name={`childrents[${index}].nameCategory`} />
                                                            {
                                                                errors?.childrents &&
                                                                errors.childrents[index] &&
                                                                errors.childrents[index].nameCategory &&
                                                                touched?.childrents &&
                                                                touched.childrents[index] &&
                                                                touched.childrents[index].nameCategory && (
                                                                    <span className="errors">
                                                                        {errors.childrents[index].nameCategory}
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <div className="formItem-input">
                                                            <h5>Trạng thái:</h5>
                                                            <FastField
                                                                component={CustomFieldSelect}
                                                                options={options}
                                                                // value={`childrents[${index}].statusCategory`}
                                                                value={tag.statusCategory}
                                                                // style={{ border: errors.statusCategory && touched.statusCategory ? borderError : border }}
                                                                type="check"
                                                                className="input-item select"
                                                                onChange={handleChange}
                                                                id={`childrents[${index}].statusCategory`}
                                                                name={`childrents[${index}].statusCategory`} />
                                                        </div>
                                                        {/* <div className="formItem-input">
                                                            <h5>Loại thẻ:</h5>
                                                            <FastField
                                                                component={CustomFieldSelect}
                                                                options={types}
                                                                // value={`childrents[${index}].types`}
                                                                value={tag.types}
                                                                // style={{ border: errors.types && touched.types ? borderError : border }}
                                                                type="check"
                                                                className="input-item select"
                                                                onChange={handleChange}
                                                                id={`childrents[${index}].types`}
                                                                name={`childrents[${index}].types`} />
                                                        </div> */}
                                                    </div>

                                                    <div className="wrapButtonRemove">
                                                        <Button
                                                            hidden={values.childrents.length === 1 && index === 0 ? true : false}
                                                            className="btnRemove"
                                                            type="button"
                                                            onClick={() => arrayHelpers.remove(index)}
                                                        >
                                                            <MinusCircleOutlined />
                                                        </Button>
                                                    </div>

                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                    <div className="wrapButton">
                                        <Button onClick={() => handleAddChildrent(arrayHelpers)} className="btnAdd" icon={<PlusCircleOutlined />} />
                                    </div>
                                </div>
                            )}
                        />
                        <div className="wrapButton">
                            <button type="submit" className="btnImport">Lưu thông tin</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    )
}

export default FormCreateCategory
