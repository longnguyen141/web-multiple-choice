import React, { useEffect } from 'react'
import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SelectFieldActionCreator } from '../../Redux/ActionCreator';
import { Avatar } from 'antd'

const CustomFieldSelect = ({
    field,
    form: { touched, errors },
    options,
    defaultValue,
    ...props
}) => {
    const selectField = useSelector(state => state.selectField);
    const dispatch = useDispatch();
    function handleChange(selectedOption) {
        if (!props.type) {
            dispatch(SelectFieldActionCreator.ChangeField(selectedOption))
        }

        const changeEvent = {
            target: {
                name: field.name,
                value: selectedOption,
            }
        }
        field.onChange(changeEvent)


    }

    useEffect(() => {
        if (props.type === "tags") {
            const changeEvent = {
                target: {
                    name: field.name,
                    value: [],
                }
            }
            field.onChange(changeEvent)
        }
    }, [props.type, selectField])

    return (
        <React.Fragment>
            <Select {...props} defaultValue={defaultValue} mode={props.type === "tags" || props.type === "listUser" ? 'multiple' : ''} onChange={handleChange}>
                {options.map(province => {
                    if (typeof province === "object" && !props.type) {
                        return (
                            <Select.Option value={province._id} key={province._id}>{province.displayName}</Select.Option>
                        )
                    }

                    if (typeof province === "object" && props.type === "tags")
                        return (
                            <Select.Option
                                value={
                                    province.nameCategory
                                }
                                key={province._id}>{province.nameCategory}</Select.Option>
                        )

                    if (typeof province === "object" && props.type === "check") {
                        return (
                            <Select.Option value={province.key} key={province.key}>{province.value}</Select.Option>
                        )
                    }

                    if (typeof province === "object" && props.type === "listUser") {
                        return (
                            <Select.Option value={province.email} key={province._id}>
                                <Avatar src={province.avatar}>{province.name.charAt(0).toUpperCase()}</Avatar>
                                <span style={{ marginLeft: '10px' }}>{province.email}</span>
                            </Select.Option>
                        )
                    }
                }
                )}
            </Select>
            {touched[field.name] &&
                errors[field.name] && <span className="errors"> &emsp;{errors[field.name]}</span>}
        </React.Fragment>
    )
}

export default CustomFieldSelect
