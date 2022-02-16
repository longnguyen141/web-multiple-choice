import React from 'react'
import { Container } from 'reactstrap'
import Footer from '../../Components/Footer'
import Header from '../../Components/Header'
import Introduce from './Introduce'
import Review from './Review'

const Home = () => {
    return (
        <div>
            <Header />
            <Container>
                <Introduce />
                {/* <Review /> */}
            </Container>
            <Footer />
        </div>
    )
}

export default Home
