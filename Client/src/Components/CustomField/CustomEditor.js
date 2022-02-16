import React from 'react'
import ReactQuill from 'react-quill';


const CustomEditor = ({
    field,
    form: { touched, errors },
    ...props
}) => {
    function handleChange(e) {

        const changeEvent = {
            target: {
                name: field.name,
                value: e.target.value,
            }
        }
        field.onChange(changeEvent)
    }

    return (
        <React.Fragment>
            <ReactQuill
                onChange={(e) => handleChange(e)}
                theme="snow"
                {...props} />
        </React.Fragment>
    )
}

export default React.memo(CustomEditor)
