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
                    nameRoom: yup.string().required('Vui l??ng ?????y ????? th??ng tin.'),
                    testTimeRoom: yup.number().required('Vui l??ng ?????y ????? th??ng tin.'),
                    // activeTime: yup.date().min(today, "Th???i gian kh??ng h???p l???").required('Vui l??ng ?????y ????? th??ng tin.'),
                    listUser: yup.array().min(1, "Vui l??ng ch???n ??t nh???t m???t ng?????i tham gia"),
                    // listUser: yup.array().required('Vui l??ng ?????y ????? th??ng tin.'),
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
                        <h4>T??n ph??ng thi: </h4>
                        <FastField
                            name='nameRoom'
                            id='nameRoom'
                            value={values.nameRoom}
                            placeholder="VD: Ph??ng thi ki???m tra ki???n th???c"
                            label="Ti??u ?????"
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
                        <h4>Th???i gian l??m b??i: </h4>
                        <FastField
                            name='testTimeRoom'
                            id='testTimeRoom'
                            value={values.testTimeRoom}
                            style={{ border: errors.testTimeRoom && touched.testTimeRoom ? borderError : border }}
                            placeholder="VD: 50(ph??t)"
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
                        <h4>Th???i gian ph??ng thi b???t ?????u ho???t ?????ng: </h4>
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
                        <h4>Ng?????i tham gia: </h4>
                        <FastField
                            name="listUser"
                            id="listUser"
                            component={CustomFieldSelect}
                            defaultValue={values.listUser}
                            // value={values.listUser}
                            options={options}
                            type="listUser"
                            placeholder="Ch???n ng?????i tham gia"
                            style={{ border: errors.listUser && touched.listUser ? borderError : border }}
                            className="input-item select"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="wrapButtonSubmit">
                        <button onClick={() => handleSubmitForm(values)} className="btn-submit">Ti???p t???c</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default FormInfoRoom
