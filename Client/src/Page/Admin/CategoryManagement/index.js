import { Badge, Breadcrumb, Layout, Modal, Space, Spin, Table } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { axiosCategory } from '../../../API/categoryAxios';
import SlideBar from '../../../Components/Admin/SlideBar';
import { SelectUpdateTagsActionCreator } from '../../../Redux/ActionCreator';
import { handleMovePageAdmin } from '../../../Service/MovePageAdmin';

const { Header, Content, Footer } = Layout;

const ListCategories = () => {
    const [listTags, setListTags] = useState([]);
    const dispatch = useDispatch();
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [value, setValue] = useState('');
    const token = useSelector(state => state.token)

    const history = useHistory();
    const auth = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)
    const check = localStorage.getItem('login')
    useEffect(() => {
        if (!check) {
            history.push('/admin/login')
        } else {
            if (auth.user.email && auth.user.role === 1) {
                setLoading(false);
            }
        }
    }, [auth.user, check, history])

    useEffect(() => {
        const fetchListTags = async () => {
            const resTags = await axiosCategory.get('/', null);
            setListTags(resTags.data)
        }
        fetchListTags()
        return () => fetchListTags()
    }, [value])

    const handleChangeCategoryRedux = async (category, item) => {
        await dispatch(SelectUpdateTagsActionCreator.ChangeCategory(category));
        await setTimeout(() => {
            history.push(`/admin/update-tags/${item?._id}`);
        }, 200)
    }

    const handleCreateTag = (item) => {
        history.push(`/admin/create-tags/${item?._id}`);
    }

    const handleDeleteCategory = async (value) => {
        if (value.type === "category") {
            try {
                const res = await axiosCategory.delete(`/deleteCategory/${value?.item?._id}`, {
                    headers: {
                        Authorization: token
                    }
                })
                toast.success(res?.data.msg)
                await setOpenConfirmDelete(false);
                await setValue({})
            } catch (error) {
                error.response.data.msg && toast.error(error.response.data.msg)
            }
        } else {

            const valueUpdate = {
                ...value.item,
                childrents: value?.item?.childrents?.filter(data => data._id !== value.id),
            }
            const res = await axiosCategory.post(`/deleteTags/${value?.item?._id}`, valueUpdate, {
                headers: {
                    Authorization: token
                }
            })
            toast.success(res?.data.msg)
            await setOpenConfirmDelete(false);
            await setValue({})
        }
    }

    const expandedRowRender = (record) => {
        const columns = [
            { title: 'T??n th???', dataIndex: 'nameCategory', key: 'nameCategory' },
            {
                title: 'Tr???ng th??i',
                key: 'status',
                render: (item) => (
                    <span>
                        <Badge status={`${item.statusCategory === 'status-1' ? 'success' : 'error'}`} />
                        {/* {item === 'status-1' ? 'Active' : 'Hident'} */}
                        {item.statusCategory === 'status-1' ? 'Ho???t ?????ng' : '???n'}
                    </span>
                ),
            },
            // {
            //     title: 'Lo???i th???',
            //     key: 'types',
            //     render: (item) => (
            //         <span>
            //             <Badge status={"processing"} />
            //             {/* {item === 'status-1' ? 'Active' : 'Hident'} */}
            //             {item.types === 'type-1' ? 'Ch??? ?????' : 'Danh m???c'}
            //         </span>
            //     ),
            // },
            {
                title: 'Action', key: 'operation', render: (item) => {
                    console.log(item)
                    console.log(record)
                    return (
                        <Space size="middle">
                            <p className='pointer' onClick={() => handleChangeCategoryRedux(record, item)}>Ch???nh s???a</p>
                            {record.childrents.length > 1 ? (
                                <p className='pointer' onClick={() => {
                                    setOpenConfirmDelete(true);
                                    setValue({
                                        item: record,
                                        id: item._id,
                                        type: "tags"
                                    });
                                }} >X??a</p>
                            ) : <></>}
                        </Space>
                    )
                },
            },
        ];

        return <Table columns={columns} dataSource={record.childrents} pagination={false} />;
    };

    const columns = [
        { title: 'T??n l??nh v???c', dataIndex: 'displayName', key: 'displayName' },
        {
            title: 'Tr???ng th??i',
            key: 'status',
            render: (item) => (
                <span>
                    <Badge status={`${item.status === 'status-1' ? 'success' : 'error'}`} />
                    {/* {item === 'status-1' ? 'Active' : 'Hident'} */}
                    {item.status === 'status-1' ? 'Ho???t ?????ng' : '???n'}
                </span>
            ),
        },
        {
            title: 'Th???i gian t???o', key: 'createdAt', render: (item) => (
                <span>
                    {moment(item.createdAt).format('dddd DD/MM/YYYY, h:mm:ss A')}
                </span>
            ),
        },
        {
            title: 'H??nh ?????ng', key: 'operation', render: (item) => (
                <Space size="middle">
                    <p className='pointer' onClick={() => history.push(`/admin/category/update/${item._id}`)}>Ch???nh s???a</p>
                    <p className='pointer' onClick={() => handleCreateTag(item)}>Th??m th???</p>
                    <p className='pointer' onClick={() => {
                        setOpenConfirmDelete(true);
                        setValue({
                            item: item,
                            type: "category"
                        });
                    }}>X??a</p>
                </Space>
            ),
        },
    ];



    return loading ? <Spin /> : (
        <Layout className="containerDashboard">
            <SlideBar />
            <Layout className="containerLayoutContent">
                <Header className="wrapHeaderLayout" >
                    Qu???n l?? l??nh v???c
                </Header>
                <Content className="wrapLayoutContent">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item onClick={() => history.push('/admin/category')}>L??nh v???c</Breadcrumb.Item>
                        <Breadcrumb.Item>Danh s??ch l??nh v???c</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="wrapContentMain" >
                        <div className="wrapButton" style={{ justifyContent: 'flex-end' }}>
                            <button onClick={() => handleMovePageAdmin('/admin/category/create', 'addUser', dispatch, history)} className="submit">Th??m l??nh v???c</button>
                        </div>
                        <Table
                            className="components-table-demo-nested"
                            columns={columns}
                            expandable={{
                                expandedRowRender
                                // expandedRowRender: record => <>
                                //     {record.childrents.map((item) => (
                                //         <div>{item.nameCategory}</div>
                                //     ))}
                                // </>,
                                // rowExpandable: record => record.name !== 'Not Expandable',
                            }}
                            dataSource={listTags}
                        />
                    </div>
                    <Modal title="Th??ng b??o" visible={openConfirmDelete} onOk={() => handleDeleteCategory(value)} onCancel={() => setOpenConfirmDelete(false)}>
                        <h3>B???n ch???c ch???n mu???n x??a tr?????ng d??? li???u n??y?</h3>

                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CopyRight ?? 2021 </Footer>
            </Layout>
        </Layout>
    );
}
export default ListCategories