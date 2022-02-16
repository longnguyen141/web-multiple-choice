import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadPage from "../Components/LoadPage";
import NotFound from '../Components/Notfound';
import Dashboard from '../Page/Admin';
import ListCategories from '../Page/Admin/CategoryManagement';
import CreateCategory from '../Page/Admin/CategoryManagement/CreateCategory/index';
import CreateTags from '../Page/Admin/CategoryManagement/CreateTags';
import UpdateTags from '../Page/Admin/CategoryManagement/UpdateTags';
import ListExams from '../Page/Admin/ExamManagement';
import CreateExamAdmin from '../Page/Admin/ExamManagement/CreateExamAdmin';
import DetailExamAdmin from '../Page/Admin/ExamManagement/DetailExamAdmin';
import LoginAdmin from '../Page/Admin/LoginAdmin';
import ListRooms from '../Page/Admin/RoomManagement';
import CreateRoomAdmin from '../Page/Admin/RoomManagement/CreateRoomAdmin';
import DetailInfoRoomAdmin from '../Page/Admin/RoomManagement/DetailInfoRoom';
import ListUsers from '../Page/Admin/UserManagement';
import CreateUser from '../Page/Admin/UserManagement/CreateUser/index';
import DetailUser from '../Page/Admin/UserManagement/DetailUser';
import Auth from '../Page/Auth';
import Profile from '../Page/Auth/Profile/profile';
import Exam from '../Page/Exam';
import CreateExam from '../Page/Exam/CreateExam';
import DetailExam from '../Page/Exam/DetailExam';
import ResultExam from '../Page/Exam/ResultExam';
import TakeExam from '../Page/Exam/TakeExam';
import Home from '../Page/Home';
import RoomExam from '../Page/RoomExam';
import CreateRoom from '../Page/RoomExam/CreateRoom';
import ResultRoom from '../Page/RoomExam/Result';
import TakeRoom from '../Page/RoomExam/TakeRoom';
import RouteRequiresLogin from './RouteRequiresLogin';


const RouterApp = () => {
    const auth = useSelector(state => state.auth);
    const role = auth.user.role;
    const loading = auth.isLoading;

    return (
        <>
            <Router>
                <LoadPage />
                <Switch>
                    <Route path='/admin/login' exact component={LoginAdmin} />
                    <Route path='/login' exact component={Auth} />
                    <Route path='/admin' exact render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <Dashboard />)} />
                    <Route path="/profile/:id" exact render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <Profile />)} />
                    <Route path='/admin/room' exact render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <ListRooms />)} />
                    <Route path='/admin/room-create' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateRoomAdmin />)}
                    />
                    <Route path='/admin/room/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <DetailInfoRoomAdmin />)}
                    />
                    <Route path='/admin/update-room/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateRoomAdmin />)}
                    />
                    <Route path='/admin/exam' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <ListExams />)}
                    />
                    <Route path='/admin/exam/create' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateExamAdmin />)}
                    />
                    <Route path='/admin/exam/update-exam/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateExamAdmin />)}
                    />
                    <Route path='/admin/exam/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <DetailExamAdmin />)}
                    />
                    <Route path='/admin/update-tags/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <UpdateTags />)}
                    />
                    <Route path='/admin/create-tags/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateTags />)}
                    />
                    <Route path='/admin/category' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <ListCategories />)}
                    />
                    <Route path='/admin/category/update/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateCategory />)}
                    />
                    <Route path='/admin/category/create' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateCategory />)}
                    />
                    <Route path='/admin/user/create' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateUser />)}
                    />
                    <Route path='/admin/user/update/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <CreateUser />)}
                    />
                    <Route path='/admin/user/:id' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <DetailUser />)}
                    />
                    <Route path='/admin/user' exact
                        render={() => ((loading === false && auth.user === "") || role === 0 ? <Redirect to={"/notfound"} /> : <ListUsers />)}
                    />
                    <Route path='/' exact component={Home} />
                    <Route path='/exam' exact component={Exam} />
                    <Route path='/exam/take-exam/:id' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <TakeExam />)}
                    />
                    <Route path='/exam/take-exam/:id/result'
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <ResultExam />)}
                    />
                    <Route path='/exam/create' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <CreateExam />)}
                    />
                    <Route path='/exam/update/:id' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <CreateExam />)}
                    />
                    <Route path='/exam/:id' exact component={DetailExam}
                    />
                    <Route path='/room-exam' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <RoomExam />)}
                    />
                    <Route path='/room-exam/create' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <CreateRoom />)}
                    />
                    <Route path='/room-exam/update-room/:id' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <CreateRoom />)}
                    />
                    <Route path='/room-exam/result/:id' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <ResultRoom />)}
                    />
                    <Route path='/room-exam/room-test/:id' exact
                        render={() => (loading === false && auth.user === "" ? <Redirect to={"/notfound"} /> : <TakeRoom />)}
                    />
                    <Route path='/user/activate/:activation_token' exact component={Auth}
                    />
                    <Route path='/user/reset/:token' exact component={Auth}
                    />
                    <Route path='/register' exact>
                        <Auth type="register" />
                    </Route>
                    <Route path="/test" exact component={RouteRequiresLogin} />
                    <Router path="*"  >
                        <NotFound />
                    </Router>

                </Switch>
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default RouterApp
