import { Form, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { RoomActionCreator, RoomUpdateActionCreator } from '../../../../Redux/ActionCreator';


const FormCreateQuestion = ({ handleChangeMovePage, infoRoomUpdate, dataImport }) => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const distpatch = useDispatch();
    const selectedQuestion = useSelector(state => state.room.selected)
    const listQuestionRedux = useSelector(state => state.room.infoExamRoom.listQuestion)
    const listQuestionRoomRedux = useSelector(state => state.updateRoom?.infoExamRoom?.listQuestion)
    const selectUpdateRoomRedux = useSelector(state => state.updateRoom.selected)

    const [txtEditor, setTxtEditor] = useState({
        question: (infoRoomUpdate && infoRoomUpdate[0]?.question) || (dataImport && dataImport[0].question) || '',
        answer1: (infoRoomUpdate && infoRoomUpdate[0]?.answer1) || (dataImport && dataImport[0].answer1) || '',
        answer2: (infoRoomUpdate && infoRoomUpdate[0]?.answer2) || (dataImport && dataImport[0].answer2) || '',
        answer3: (infoRoomUpdate && infoRoomUpdate[0]?.answer3) || (dataImport && dataImport[0].answer3) || '',
        answer4: (infoRoomUpdate && infoRoomUpdate[0]?.answer4) || (dataImport && dataImport[0].answer4) || '',
        correct: (infoRoomUpdate && infoRoomUpdate[0]?.correct) || (dataImport && dataImport[0].correct) || 'A',
        explain: (infoRoomUpdate && infoRoomUpdate[0]?.explain) || (dataImport && dataImport[0].explain) || '',
    });

    useEffect(() => {
        if (id) {
            const setData = async () => {
                await setLoading(true);
                await setTxtEditor({
                    question: listQuestionRoomRedux && listQuestionRoomRedux.length > 0 && listQuestionRoomRedux[0]?.question,
                    answer1: listQuestionRoomRedux && listQuestionRoomRedux.length > 0 && listQuestionRoomRedux[0]?.answer1,
                    answer2: listQuestionRoomRedux && listQuestionRoomRedux.length > 0 && listQuestionRoomRedux[0]?.answer2,
                    answer3: listQuestionRoomRedux && listQuestionRoomRedux.length > 0 && listQuestionRoomRedux[0]?.answer3,
                    answer4: listQuestionRoomRedux && listQuestionRoomRedux.length > 0 && listQuestionRoomRedux[0]?.answer4,
                    correct: listQuestionRoomRedux && listQuestionRoomRedux.length > 0 && listQuestionRoomRedux[0]?.correct,
                    explain: listQuestionRoomRedux && listQuestionRoomRedux.length > 0 && listQuestionRoomRedux[0]?.explain,
                })
                await setLoading(false);
            }
            setData()
            return () => setData();
        } else {
            const setData = async () => {
                await setLoading(true);
                await setTxtEditor({
                    // question: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectUpdateRoomRedux]?.question,
                    // answer1: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectUpdateRoomRedux]?.answer1,
                    // answer2: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectUpdateRoomRedux]?.answer2,
                    // answer3: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectUpdateRoomRedux]?.answer3,
                    // answer4: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectUpdateRoomRedux]?.answer4,
                    // correct: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectUpdateRoomRedux]?.correct,
                    // explain: listQuestionRedux && listQuestionRedux.length > 0 && listQuestionRedux[selectUpdateRoomRedux]?.explain,
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
    }, [id, listQuestionRedux, listQuestionRoomRedux])

    const handleMoveReviewStep = () => {
        if (!handleChangeMovePage) return;
        handleChangeMovePage("view")
    }

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
        const loadData = setTimeout(() => {
            if (id) {
                distpatch(RoomUpdateActionCreator.ChangeQuestionUpdate(txtEditor))
            } else {
                distpatch(RoomActionCreator.ChangeQuestion(txtEditor))
            }
        }, 200)
        return () => clearTimeout(loadData)
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
                if (listQuestionRoomRedux !== undefined) {
                    await setTxtEditor(listQuestionRoomRedux && listQuestionRoomRedux[selectUpdateRoomRedux])
                    await setLoading(false)
                }
            }
            fetchData();
            return () => fetchData();
        } else {
            const fetchData = async () => {
                try {
                    await setLoading(true)
                    if (listQuestionRedux !== undefined) {
                        await setTxtEditor(listQuestionRedux && listQuestionRedux[selectedQuestion])
                        await setLoading(false)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData();
            return () => fetchData();
        }

    }, [selectedQuestion, selectUpdateRoomRedux, listQuestionRedux, listQuestionRoomRedux, id])

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

    return loading === true ? (<Spin size="large" />) : (
        <Form className="wrapCreateQuestionItem" >
            <div className="formItem-input ">
                <h4>Nội dung câu hỏi: </h4>
                <ReactQuill className="editor question"
                    modules={FormCreateQuestion?.modules}
                    formats={FormCreateQuestion?.formats}
                    onBlur={() => handleBlurEditor(txtEditor.question, ".question")}
                    theme="snow"
                    value={txtEditor?.question || ""}
                    onChange={(value) => handleOnChange(value, "question")} />
                <span className="errors question"></span>
            </div>

            <div className="formItem-input ">
                <h4>Nội dung đáp án 1: </h4>
                <ReactQuill className="editor answer1"
                    modules={FormCreateQuestion?.modules}
                    formats={FormCreateQuestion?.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer1, ".answer1")} theme="snow" value={txtEditor?.answer1 || ""}
                    onChange={(value) => handleOnChange(value, "answer1")} />
                <span className="errors answer1"></span>
            </div>
            <div className="formItem-input ">
                <h4>Nội dung đáp án 2: </h4>
                <ReactQuill className="editor answer2"
                    modules={FormCreateQuestion?.modules}
                    formats={FormCreateQuestion?.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer2, ".answer2")} theme="snow" value={txtEditor?.answer2 || ""}
                    onChange={(value) => handleOnChange(value, "answer2")} />
                <span className="errors answer2"></span>
            </div>
            <div className="formItem-input question">
                <h4>Nội dung đáp án 3: </h4>
                <ReactQuill className="editor answer3"
                    modules={FormCreateQuestion?.modules}
                    formats={FormCreateQuestion?.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer3, ".answer3")} theme="snow" value={txtEditor?.answer3 || ""}
                    onChange={(value) => handleOnChange(value, "answer3")} />
                <span className="errors answer3"></span>

            </div>
            <div className="formItem-input answer">
                <h4>Nội dung đáp án 4: </h4>
                <ReactQuill className="editor answer4"
                    modules={FormCreateQuestion?.modules}
                    formats={FormCreateQuestion?.formats}
                    onBlur={() => handleBlurEditor(txtEditor.answer4, ".answer4")} theme="snow" value={txtEditor?.answer4 || ""}
                    onChange={(value) => handleOnChange(value, "answer4")} />
                <span className="errors answer4"></span>
            </div>
            <div className="formItem-select">
                <h4>Đáp án của câu hỏi: </h4>
                <Select value={txtEditor?.correct || "A"} onChange={handleOnChangeSelect} defaultValue="A" style={{ width: "100%" }} >
                    <Select.Option value="A">Đáp án 1</Select.Option>
                    <Select.Option value="B">Đáp án 2</Select.Option>
                    <Select.Option value="C">Đáp án 3</Select.Option>
                    <Select.Option value="D">Đáp án 4</Select.Option>
                </Select>
            </div>
            <div className="formItem-input answer">
                <h4>Phần bài giải: </h4>
                <ReactQuill className="editor explain"
                    modules={FormCreateQuestion.modules}
                    formats={FormCreateQuestion.formats}
                    onBlur={() => handleBlurEditor(txtEditor.explain, ".explain")} theme="snow"
                    value={txtEditor?.explain || "" ? txtEditor.explain : ''}
                    onChange={(value) => handleOnChange(value, "explain")} />
                <span className="errors explain"></span>
            </div>

            <div className="wrapButtonSubmit fixed">
                <button onClick={() => handleMoveReviewStep('view')} className="btn-submit">Tiếp tục</button>
            </div>
        </Form>
    )
}


export default FormCreateQuestion
