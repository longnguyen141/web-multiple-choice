import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import avatar1 from '../../Assets/images/ps2.jpeg';


const Review = () => {
    const renderSlides = () =>
        [1, 2, 3, 4, 5, 6, 7, 8].map((num, index) => (
            <div key={index} className="containerCarouselItem">
                <div className="wrapCarouselItem">
                    <img src={avatar1} alt="img" />
                    <p className="txtReviewItem">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed earum veniam, asperiores ducimus accusamus deserunt autem veritatis sequi sint ad maxime rerum porro dolorem quia iste nam officiis aut repudiandae, voluptatibus, nobis nihil. Ab nulla ratione dignissimos quibusdam cum quam suscipit harum explicabo pariatur id. Odit voluptatem modi eligendi pariatur.</p>
                </div>
            </div>
        ));

    const setting = {
        dots: true,
        lazyLoad: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 3,
        autoplay: true,
        autoplaySpeed: 3000,
    }
    return (
        <div className="wrapReviewCarousel">
            <center>
                <h2>Feedback</h2>
            </center>
            <Slider
                {...setting}
            >
                {renderSlides()}
            </Slider>
        </div>
    );
}

export default Review
