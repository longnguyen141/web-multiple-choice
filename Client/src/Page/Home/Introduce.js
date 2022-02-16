import React from 'react';
import imageCoding from '../../Assets/images/coding.png';
import documentIcon from '../../Assets/images/documentIcon.png';
import exactly from '../../Assets/images/exactly.png';
import imageIntro from '../../Assets/images/working.png';
import createIcon from '../../Assets/images/create.png';
import ideaIcon from '../../Assets/images/idea.png';

const Introduce = () => {
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeigh = window.innerHeight;
            const revealTop = reveals[i].getBoundingClientRect().top;
            const point = 150;
            if (revealTop < windowHeigh - point) {
                reveals[i].classList.add('active');
            } else {
                reveals[i].classList.remove('active');
            }
        }

    }
    window.addEventListener('scroll', reveal)
    // useEffect(() => {
    //     const revealElement = 
    //     return () => revealElement()
    // }, [])

    return (
        <div className="intro">
            <h2>Chào bạn đã đến với website của chúng tôi <br />
                Mục tiêu của chúng tôi
            </h2>
            <div className="content">
                <div className="content__item">
                    <h3>Giúp ôn tập kiến thức</h3>
                    <img src={imageIntro} alt="" />
                    <strong>Giúp bạn có thể ôn lại các kiến thức theo chủ đề mong muốn thông qua hình thức trắc nghiệm trực tuyến</strong>
                </div>
                <div className="content__item">
                    <h3>Giúp bạn kiểm tra kiến thức các thành viên trong nhóm, tổ chức</h3>
                    <img src={imageCoding} alt="" />
                    <strong>Giúp bạn tạo ra tạo đề thi, bài tập trắc nghiệm để phục vụ nhu cầu của bạn
                    </strong>
                </div>
            </div>

            <div className="function reveal">
                <h2 className="intro__title marginTop">Chức năng chính</h2>
                <div className="wrapFuntionList">
                    <div className="function__item">
                        <img className="function__item--img" src={createIcon} alt="" />
                        <strong>Tạo đề thi theo đề tài tự chọn</strong>
                    </div>
                    <div className="function__item">
                        <img className="function__item--img" src={ideaIcon} alt="" />
                        <strong>Tạo phòng thi online</strong>
                    </div>
                    <div className="function__item">
                        <img className="function__item--img" src={"https://freesvg.org/img/ftkview.png"} alt="" />
                        <strong>Xem điểm của các thi sinh đã tham gia đề thi, phòng thi của bạn</strong>
                    </div>
                    <div className="function__item">
                        <img className="function__item--img" src={"https://thungracdothi.com/wp-content/uploads/2020/08/search_file-512-400x400.png"} alt="" />
                        <strong>Xem lại kết quả kiểm tra của bạn sau khi hoàn thành bài kiểm tra, phòng thi</strong>
                    </div>
                </div>
            </div>

            <div className="wrapTrust reveal">
                <h2 className="txtTitle">Đến với website, chúng tôi có thể khiến bạn yên tâm về:</h2>
                <div className="listContentTrust">
                    <div className="contentTrustItem">
                        <img src={"https://icon-library.com/images/objective-icon/objective-icon-2.jpg"} alt="" />
                        <div className="txtTrustItem">
                            <h3>Tính chính xác</h3>
                            <p>Website hoạt động chính xác trong việc đưa tra kết quả của các thao tác đưa đến người dùng</p>
                        </div>
                    </div>
                    <div className="contentTrustItem">
                        <img src={"https://cdn-icons-png.flaticon.com/512/158/158344.png"} alt="" />
                        <div className="txtTrustItem">
                            <h3>Tính Hiệu quả</h3>
                            <p>Thao tác thực hiện nhanh chóng, hiệu quả, hỗ trợ học sinh, sinh viên, giáo viên trong việc dạy và học.</p>
                        </div>
                    </div>
                    <div className="contentTrustItem">
                        <img src={"https://png.pngtree.com/png-vector/20191126/ourmid/pngtree-time-management-icon-png-image_2038482.jpg"} alt="" />
                        <div className="txtTrustItem">
                            <h3>Tính tiện dụng</h3>
                            <p>Giao diện website được thiết kế đơn giản, dễ dàng quan sát, các tính năng đơn giản dễ sử dụng.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Introduce
