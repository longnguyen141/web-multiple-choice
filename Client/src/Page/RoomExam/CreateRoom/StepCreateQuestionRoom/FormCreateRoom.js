import { Col, Modal, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import XLSX from 'xlsx';
import { axiosExam } from '../../../../API/examAxios';
import { RoomActionCreator, RoomUpdateActionCreator } from '../../../../Redux/ActionCreator';
import FormCreateQuestion from './FormCreateQuestion.room';
import ViewNumberQuestion from './ViewNumberQuestion.room';


const FormCreateRoom = ({ handleChangeMovePage, propsListQuestion, infoRoomUpdate }) => {
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [openModalExam, setOpenModalExam] = useState(false)
    const auth = useSelector(state => state.auth);
    const [listExam, setListExam] = useState([])
    const infoRoomUpdateRedux = useSelector(state => state.updateRoom)
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const [valueRoom, setValueRoom] = useState('');
    const [dataImport, setDataImport] = useState('');
    const config = [{
        "name": "choose",
        "data": "scd",
    }]

    const listQuestionRedux = useSelector(state => state?.room?.infoExamRoom?.listQuestion)

    // useEffect(() => {
    //     if (propsListQuestion) {
    //         dispatch(QuestionExamActionCreator.SetListQuestion(propsListQuestion))
    //     }
    // }, [propsListQuestion, dispatch])
    // const handleRefFile = () => {
    //     fileRef.current.click();
    // }

    useEffect(() => {
        if (id) {
            if (infoRoomUpdate !== '') {
                dispatch(RoomUpdateActionCreator.SetInfoExamUpdate(infoRoomUpdate?.infoExamRoom))
                setValueRoom(infoRoomUpdate)
            }
        } else {
            setValueRoom('')
        }
    }, [id, dispatch, infoRoomUpdate])


    const handleImport = async (e) => {
        // setSelectedFile(e.target.files && e.target?.files[0])
        XLSX.utils.json_to_sheet(config, 'out.xlsx');
        if (e.target.files && e.target?.files[0]) {
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(e.target.files && e.target?.files[0]);
            fileReader.onload = (event) => {
                let data = event.target.result;
                let workbook = XLSX.read(data, { type: "binary" });
                workbook.SheetNames.forEach(sheet => {
                    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                    rowObject.forEach(item => {
                        for (let i in item) {
                            if (typeof item[i] === 'string' && item[i].includes('http')) {
                                item[i] = "<img src='" + item[i] + "' >"
                            }
                        }
                    })
                    setDataImport(rowObject);
                    return
                });
            }
        }
    }
    const handleImportExam = async (value) => {
        const { title, tags, description, testTime, authorName, status, listQuestion, avatar, field } = value;
        const newValue = { title: title, tags: tags, description: description, testTime: testTime, authorName: authorName, status: status, listQuestion: listQuestion, avatar: avatar, field: field }
        await setDataImport(newValue)
        if (id) {
            await dispatch(RoomUpdateActionCreator.SetInfoExamUpdate(newValue));
        } else {
            await dispatch(RoomActionCreator.SetInfoExam(newValue));
        }
        await setOpenModalExam(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosExam.get('/');
            const arrFilter = res.data.filter(item => item.idUser === auth.user._id)
            await setListExam(arrFilter)
        }
        fetchData()
    }, [auth])


    useEffect(() => {
        if (id) {
            if (dataImport !== '') {
                const dispatchAction = async () => {
                    await setLoading(true);
                    await dispatch(RoomUpdateActionCreator.SetInfoExamUpdate(dataImport));
                    await setLoading(false);
                }
                dispatchAction();
                return () => dispatchAction();
            }
        } else {
            if (dataImport !== '') {
                const dispatchAction = async () => {
                    await setLoading(true);
                    await dispatch(RoomActionCreator.SetInfoExam(dataImport));
                    await setLoading(false);
                }
                dispatchAction();
                return () => dispatchAction();
            }
        }
    }, [dispatch, dataImport, id])


    return (
        <div id="wrapCreateExam">
            <div className="wrapButtonStyleCreate">
                <button onClick={() => setOpenModalExam(true)} className="btnImport">Nhập bộ đề đã tạo</button>
            </div>
            <input hidden ref={fileRef} type="file" onChange={handleImport} accept=".xls,.xlsx" />
            {/* <pre id="jsondata">abc</pre> */}
            <div className="wrapFormCreate">
                {loading ? <Spin /> : (
                    <Row >
                        <Col xs={24} sm={24} md={8} lg={8} className="wrapListQuestion">
                            <ViewNumberQuestion infoRoomUpdate={infoRoomUpdate} />
                        </Col>
                        <Col xs={24} sm={24} md={16} lg={16} className="wrapContentQuestion">
                            <FormCreateQuestion infoRoomUpdate={infoRoomUpdate} dataImport={dataImport && dataImport.listQuestion ? dataImport.listQuestion : ''} handleChangeMovePage={handleChangeMovePage} />
                        </Col>
                    </Row>
                )}
            </div>
            <Modal title="Chọn bộ đề tạo phòng thi" visible={openModalExam} onOk={() => handleImportExam()} onCancel={() => setOpenModalExam(false)}>
                <div className="wrapListExam modalOpen" >
                    {listExam && listExam?.map(item => (
                        <Col key={item._id} onClick={() => handleImportExam(item)} className="wrapItem " xs={24} xl={24}>
                            <div className="imgExam">
                                <img className="imgItem" src="https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"
                                    alt="imgExam"
                                />
                            </div>
                            <div className="wrapContent">
                                <h2 className="title">{item.title}</h2>
                                <p className="description">
                                    {item.description}
                                </p>
                                <div className="wrapListTag">
                                    {item.tags.map((valueTag, index) => (
                                        <p className="itemTag" key={index} >{valueTag}</p>
                                    ))}
                                </div>
                                <div className="wrapInfo">
                                    <p>Tên tác giả: <span>{item.authorName ? item.authorName : "Nguyễn Văn A"}</span></p>
                                    <p>Thời gian làm bài: <span>60 phút</span></p>
                                    <p>Số câu hỏi: <span>50 câu</span></p>
                                    <p>Trạng thái: <span className={`status ${item.status}`}>{item.status}</span></p>
                                </div>
                            </div>
                        </Col>
                    ))}
                </div>
            </Modal>
        </div>
    )
}

export default FormCreateRoom