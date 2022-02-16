import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { FastField, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Container } from "reactstrap";
import * as yup from "yup";
import { axiosCategory } from "../../../../API/categoryAxios";
import CustomFieldSelect from "../../../../Components/CustomField/CustomFieldSelect";

const ForrmCreateTags = () => {
    const token = useSelector((state) => state.token);
    const history = useHistory();
    const borderError = "0.5px solid red";
    const border = "0.5px solid #7b7a79";
    const options = [
        {
            key: "status-1",
            value: "Hoạt động",
        },
        { key: "status-2", value: "Ẩn" },
    ];
    const { id } = useParams();
    const [valueCategory, setValueCategory] = useState({});
    const [loading, setLoading] = useState(false);

    const randomNumber = () => {
        return Math.floor(Math.random() * 1000);
    };
    const handleAddChildrent = (arrayHelpers) => {
        arrayHelpers.push({
            nameCategory: "",
            statusCategory: "status-1",
            types: "type-1",
            key: new Date().getTime() + randomNumber(),
        });
    };

    const NameCategoryFormList = (arr, feature) => {
        let newArr = [];
        for (let item of arr) {
            newArr.push(item[feature]);
        }
        return newArr;
    }

    const comparisonArrString = (arr1, arr2) => {
        if (arr1.length >= arr2.length) {
            for (let item of arr2) {
                if (arr1.includes(item))
                    return true;
            }
        } else {
            for (let item of arr1) {
                if (arr2.includes(item))
                    return true;
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await setLoading(true);
            const res = await axiosCategory.get(`/getCategory/${id}`, {
                headers: { Authorization: token },
            });
            await setValueCategory(res.data);
            await setLoading(false);
        };
        fetchData();
        return () => fetchData();
    }, [id, token]);

    // const types = [
    //     {
    //         key: "type-1",
    //         value: "Danh mục",
    //     },
    //     {
    //         key: "type-2",
    //         value: "Chủ đề",
    //     },
    // ];

    return loading ? (
        <Spin />
    ) : (
        <Container>
            <Formik
                initialValues={{
                    childrents: [
                        {
                            nameCategory: "",
                            statusCategory: "status-1",
                            key: new Date().getTime() + randomNumber(),
                        },
                    ],
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const listNameCategory = NameCategoryFormList(valueCategory?.childrents, "nameCategory")
                        const listNameNewCategory = NameCategoryFormList(values?.childrents, "nameCategory")
                        const check = comparisonArrString(listNameCategory, listNameNewCategory);
                        if (check === true) return toast.error("Tên thẻ đã tồn tại vui lòng kiểm tra lại");
                        const newArr = valueCategory?.childrents?.concat([
                            ...values.childrents,
                        ]);
                        const valueUpdate = {
                            ...valueCategory,
                            childrents: [...newArr],
                        };

                        const res = await axiosCategory.post(`/createTags/${id}`, valueUpdate, {
                            headers: {
                                Authorization: token,
                            },
                        });
                        toast.success(res.data.msg);
                        history.push("/admin/category");

                    } catch (err) {
                        err.response?.data.msg && toast.error(err.response?.data.msg);
                    }
                }}
                validationSchema={yup.object().shape({
                    childrents: yup.array().of(
                        yup.object().shape({
                            nameCategory: yup
                                .string()
                                .max(25, "Tên lĩnh vực phải ít hơn 25 ký tự")
                                .required("Vui lòng nhập đầy đủ thông tin"),
                        })
                    ),
                })}
            >
                {({ values, handleSubmit, handleChange, errors, touched }) => (
                    <Form className="wrapFormCreateCategory" onSubmit={handleSubmit}>
                        <FieldArray
                            name="childrents"
                            render={(arrayHelpers) => (
                                <div className="wrapFormCategoryChild">
                                    {values.childrents && values.childrents.length > 0 ? (
                                        values.childrents.map((tag, index) => (
                                            <div key={index}>
                                                <div className="wrapFormCategoryChildItem" key={index}>
                                                    <div className="wrapArrayField">
                                                        <div className="formItem-input">
                                                            <h5>Tên thẻ:</h5>
                                                            <FastField
                                                                style={{
                                                                    border:
                                                                        errors?.childrents &&
                                                                            errors.childrents[index] &&
                                                                            errors.childrents[index].nameCategory &&
                                                                            touched?.childrents &&
                                                                            touched.childrents[index] &&
                                                                            touched.childrents[index].nameCategory
                                                                            ? borderError
                                                                            : border,
                                                                }}
                                                                placeholder="VD: Javascript"
                                                                className="input-item"
                                                                name={`childrents[${index}].nameCategory`}
                                                            />
                                                            {errors?.childrents &&
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
                                                                name={`childrents[${index}].statusCategory`}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="wrapButtonRemove">
                                                        <Button
                                                            hidden={index === 0 ? true : false}
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
                                        <Button
                                            onClick={() => handleAddChildrent(arrayHelpers)}
                                            className="btnAdd"
                                            icon={<PlusCircleOutlined />}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                        <div className="wrapButton">
                            <button type="submit" className="btnImport">
                                Lưu thông tin
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default ForrmCreateTags;
