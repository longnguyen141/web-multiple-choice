import { Spin } from "antd";
import axios from "axios";
import { FastField, Form, Formik } from 'formik';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as yup from 'yup';
import CustomFieldSelect from '../../../../Components/CustomField/CustomFieldSelect';
import { RoomActionCreator, RoomUpdateActionCreator } from "../../../../Redux/ActionCreator";

const FormInfoRoom = ({ handleChangeMovePage, infoRoomUpdate }) => {
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const dispatch = useDispatch();
    const borderError = '0.5px solid red'
    const border = '0.5px solid #7b7a79'
    const [options, setOptions] = useState([])
    const token = useSelector(state => state.token);
    const infoRoom = useSelector(state => state.room)
    const [valueRoom, setValueRoom] = useState('')
    const auth = useSelector(state => state.auth);
    const [listUserUpdate, setListUserUpdate] = useState([])

    // function parseDateString(value, originalValue) {
    //     const parsedDate = isDate(originalValue)
    //         ? originalValue
    //         : parse(originalValue, "yyyy-MM-dd", new Date());
    //     return parsedDate;
    // }

    useEffect(() => {
        const fetchData = async () => {
            await setLoading(true)
            const res = await axios.get('/user/all_info', {
                headers: {
                    Authorization: token,
                }
            })
            await setOptions(res.data);
            await setLoading(false)
        }
        fetchData();
        return () => fetchData();
    }, [token])

    useEffect(() => {
        if (id) {
            const loadingComponent = async () => {
                await setLoading(true);
                await dispatch(RoomUpdateActionCreator.ChangeInfoRoomUpdate(infoRoomUpdate))
                await setValueRoom(infoRoomUpdate)
                await setLoading(false);
            }
            loadingComponent();
            return () => loadingComponent()
        } else {
            const loadingComponent = async () => {
                await setLoading(true);
                await setValueRoom('')
                await setLoading(false);
            }
            loadingComponent();
            return () => loadingComponent()
        }
    }, [id, infoRoomUpdate, dispatch, valueRoom])

    useEffect(() => {
        const check = async () => {
            if (id) {
                if (infoRoomUpdate) {
                    await setLoading(true)
                    const newArr = [];
                    infoRoomUpdate.listUser.forEach(user => newArr.push(user.emailItemUser))
                    await setListUserUpdate(newArr);
                    await setLoading(false);
                }
            } else {
                await setListUserUpdate([]);
                await setLoading(false);
            }
        }
        check()
    }, [id, infoRoomUpdate])

    // const handleOnChangeTime = (handleChange, value) => {
    //     handleChange();
    //     console.log(value)

    // }

    const handleSubmitForm = (values) => {
        console.log(values)
        if (id) {
            dispatch(RoomUpdateActionCreator.ChangeInfoRoomUpdate({
                ...values,
                authorName: auth.user.name,
                activeTime: moment(values.activeTime).add('7', 'hours').toISOString()
            }))
        } else {
            dispatch(RoomActionCreator.ChangeInfoRoom({
                ...values,
                authorName: auth.user.name,
                activeTime: moment(values.activeTime).add('7', 'hours').toISOString()
            }));
        }
        if (values.nameRoom && values.testTimeRoom && values.activeTime && values.listUser.length > 0)
            handleChangeMovePage("question")
    }

    return loading ? <Spin /> : (
        <Formik
            initialValues={{
                nameRoom: (valueRoom && valueRoom.nameRoom) || '',
                testTimeRoom: (valueRoom && valueRoom.testTimeRoom) || '',
                activeTime: (valueRoom && valueRoom.activeTime.slice(0, -2)) || '',
                listUser: listUserUpdate || [],

            }}
            onSubmit={async (values, { setSubmitting }) => {

            }}
            validationSchema={
                yup.object().shape({
                    nameRoom: yup.string().required('Vui lòng đầy đủ thông tin.'),
                    testTimeRoom: yup.number().required('Vui lòng đầy đủ thông tin.'),
                    // activeTime: yup.date().min(today, "Thời gian không hợp lệ").required('Vui lòng đầy đủ thông tin.'),
                    listUser: yup.array().min(1, "Vui lòng chọn ít nhất một người tham gia"),
                    // listUser: yup.array().required('Vui lòng đầy đủ thông tin.'),
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
                        <h4>Tên phòng thi: </h4>
                        <FastField
                            name='nameRoom'
                            id='nameRoom'
                            value={values.nameRoom}
                            placeholder="VD: Phòng thi kiểm tra kiến thức"
                            label="Tiêu đề"
                            onChange={handleChange}
                            style={{ border: errors.nameRoom && touched.nameRoom ? borderError : border }}
                            className="input-item"
                        />
                        {
                            errors.nameRoom && touched.nameRoom && (
                                <span className="errors">
                                    &emsp;{errors.nameRoom}
                                </span>
                            )
                        }
                    </div>
                    <div className="formItem-input ">
                        <h4>Thời gian làm bài: </h4>
                        <FastField
                            name='testTimeRoom'
                            id='testTimeRoom'
                            value={values.testTimeRoom}
                            style={{ border: errors.testTimeRoom && touched.testTimeRoom ? borderError : border }}
                            placeholder="VD: 50(phút)"
                            onChange={handleChange}
                            className="input-item"
                            type="number"
                        />
                        {
                            errors.testTimeRoom && touched.testTimeRoom && (
                                <span className="errors">
                                    &emsp;{errors.testTimeRoom} </span>
                            )
                        }
                    </div>
                    <div className="formItem-input ">
                        <h4>Thời gian phòng thi bắt đầu hoạt động: </h4>
                        <FastField
                            name='activeTime'
                            id='activeTime'
                            value={values.activeTime}
                            style={{ border: errors.activeTime && touched.activeTime ? borderError : border }}
                            placeholder="VD: 12/11/2021"
                            onChange={handleChange}
                            className="input-item"
                            type="datetime-local"
                        />
                        {
                            errors.activeTime && touched.activeTime && (
                                <span className="errors">
                                    &emsp;{errors.activeTime} </span>
                            )
                        }
                    </div>
                    <div className="formItem-input">
                        <h4>Người tham gia: </h4>
                        <FastField
                            name="listUser"
                            id="listUser"
                            component={CustomFieldSelect}
                            defaultValue={values.listUser}
                            // value={values.listUser}
                            options={options}
                            type="listUser"
                            placeholder="Chọn người tham gia"
                            style={{ border: errors.listUser && touched.listUser ? borderError : border }}
                            className="input-item select"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="wrapButtonSubmit">
                        <button onClick={() => handleSubmitForm(values)} className="btn-submit">Tiếp tục</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default FormInfoRoom
