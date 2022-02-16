import { Col, Modal, Row, Spin } from 'antd';
import axios from 'axios';
import FileDownload from 'js-file-download';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import XLSX from 'xlsx';
import { axiosExam } from '../../../../API/examAxios';
import { CreateExam, QuestionExamActionCreator } from '../../../../Redux/ActionCreator';
import FormCreateQuestion from './FormCreateQuestion';
import ViewNumberQuestion from './ViewNumberQuestion';

const FormCreateExam = ({ handleChangeMovePage, propsListQuestion }) => {
    const [loading, setLoading] = useState(false);
    const [openModalExam, setOpenModalExam] = useState(false)
    const auth = useSelector(state => state.auth);
    const [listExam, setListExam] = useState([])
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const [dataImport, setDataImport] = useState('');
    const { id } = useParams()
    const config = [{
        "name": "choose",
        "data": "scd",
    }]


    // useEffect(() => {
    //     if (propsListQuestion) {
    //         dispatch(QuestionExamActionCreator.SetListQuestion(propsListQuestion))
    //     }
    // }, [propsListQuestion, dispatch])
    // const handleRefFile = () => {
    //     fileRef.current.click();
    // }


    const handleImport = async (e) => {
        XLSX.utils.json_to_sheet(config, 'out.xlsx');
        if (e.target.files && e.target?.files[0]) {
            try {
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
                                    const arrStr = item[i].split(' ');
                                    const newArr = [];
                                    for (let value of arrStr) {
                                        if (value.includes('http')) {
                                            value = "<img src='" + value + "' />"
                                        }
                                        newArr.push(value)
                                    }
                                    item[i] = newArr.join(' ');
                                }
                            }
                        })
                        if (id) {
                            dispatch(QuestionExamActionCreator.SetListQuestion(rowObject))
                            setDataImport(rowObject);
                        } else {
                            dispatch(CreateExam.CreatExamSetListQuestion(rowObject))
                            setDataImport(rowObject);
                        }
                        return;
                    });
                }
            } catch (error) {
                toast.error("File excel không đúng định dạng yêu cầu vui lòng xem file hướng dẫn")
            }

        }


    }

    const handleImportExam = (value) => {
        setDataImport(value.listQuestion)
        setOpenModalExam(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosExam.get('/');
            const arrFilter = res.data.filter(item => item.idUser === auth.user._id)
            await setListExam(arrFilter)
        }

        fetchData()
        return () => fetchData()
    }, [auth])


    useEffect(() => {
        if (id) {
            if (dataImport !== '') {
                const dispatchAction = async () => {
                    await setLoading(true);
                    await dispatch(QuestionExamActionCreator.SetListQuestion(dataImport));
                    await setLoading(false);
                }
                dispatchAction();
                return () => dispatchAction();
            }
        }
        else {
            if (dataImport !== '') {
                const dispatchAction = async () => {
                    await setLoading(true);
                    await dispatch(CreateExam.CreatExamSetListQuestion(dataImport));
                    await setLoading(false);
                }
                dispatchAction();
                return () => dispatchAction();
            }
        }
    }, [dispatch, dataImport, id])

    const handleDownloadHD = (e) => {
        e.preventDefault();
        axios({
            url: `${process.env.REACT_APP_SERVER_PORT}/downloadHD`,
            method: 'GET',
            responseType: 'blob'
        }).then(res => { FileDownload(res.data, "HuongDan.zip") })
    }
    return (
        <div id="wrapCreateExam">
            <div className="wrapButtonStyleCreate">
                <button className="btnImport" onClick={(e) => handleDownloadHD(e)}>File hướng dẫn</button>
                <button onClick={() => fileRef.current.click()} className="btnImport">Nhập file excel</button>
            </div>
            <input hidden ref={fileRef} type="file" onChange={handleImport} accept=".xls,.xlsx" />
            {/* <pre id="jsondata">abc</pre> */}
            <div className="wrapFormCreate">
                {loading ? <Spin /> : (
                    <Row >
                        <Col xs={24} sm={24} md={8} lg={8} className="wrapListQuestion">
                            <ViewNumberQuestion propsListQuestion={propsListQuestion} />
                        </Col>
                        <Col xs={24} sm={24} md={16} lg={16} className="wrapContentQuestion">
                            <FormCreateQuestion dataImport={dataImport !== '' ? dataImport : ''} propsListQuestion={propsListQuestion} handleChangeMovePage={handleChangeMovePage} />
                        </Col>
                    </Row>
                )}
            </div>
            <Modal title="Chọn bộ đề tạo phòng thi" visible={openModalExam} onOk={() => handleImportExam()} onCancel={() => setOpenModalExam(false)}>
                <div className="wrapListExam modalOpen" >
                    {listExam.map(item => (
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

export default FormCreateExam
