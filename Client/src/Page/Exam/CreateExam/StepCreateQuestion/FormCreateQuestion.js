import { Form, Select, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { CreateExam, QuestionExamActionCreator } from '../../../../Redux/ActionCreator';


const FormCreateQuestion = ({ handleChangeMovePage, propsListQuestion, dataImport }) => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const distpatch = useDispatch();
    const selectedQuestion = useSelector(state => state.questionExam.selected)
    const listQuestionRedux = useSelector(state => state.questionExam.listQuestion)
    const listQuestionCreate = useSelector(state => state.createExam.listQuestion)
    const selectedQuestionCreate = useSelector(state => state.createExam.selected)
    const token = useSelector(state => state.token);
    const [txtEditor, setTxtEditor] = useState({
        // question: '',
        // answer1: '',
        // answer2: '',
        // answer3: '',
        // answer4: '',
        // correct: 'A',
        // explain: '',
        question: (propsListQuestion && propsListQuestion[0]?.question) || (dataImport && dataImport[0]?.question) || '',
        answer1: (propsListQuestion && propsListQuestion[0]?.answer1) || (dataImport && dataImport[0]?.answer1) || '',
        answer2: (propsListQuestion && propsListQuestion[0]?.answer2) || (dataImport && dataImport[0]?.answer2) || '',
        answer3: (propsListQuestion && propsListQuestion[0]?.answer3) || (dataImport && dataImport[0]?.answer3) || '',
        answer4: (propsListQuestion && propsListQuestion[0]?.answer4) || (dataImport && dataImport[0]?.answer4) || '',
        correct: (propsListQuestion && propsListQuestion[0]?.correct) || (dataImport && dataImport[0]?.correct) || 'A',
        explain: (propsListQuestion && propsListQuestion[0]?.explain) || (dataImport && dataImport[0]?.explain) || '',
    });

    const handleMoveReviewStep = () => {
        if (!handleChangeMovePage) return;
        handleChangeMovePage("view")
    }

    useEffect(() => {
        if (id) {
            const setData = async () => {
                await setLoading(true);
                await setTxtEditor({
                    question: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectedQuestion]?.question,
                    answer1: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectedQuestion]?.answer1,
                    answer2: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectedQuestion]?.answer2,
                    answer3: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectedQuestion]?.answer3,
                    answer4: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectedQuestion]?.answer4,
                    correct: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectedQuestion]?.correct,
                    explain: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectedQuestion]?.explain,
                    // question: '',
                    // answer1: '',
                    // answer2: '',
                    // answer3: '',
                    // answer4: '',
                    // correct: 'A',
                    // explain: '',
                })
                await setLoading(false);
            }
            setData()
            return () => setData();
        } else {
            const setData = async () => {
                await setLoading(true);
                await setTxtEditor({
                    // question: listQuestionCreate && listQuestionCreate.length > 0 && listQuestionCreate[0]?.question,
                    // answer1: listQuestionCreate && listQuestionCreate.length > 0 && listQuestionCreate[0]?.answer1,
                    // answer2: listQuestionCreate && listQuestionCreate.length > 0 && listQuestionCreate[0]?.answer2,
                    // answer3: listQuestionCreate && listQuestionCreate.length > 0 && listQuestionCreate[0]?.answer3,
                    // answer4: listQuestionCreate && listQuestionCreate.length > 0 && listQuestionCreate[0]?.answer4,
                    // correct: listQuestionCreate && listQuestionCreate.length > 0 && listQuestionCreate[0]?.correct,
                    // explain: listQuestionCreate && listQuestionCreate.length > 0 && listQuestionCreate[0]?.explain,
                    question: '',
                    answer1: '',
                    answer2: '',
                    answer3: '',
                    answer4: '',
                    correct: 'A',
                    explain: '',
                })
                await setLoading(false);
            }
            setData()
            return () => setData();
        }
    }, [id, listQuestionRedux, listQuestionCreate, dataImport])

    const handleOnChange = (value, type) => {

        switch (type) {
            case "question":
                setTxtEditor({
                    ...txtEditor,
                    question: value,
                })
                break;
            case "answer1":
                setTxtEditor({
                    ...txtEditor,
                    answer1: value,
                })
                break;
            case "answer2":
                setTxtEditor({
                    ...txtEditor,
                    answer2: value,
                })
                break;
            case "answer3":
                setTxtEditor({
                    ...txtEditor,
                    answer3: value,
                })
                break;
            case "answer4":
                setTxtEditor({
                    ...txtEditor,
                    answer4: value,
                })
                break;
            default:
                if (value === '') break;
                else
                    setTxtEditor({
                        ...txtEditor,
                        explain: value,
                    })
                break;
        }
    }

    const handleOnChangeSelect = (e) => {
        setTxtEditor({ ...txtEditor, correct: e })
    }

    useEffect(() => {
        if (id) {
            distpatch(QuestionExamActionCreator.ChangeQuestion(txtEditor))
        } else {
            distpatch(CreateExam.CreatExamChangeQuestion(txtEditor))
        }
    }, [txtEditor, distpatch, id])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await setLoading(true);
    //         await setTxtEditor({

    //         })
    //         await setLoading(false)
    //     }
    //     fetchData()
    //     return () => fetchData()
    // }, [propsListQuestion, dataImport])

    useEffect(() => {
        // setTxtEditor(txtInitial)
        if (id) {
            const fetchData = async () => {
                await setLoading(true)
                await setTxtEditor(listQuestionRedux && listQuestionRedux[selectedQuestion])
                await setLoading(false)
            }
            fetchData();
            return () => fetchData();
        } else {
            const fetchData = async () => {

                try {
                    await setLoading(true)
                    await setTxtEditor(listQuestionCreate && listQuestionCreate[selectedQuestionCreate])
                    await setLoading(false)
                } catch (error) {
                    toast.error("Định dạng file bộ đề của bạn không đúng yêu cầu \n vui lòng xem file hướng dẫn để biết thêm chi tiết")
                }
            }
            fetchData();
            return () => fetchData();
        }

    }, [selectedQuestion, selectedQuestionCreate, id])

    const handleBlurEditor = (value, className) => {
        const editorQuestion = document.querySelector(`.editor${className}`);
        const error = document.querySelector(`.errors${className}`);
        if (value === '' || value === '<p><br></p>') {
            error.innerHTML = `Vui lòng điền đầy đủ thông tin`;
            editorQuestion.style.border = "1px solid red";
        } else {
            error.innerHTML = ``;
            editorQuestion.style.border = "none";
        }
    }

    FormCreateQuestion.modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    }

    FormCreateQuestion.formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]

    const handleChangeImage = async (e, setImg) => {
        try {
            const file = e.target.files[0];
            if (!file) return toast.error("Vui lòng tải lên file ảnh")
            if (file.size > 1024 * 1024) return toast.error("File quá lớn vui lòng kiểm tra lại")
            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return toast.error("File không phù hợp vui lòng kiểm tra lại");
            let formData = new FormData();
            formData.append('file', file)
            const resImage = await axios.post('/api/upload__avatar', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            });

            await setImg(resImage.data.url);
        } catch (error) {
            error.response?.data?.msg && toast.error(error.response?.data?.msg)
        }
    }

    return loading === true ? (<Spin size="large" />) : (
        <Form className="wrapCreateQuestionItem" >
            <div className="formItem-input ">
                <h4 style={{ marginBottom: '10px' }}>Nội dung câu hỏi: </h4>
                <ReactQuill className="editor question"
                    modules={FormCreateQuestion.modules}
                    formats={FormCreateQuestion.formats}
                    onBlur={() => handleBlurEditor(txtEditor.question, ".question")}
                    theme="snow"
                    value={txtEditor?.question || ""}
                    onChange={(value) => handleOnChange(value, "question")} />
                <span className="errors question"></span>
            </div>

            <div className="formItem-input ">
                <h4 style={{ marginBottom: '10px' }}>Nội dung đáp án 1: </h4>
                <ReactQuill className="editor answer1"
                    modules={FormCreateQuestion.modules}
                    formats={FormCreateQuestion.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer1, ".answer1")} theme="snow"
                    value={txtEditor?.answer1 || ""}
                    onChange={(value) => handleOnChange(value, "answer1")} />
                <span className="errors answer1"></span>
            </div>
            <div className="formItem-input ">
                <h4 style={{ marginBottom: '10px' }}>Nội dung đáp án 2: </h4>
                <ReactQuill className="editor answer2"
                    modules={FormCreateQuestion.modules}
                    formats={FormCreateQuestion.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer2, ".answer2")} theme="snow"
                    value={txtEditor?.answer2 || ""}
                    onChange={(value) => handleOnChange(value, "answer2")} />
                <span className="errors answer2"></span>
            </div>
            <div className="formItem-input question">
                <h4 style={{ marginBottom: '10px' }}>Nội dung đáp án 3: </h4>
                <ReactQuill className="editor answer3"
                    modules={FormCreateQuestion.modules}
                    formats={FormCreateQuestion.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer3, ".answer3")} theme="snow"
                    value={txtEditor?.answer3 || ""}
                    onChange={(value) => handleOnChange(value, "answer3")} />
                <span className="errors answer3"></span>

            </div>
            <div className="formItem-input answer">
                <h4 style={{ marginBottom: '10px' }}>Nội dung đáp án 4: </h4>
                <ReactQuill className="editor answer4"
                    modules={FormCreateQuestion.modules}
                    formats={FormCreateQuestion.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer4, ".answer4")} theme="snow"
                    value={txtEditor?.answer4 || ""}
                    onChange={(value) => handleOnChange(value, "answer4")} />
                <span className="errors answer4"></span>
            </div>
            <div className="formItem-select">
                <h4 style={{ marginBottom: '10px' }}>Đáp án của câu hỏi: </h4>
                <Select value={txtEditor?.correct} onChange={handleOnChangeSelect} defaultValue="A" style={{ width: "100%" }} >
                    <Select.Option value="A">Đáp án 1</Select.Option>
                    <Select.Option value="B">Đáp án 2</Select.Option>
                    <Select.Option value="C">Đáp án 3</Select.Option>
                    <Select.Option value="D">Đáp án 4</Select.Option>
                </Select>
            </div>
            <div className="formItem-input answer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                    <h4 style={{ marginBottom: '10px' }}>Phần bài giải: </h4>
                    {/* <input type='file' onChange={(e) => handleChangeImage(e, setImgExplain)} /> */}
                </div>
                <ReactQuill className="editor explain"
                    modules={FormCreateQuestion.modules}
                    formats={FormCreateQuestion.formats}
                    onBlur={() => handleBlurEditor(txtEditor.explain, ".explain")} theme="snow"
                    value={txtEditor?.explain ? txtEditor.explain : ''}
                    onChange={(value) => handleOnChange(value, "explain")} />
                <span className="errors explain"></span>
            </div>

            <div className="wrapButtonSubmit fixed">
                <button onClick={() => handleMoveReviewStep('view')} className="btn-submit">Tiếp theo</button>
            </div>
        </Form>
    )
}


export default FormCreateQuestion