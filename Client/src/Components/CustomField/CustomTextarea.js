import React from 'react'

const CustomTextarea = ({
    field,
    form: { touched, errors },
    ...props
}) => (
    <React.Fragment>
        <textarea
            {...field} {...props} />
        {touched[field.name] &&
            errors[field.name] && <span className="errors"> &emsp;{errors[field.name]}</span>}
    </React.Fragment>
);

export default React.memo(CustomTextarea)
