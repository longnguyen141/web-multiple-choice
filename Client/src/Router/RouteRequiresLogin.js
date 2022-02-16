import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import Auth from "../Page/Auth";

const RouteRequiresLogin = props => {
    const [loading, setLoading] = useState(false);
    const auth = useSelector(state => state.auth);
    const history = useHistory()
    const [data, setData] = useState('');
    useEffect(() => {
        const loadComponent = async () => {
            await setLoading(true)
            await setData(auth)
            await setLoading(false)
        }
        loadComponent();
        return () => loadComponent();
    }, [auth])
    // useEffect(() => {
    if (auth.user === undefined || auth.user === {}) {
        history.replace('/login')
    }
    // }, [auth, history])

    return loading === true && data === '' ? <Spin /> : (
        <Route {...props}>{data.user ? props.children : <Auth />}</Route>
    );
};

export default RouteRequiresLogin;