import React from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button, CardText } from 'reactstrap';
import chamberImage from '../imgs/chamber.png';

export default function About(props) {

    const measurementPreview = () => {
        props.history.push('/demo')
    }
    
    return (
        <Container>
            <h1 className="mt-4">About</h1>
            <p>
                The MOTeS Data Processing utility is being developed as a part of a project between CEITEC BUT and a talented high-shool student, namely Filip Janko. 
                The aim is to develop a user-friendly online utility to monitor output physical quantities
                such as temperature, evaporation rate, film thickness, and pressure from MOTeS Evaporation Chamber in real-time. 
            </p>

            <h2 className="mt-4">Contact us</h2>

            Developer <strong>Filip Janko</strong> <br/>
            E-mail: <strong>fikoun@icloud.com</strong> <br/>
            Phone: <strong>+420 728 975 192</strong><br/>
            <br/>
            Supervisor <strong>Jakub Hrubý</strong> <br/>
            E-mail: <strong>jakub.hruby@ceitec.vutbr.cz</strong> <br/>
            Phone: <strong>+420 608 072 211</strong>

            <h2 className="mt-5x">Team</h2>
            <Row className="justify-content-center align-items-center">
                <Col className="my-3">
                    <Card className="mx-auto" style={{width: '300px'}}>
                        <img src="http://spectroscopy.ceitec.cz/files/273/129.jpg" class="card-img-top" alt="..." width="200px"/>
                        <CardBody>
                            <h3>Jakub Hrubý</h3>
                            <CardText>Researcher and project leader, Ph.D. Student</CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col className="my-3">
                    <Card className="mx-auto" style={{width: '300px'}}>
                        <img src="http://spectroscopy.ceitec.cz/files/273/192.jpg" class="card-img-top" alt="..." width="200px"/>
                        <CardBody>
                            <h3>Filip Janko</h3>
                            <CardText>Developer, High School Student</CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
           
            {/*
            <h1 className="mt-4">Measurement demo</h1>
            <Row className="justify-content-center align-items-center py-5">
                <Col sm="10" md="8" lg="5">

                    <Card className="text-center">
                        <CardHeader>Sublimation Chamber</CardHeader>
                        <CardBody>
                            <img src={chamberImage} height="200px" alt="Chamber" /> <br/>
                            <Button className="my-2" color="info" onClick={measurementPreview}>Open measurement</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            */}

            
    </Container>
    );
    
}