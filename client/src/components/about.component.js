import React from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';
import chamberImage from '../imgs/chamber.png';

export default function About(props) {

    const measurementPreview = () => {
        props.history.push('measurement/preview')
    }
    
    return (
        <Container>
            <h1>About</h1>
            <p>
                The MOTeS Data Processing utility is being developed as a part of a project between CEITEC BUT and a talented high-shool student, namely Filip Janko. 
                The aim is to develop a user-friendly online utility to monitor output physical quantities
                such as temperature, evaporation rate, film thickness, and pressure from MOTeS Evaporation Chamber in real-time. 
            </p>
           
            <h1>Application</h1>
            <Row className="justify-content-center align-items-center py-5">
                <Col className="my-3" sm="10" md="8" lg="5">

                    <Card className="text-center">
                        <CardHeader>Sublimation Chamber</CardHeader>
                        <CardBody>
                            <img src={chamberImage} height="200px" alt="Chamber" /> <br/>
                            <Button className="my-3" color="info" onClick={measurementPreview}>Open measurement</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            
    </Container>
    );
    
}