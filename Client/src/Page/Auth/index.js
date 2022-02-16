import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Login from './Login';
import Register from './Register';


const Auth = ({ type }) => {
    const history = useHistory();

    React.useEffect(() => {
        if (type === "register") {
            const wrapForm = document.querySelector(".wrapForm");
            const section = document.querySelector("section");
            wrapForm.classList.toggle('active');
            section.classList.toggle('active');
        }
    }, [type])

    const handleChangeMovePage = () => {
        const wrapForm = document.querySelector(".wrapForm");
        const section = document.querySelector("section");
        wrapForm.classList.toggle('active');
        section.classList.toggle('active');
    }
    const check = localStorage.getItem('login')
    useEffect(() => {
        if (check === 'true') {
            history.replace('/');
        }
    })

    return (
        <section className="wrapAuth">
            <div className="wrapForm">
                <Login handleChangeMovePage={handleChangeMovePage} />
                <Register handleChangeMovePage={handleChangeMovePage} />
            </div>
        </section>
    )
}

export default Auth
