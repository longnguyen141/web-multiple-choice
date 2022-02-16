import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function LoadPage() {
    const { pathname } = useLocation();

    useEffect(() => {
        // if()
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [pathname])
    return (
        null
    )
}


export default LoadPage

