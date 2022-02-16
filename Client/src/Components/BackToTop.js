import React, { useState, useEffect } from "react";
import Backtotop from '../Assets/images/backtotop.png';

const BackToTop = () => {
    const [state, setState] = useState(false)
    const handleScroll = (e) => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            setState(true)
        } else {
            setState(false)
        }
    }
    useEffect(() => {
        document.addEventListener("scroll", handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        }
    }, [state])
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    return (
        <div onClick={() => scrollToTop()} id="backTop">
            {state && (
                <div className="scroll-to-top">
                    <div className="btn_scroll">
                        <img className="image__backtotop" src={Backtotop} alt="logo" width="20" height="20" />
                    </div>
                </div>
            )}
        </div>
    );
}
export default React.memo(BackToTop)