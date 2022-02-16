import { InfoCircleOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Pagination, Row, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
// import ItemExam from '../../Exam/ItemExam';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosExam } from '../../../API/examAxios';
import { QuestionExamActionCreator } from '../../../Redux/ActionCreator';
import DetailInfoRoom from './DetailModalExam/DetailInfoRoom';
import ListQuestionDetail from './DetailModalExam/ListQuestionDetail';
import ListUserTakeExam from './DetailModalExam/ListUserTakeExam';

const ListExamProfile = () => {
    const { id } = useParams()
    const { Option } = Select;
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [currentTag, setCurrentTag] = useState('all');
    const [listExam, setListExam] = useState([]);
    const [listExamShow, setListExamShow] = useState([]);
    const [infoExam, setInfoExam] = useState('');
    const [loadData, setLoadData] = useState(false)
    const dispatch = useDispatch();
    const token = useSelector(state => state.token)
    const [pageNumber, setPageNumber] = useState(1)
    const handleChangeTags = (value) => {
        setCurrentTag(value);
    }
    const history = useHistory();

    useEffect(() => {
        const listClone = listExam;
        const list = listClone.slice((pageNumber - 1) * 4, pageNumber * 4);
        setListExamShow(list)
    }, [pageNumber, id, listExam])

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosExam.get('/');
            const newFilter = res.data.filter(item => item.idUser === id)
            setListExam(newFilter)
        }
        fetchData()
        return () => fetchData()
    }, [id, loadData])


    const handleViewDetail = async (id) => {
        await setOpenModal(true);
        const res = await axiosExam.get(`/${id}`);
        setInfoExam(res.data);
    }

    const handleMoveEditExam = async (link) => {
        dispatch(QuestionExamActionCreator.ChangeStatus(true));
        history.push(link);
    }

    const handleDeleteExam = async () => {
        try {
            const res = await axiosExam.delete(`/deleteExam/${infoExam._id}`, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res.data.msg)
            // window.location.reload();
            await setLoadData(!loadData);
            await setOpenConfirmDelete(false);
            await setOpenModal(false);

            history.push(`/profile/${id}`);
        } catch (err) {
            err.response.data.msg && toast.error(err.response.data.msg)
        }
    }

    return (
        <div className="wrapListExam">
            <Row className="wrapSelectCategory">
                <Col span={12}><h3>Danh mục đề: </h3></Col>
                <Col span={12}>
                    <Select onChange={handleChangeTags} defaultValue="all" style={{ width: "100%" }} >
                        <Option key="default" value='all'>All</Option>
                        {/* {tagChild?.map(item => (
                                    <Option key={item.key} value={item.nameCategory}>{item.nameCategory}</Option>
                                ))} */}
                        {/* <Option value="category2">Danh mục 2</Option> */}
                    </Select>
                </Col>
            </Row>
            {
                <Row >
                    {listExamShow.length > 0 ? (listExamShow.map((item, index) => (
                        <Col key={index} className="wrapItem" xs={24} sm={24} md={24} lg={24} xl={12}>
                            <img onClick={() => handleViewDetail(item._id)} className="imgItem" src="https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"
                                alt="imgExam"
                            />
                            <div className="wrapContent">
                                <h2 onClick={() => handleViewDetail(item._id)} className="title">{item.title}</h2>
                                <p className="description">
                                    {item.description}
                                </p>
                                <div className="wrapListTag">
                                    {item.tags.map((valueTag, index) => (
                                        <p className={`itemTag `} key={index} >{valueTag}</p>
                                    ))}
                                </div>
                                <div className="wrapInfo">
                                    <p>Tên tác giả: <span>{item.authorName ? item.authorName : "Nguyễn Văn A"}</span></p>
                                    {/* <p>Thời gian làm bài: <span>60 phút</span></p>
                                        <p>Số câu hỏi: <span>50 câu</span></p> */}
                                </div>
                            </div>
                        </Col>
                    ))) : (<>
                        <div>Hiện tài chưa có bộ đề nào trong lĩnh vựa này</div>
                    </>)}
                    {/* <ItemExam />
                        <ItemExam />
                        <ItemExam />
                        <ItemExam /> */}

                </Row>
            }
            <Row><Pagination
                current={pageNumber}
                onChange={(e) => setPageNumber(e)}
                total={listExam.length}
                pageSize={5}
            /></Row>

            <Modal className="modalProfileRoom" title="Thông tin chi tiết" visible={openModal} onOk={() => setOpenModal(false)} onCancel={() => setOpenModal(false)}>
                <div className="wrapButtonAdmin">
                    <Button type="primary" onClick={() => handleMoveEditExam(`/exam/update/${infoExam._id}`)}>edit</Button>
                    <Button onClick={() => setOpenConfirmDelete(true)} danger>delete</Button>
                </div>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane
                        tab={
                            <span className="wrapIcon">
                                <InfoCircleOutlined />
                                Thông tin bộ đề
                            </span>
                        }
                        key="1"
                    >
                        <DetailInfoRoom infoExam={infoExam} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span className="wrapIcon">
                                <OrderedListOutlined />
                                Danh sách câu hỏi
                            </span>
                        }
                        key="2"
                    >
                        <ListQuestionDetail infoExam={infoExam} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span className="wrapIcon">
                                <TeamOutlined />
                                Danh sách tham gia bộ đề
                            </span>
                        }
                        key="3"
                    >
                        <ListUserTakeExam infoExam={infoExam} />
                    </Tabs.TabPane>
                </Tabs>
                <Modal title="Thông báo" visible={openConfirmDelete} onOk={handleDeleteExam} onCancel={() => setOpenConfirmDelete(false)}>
                    <h3>Bạn chắc chắn muốn xóa trường dữ liệu này?</h3>
                </Modal>
            </Modal>

        </div>
    )
}

export default ListExamProfile
