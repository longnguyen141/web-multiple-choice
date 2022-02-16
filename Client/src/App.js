import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Assets/scss/admin/category.scss';
import './Assets/scss/admin/dashboard.scss';
import './Assets/scss/admin/exam.scss';
import './Assets/scss/admin/login.admin.scss';
import './Assets/scss/admin/user.scss';
import './Assets/scss/backtotop.scss';
import './Assets/scss/common.scss';
import './Assets/scss/createExam.scss';
import './Assets/scss/createRoom.scss';
import './Assets/scss/exam.scss';
import './Assets/scss/footer.scss';
import './Assets/scss/header.scss';
import './Assets/scss/home.scss';
import './Assets/scss/login.scss';
import './Assets/scss/resultExam.scss';
import './Assets/scss/roomExam.scss';
import './Assets/scss/takeExam.scss';
import './Assets/scss/takeRoom.scss';
import './Assets/scss/profile.scss';
import './Assets/scss/notFound.scss';
import { AuthActionCreator } from './Redux/ActionCreator';
import RouterApp from "./Router";
import BackToTop from './Components/BackToTop';
require('dotenv').config()

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const token = useSelector(state => state.token);

  useEffect(() => {
    const login = localStorage.getItem('login');
    if (login) {
      const getToken = async () => {
        const res = await axios.post('/user/refresh_token', null);
        dispatch(AuthActionCreator.GET_TOKEN(res.data.access_token))
      }
      getToken()
      // return () => getToken()
    }
  }, [auth.isLogged, dispatch])

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(AuthActionCreator.Login())
        return AuthActionCreator.fetchUser(token).then(res => {
          dispatch(AuthActionCreator.GET_USER(res))
        })
      }
      getUser()

      // return () => getUser()
    }
  }, [token, dispatch])
  return (
    <>
      <RouterApp />
      <BackToTop />
    </>
  );
}

export default App;
