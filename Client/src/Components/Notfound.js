import { RollbackOutlined } from '@ant-design/icons';
import { Button } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

const NotFound = () => {
  const history = useHistory();
  return (

    <div id='notfound' className="notfound-container">
      <h1 className="notfound-first-four">4</h1>
      <div className="notfound-cog-wheel1">
        <div className="notfound-cog1">
          <div className="notfound-top"></div>
          <div className="notfound-down"></div>
          <div className="notfound-left-top"></div>
          <div className="notfound-left-down"></div>
          <div className="notfound-right-top"></div>
          <div className="notfound-right-down"></div>
          <div className="notfound-left"></div>
          <div className="notfound-right"></div>
        </div>
      </div>

      <div className="notfound-cog-wheel2">
        <div className="notfound-cog2">
          <div className="notfound-top"></div>
          <div className="notfound-down"></div>
          <div className="notfound-left-top"></div>
          <div className="notfound-left-down"></div>
          <div className="notfound-right-top"></div>
          <div className="notfound-right-down"></div>
          <div className="notfound-left"></div>
          <div className="notfound-right"></div>
        </div>
      </div>
      <h1 className="notfound-second-four">4</h1>
      <p className="notfound-wrong-para"><Button style={{ display: 'inline-flex', alignItems: 'center' ,marginRight:'1rem', textDecoration:'none'}} icon={<RollbackOutlined />} type='primary' href='/' >Trang chủ</Button>Không tìm thấy trang! xin vui lòng kiểm tra lại</p>
    </div>
  )
}

export default NotFound
