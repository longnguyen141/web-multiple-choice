import { Spin, Tooltip, Avatar } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { axiosResultRoom } from '../../API/resultRoomAxios';

const InfoRoomClosed = ({ date }) => {
    const user = useSelector(state => state.auth);
    const roomSelected = useSelector(state => state.selectRoom);
    const [loading, setLoading] = useState(0);
    const history = useHistory();
    const token = useSelector(state => state.token);
    const [checkJoinRoom, setCheckJoinRoom] = useState(false);
    const [listUsers, setListUser] = useState([])
    const [checkTestRoom, setCheckTestRoom] = useState('');


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
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [time, setTime] = useState({
        minutes: moment(date).add(roomSelected?.info?.testTimeRoom, 'minutes').diff(moment(today), 'minutes'),
        seconds: 0,
    });

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
                    <h2>{roomSelected.title}</h2>
                    <p>Ng?????i t???o ph??ng: <span>{roomSelected?.user?.name}</span></p>
                    <p>Th???i gian thi: <span>{roomSelected.info.testTimeRoom} ph??t</span></p>
                    <p>Th???i gian b???t ?????u thi: <span>{moment(date).format('DD/MM/YYYY hh:mm A')}</span> </p>
                    <p>Th???i gian k???t th??c thi: <span>{moment(date).add(roomSelected?.info?.testTimeRoom, 'minutes').format('DD/MM/YYYY hh:mm A')}</span> </p>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>S??? ng?????i d??ng tham gia: <span>&nbsp;{roomSelected?.info?.listUser?.length}</span> &nbsp;&nbsp;
                        <span><Avatar.Group maxCount={5}>
                            {listUsers?.map((item, index) => (
                                <Tooltip key={index} title={item.name}>
                                    <Avatar className='pointer' onClick={() => history.push(`/profile/${item._id}`)} src={item?.avatar}>{item?.avatar ? item?.avatar : item.name.charAt(0).toUpperCase()}</Avatar>
                                </Tooltip>
                            ))}
                        </Avatar.Group></span>
                    </p>
                    <p style={{ fontWeight: 'bold' }}>Ph??ng thi ???? k???t th??c</p>
                </div>
            )}
        </>
    )
        : (<h2>Vui ch???n ph??ng ????? hi???n th??? th??ng tin</h2>)
}

export default InfoRoomClosed
