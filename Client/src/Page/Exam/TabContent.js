import { Col, Pagination, Row, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { axiosCategory } from '../../API/categoryAxios';
import { axiosExam } from '../../API/examAxios';
import ItemHotExam from './DetailExam/ItemHotExam';
import ItemExam from './ItemExam';

const TabContent = ({ typeTab, tagId, tagChild }) => {
    const { Option } = Select
    const [listExam, setListExam] = useState([]);
    const [currentTag, setCurrentTag] = useState('all');
    const [listHotExam, setListHotExam] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listHighlight, setListHighLight] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await setLoading(true)
            const res = await axiosCategory.get('/');
            const newArr = []
            for (let value of res.data) {
                for (let item of value.childrents) {
                    if (item.types === "type-2") {
                        newArr.push(item.nameCategory)
                    }
                }
            }
            const resExam = await axiosExam.get('/');
            const x = resExam.data.splice(0, 5)
            await setListHotExam(x);
            await setListHighLight(newArr);
            await setLoading(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchExam = async () => {
            await axiosExam.get('/', null).then(res => {
                setListExam(res.data?.filter(item => item.field === tagId && item.status !== 'private'))
            });
            // setListExam(res.data)
        }
        fetchExam();
    }, [tagId])

    useEffect(() => {
        if (currentTag === 'all') {
            const fetchExam = async () => {
                await axiosExam.get('/', null).then(res => {
                    setListExam(res.data?.filter(item => item.field === tagId && item.status !== 'private'))
                });
                // setListExam(res.data)
            }
            fetchExam();
        } else {
            const fetchExam = async () => {
                await axiosExam.get('/', null).then(res => {
                    setListExam(res.data?.filter(item => item.field === tagId && item.status !== 'private')
                        .filter(item => item.tags.includes(currentTag)))
                });
                // setListExam(res.data)
            }
            fetchExam();
        }
    }, [currentTag, tagId])

    const handleChangeTags = (value) => {
        setCurrentTag(value);
    }
    return (
        <>
            <Row >
                <Col className="wrapListHotExam" xs={0} sm={0} md={0} lg={7} xl={7}>
                    <h2 className="wrapListHotExam__title">Bộ đề nổi bật</h2>
                    {listHotExam.map((item, index) => (
                        <ItemHotExam item={item} index={index} />
                    ))}
                    {/* <ItemHotExam />
                    <ItemHotExam />
                    <ItemHotExam />
                    <ItemHotExam /> */}
                </Col>
                <Col className="wrapListExam" xs={24} sm={24} md={24} lg={16} xl={16}>
                    <Row className="wrapSelectCategory">
                        <Col span={12}><h3>Danh mục đề: </h3></Col>
                        <Col span={12}>
                            <Select onChange={handleChangeTags} defaultValue="all" style={{ width: "100%" }} >
                                <Option key="default" value='all'>All</Option>
                                {tagChild?.map(item => (
                                    <Option key={item.key} value={item.nameCategory}>{item.nameCategory}</Option>
                                ))}
                                {/* <Option value="category2">Danh mục 2</Option> */}
                            </Select>
                        </Col>
                    </Row>
                    {loading ? <Spin /> : (
                        <Row>
                            {listExam.length > 0 ? (listExam.map(item => (
                                <ItemExam listHighlight={listHighlight} key={item._id} item={item} />
                            ))) : (<>
                                <div>Hiện tài chưa có bộ đề nào trong lĩnh vựa này</div>
                            </>)}
                            {/* <ItemExam />
                        <ItemExam />
                        <ItemExam />
                        <ItemExam /> */}

                        </Row>
                    )}

                </Col>
            </Row>
            <center><Pagination defaultCurrent={1} total={50} style={{ marginTop: '10px' }} /></center>
        </>
    )
}

export default TabContent
