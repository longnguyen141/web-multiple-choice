import { Avatar, Spin, Tooltip } from 'antd'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { axiosResultRoom } from '../../API/resultRoomAxios'
import { SelectRoomActionCreator } from '../../Redux/ActionCreator'
import { useHistory } from 'react-router';
import moment from 'moment';
import axios from 'axios';

const InfoRoom = ({ date, titleRoom = "room 1", type = "coming" }) => {
    const user = useSelector(state => state.auth);
    const roomSelected = useSelector(state => state.selectRoom);
    const [loading, setLoading] = useState(0);
    const history = useHistory();
    const token = useSelector(state => state.token);
    const [checkJoinRoom, setCheckJoinRoom] = useState(false);
    const [listUsers, setListUser] = useState([])
    const [checkTestRoom, setCheckTestRoom] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            await setLoading(true);
            setTimeout(async () => {
                await setLoading(false);
            }, 1000)
        }
        fetchData()
    }, [date])
    useEffect(() => {
        const fetchResultRoom = async () => {
            const resRoom = await axiosResultRoom.post('/getResult', { idUser: user.user._id, idRoom: roomSelected.info._id }, {
                headers: { Authorization: token }
            })
            await setCheckTestRoom(resRoom.data);
        }
        fetchResultRoom();

    }, [user, roomSelected, token])
    const today = new Date();
    const [number, setNumber] = useState({
        days: '',
        hours: '',
        minutes: '',
        seconds: '',
    });
    const [time, setTime] = useState({
        minutes: moment(date).add(roomSelected?.info?.testTimeRoom, 'minutes').diff(moment(today), 'minutes'),
        seconds: 0,
    });

    // useEffect(() => {
    //     if (number.hours <= 0 && number.minutes <= 0 && number.days <= 0 && number.seconds <= 0) {
    //         const checkNumber = async () => {
    //             const newData = { ...roomSelected, type: 'active' }
    //             await dispatch(SelectRoomActionCreator.ChangeRoom(newData))
    //             await setNumber({
    //                 days: '',
    //                 hours: '',
    //                 minutes: '',
    //                 seconds: '',
    //             })
    //         }
    //         checkNumber()
    //         return () => checkNumber();
    //     }
    // }, [roomSelected, dispatch, number])

    // useEffect(() => {
    //     if (time.minutes === 0 && time.seconds === 0) {
    //         const checkTime = async () => {
    //             const newData = { ...roomSelected, type: 'closed' }
    //             dispatch(SelectRoomActionCreator.ChangeRoom(newData))
    //             await setTime({
    //                 minutes: '',
    //                 seconds: '',
    //             })
    //         }
    //         checkTime()
    //         return () => checkTime()
    //     }
    // }, [roomSelected, dispatch, time])

    useEffect(() => {
        const fetchData = async () => {
            const arrListUser = []
            roomSelected?.info?.listUser?.forEach(data => {
                arrListUser.push(data.emailItemUser)
            })
            const res = await axios.get('/user/all_info', {
                headers: {
                    Authorization: token,
                }
            })
            const newArr = res.data.filter(item => arrListUser?.includes(item.email))
            newArr.forEach(item => {
                roomSelected?.info?.listUser?.forEach(tmp => {
                    if (tmp.emailItemUser === item.email) {
                        item.key = item._id
                        item.timeFinish = tmp.timeFinish
                        item.point = tmp.point
                    }
                })
            })
            await setListUser(newArr)
            await setCheckJoinRoom(newArr.findIndex(item => item.email === user.user.email))
        }
        fetchData()
    }, [token, roomSelected])

    useEffect(() => {
        const countDownTime = setInterval(() => {
            if (time.seconds > 0) {
                setTime({
                    ...time,
                    seconds: time.seconds - 1,
                })
            }
            if (time.seconds === 0) {
                if (time.minutes === 0) {
                    clearInterval(countDownTime)
                } else {
                    setTime({
                        seconds: 59,
                        minutes: time.minutes - 1,
                    })
                }
            }
        }, 1000)
        return () => clearInterval(countDownTime)
    }, [time])

    useLayoutEffect(() => {
        const countdown = setInterval(() => {
            let startTime = new Date();
            //ng??y thi
            let endTime = new Date(date);
            // T??nh ch??nh l???ch b???ng mili gi??y
            let timeDiff = endTime - startTime;
            // Lo???i nano miliseconds
            timeDiff /= 1000;
            // Tr??? v??? gi??y v?? d??ng round n??n s??? sai s???
            let seconds = Math.round(timeDiff % 60);
            // X??a gi??y
            timeDiff = Math.floor(timeDiff / 60);
            // tr??? v??? ph??t
            let minutes = Math.round(timeDiff % 60);
            timeDiff = Math.floor(timeDiff / 60);
            let hours = Math.round(timeDiff % 24);
            timeDiff = Math.floor(timeDiff / 24);
            let days = timeDiff;
            setNumber({
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            })
        }, 1000)
        return () => countdown
    }, [date])

    return roomSelected.title !== '' ? (
        <>
            {loading === true ? <Spin /> : (
                <div className="containerInfoRoomSelect">
                    {roomSelected.type === "coming" ? (
                        <>
                            <h2>{roomSelected.title}</h2>
                            <p>Ng?????i t???o ph??ng: <span>{roomSelected?.user?.name}</span></p>
                            <p>Th???i gian thi: <span>{roomSelected.info.testTimeRoom} ph??t</span></p>
                            <p>Th???i gian b???t ?????u thi: <span>{moment(date).format('DD/MM/YYYY hh:mm A')}</span> </p>
                            <p>Th???i gian ?????n l??c m??? ph??ng thi c??n: <span>{`${number.days} ng??y ${number.hours} gi??? ${number.minutes} ph??t ${number.seconds} gi??y`}</span></p>
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>S??? ng?????i d??ng tham gia: <span>&nbsp;{roomSelected?.info?.listUser?.length}</span> &nbsp;&nbsp;
                                <span><Avatar.Group maxCount={5}>
                                    {listUsers?.map((item, index) => (
                                        <Tooltip key={index} title={item.name}>
                                            <Avatar className='pointer' onClick={() => history.push(`/profile/${item._id}`)} src={item.avatar}>{item.avatar ? item.avatar : item.name.charAt(0).toUpperCase()}</Avatar>
                                        </Tooltip>
                                    ))}
                                </Avatar.Group></span>
                            </p>
                            {/* <p>Ch??? ?????: <span>{roomSelected.info.nameRoom}</span></p> */}
                        </>
                    ) : (
                        <div>
                            <h2>{roomSelected.title}</h2>
                            <p>Ng?????i t???o ph??ng: <span>{roomSelected?.user?.name}</span></p>
                            <p>Th???i gian thi: <span>{roomSelected.info.testTimeRoom} ph??t</span></p>
                            <p>Th???i gian b???t ?????u thi: <span>{moment(date).format('DD/MM/YYYY hh:mm A')}</span> </p>
                            <p>Th???i gian thi c??n: <span>{`${time.minutes} ph??t ${time.seconds} gi??y`}</span></p>
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>S??? ng?????i d??ng tham gia: <span>&nbsp;{roomSelected?.info?.listUser?.length}</span> &nbsp;&nbsp;
                                <span><Avatar.Group maxCount={5}>
                                    {listUsers?.map((item, index) => (
                                        <Tooltip key={index} title={item.name}>
                                            <Avatar className='pointer' onClick={() => history.push(`/profile/${item._id}`)} src={item.avatar}>{item.avatar ? item.avatar : item.name.charAt(0).toUpperCase()}</Avatar>
                                        </Tooltip>
                                    ))}
                                </Avatar.Group></span>
                            </p>
                            {/* <p>Ch??? ?????: <span>Javascript</span></p> */}
                            {checkJoinRoom >= 0 ? (
                                checkTestRoom === '' || checkTestRoom === null ? (
                                    <div className="wrapButton">
                                        <button onClick={() => history.push(`/room-exam/room-test/${roomSelected.info._id}`)} className="btnSend">Tham gia ki???m tra</button>
                                    </div>
                                ) : (<div >
                                    <p style={{ fontWeight: 'bold' }}>B???n ???? ho??n th??nh b??i ki???m tra vui l??ng ?????i k???t qu??? t??? ng?????i t???o ph??ng thi</p>
                                </div>)
                            ) : <></>}
                        </div>
                    )}
                </div>
            )}
        </>
    )
        : (<h2>Vui ch???n ph??ng ????? hi???n th??? th??ng tin</h2>)
}

export default React.memo(InfoRoom)
