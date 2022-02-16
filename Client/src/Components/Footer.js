import React from 'react'
import { Button } from 'antd'
import { FacebookOutlined, CopyrightCircleOutlined, PhoneOutlined, MailOutlined, GlobalOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons'

const Footer = () => {
    return (
        <div className="footer">
            <div className="content__top">
                <div className="item">
                    <Button shape="circle" icon={<PhoneOutlined className="green" />} className="Button" />
                    <p>(+84)9035 10314</p>
                </div>
                <div className="item" >
                    <Button shape="circle" icon={<MailOutlined className="red" />} className="Button" />
                    <p>longnguyenckltk@gmail.com</p>
                </div>
                <div className="item">
                    <Button shape="circle" icon={<GlobalOutlined className="blue" />} className="Button" />
                    <p>48-Cao Thắng-Hải Châu-Đà Nẵng</p>
                </div>
            </div>

            <div className="content__center">
                <div className="item icon">
                    <FacebookOutlined />
                    <InstagramOutlined />
                    <TwitterOutlined />
                </div>
                <div className="item">
                    <h3>Chức năng</h3>
                    <p>Ôn tập bộ đề</p>
                    <p>Tạo đề thi</p>
                    <p>Phòng thi online</p>
                </div>
                {/* <div className="item">
                    <h3>Subscribe</h3>
                    <input placeholder="Email" variant="outlined" className="input_mail" />
                    <span >
                        <button className="btnSend">Send</button>
                    </span>
                </div> */}

            </div>
            <div className="content__bottom">
                <p>CoppyRight 2021</p>
            </div>
        </div>
    )
}

export default Footer
