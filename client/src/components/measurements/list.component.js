import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, CardFooter, Button, CardText } from 'reactstrap';

import api from '../../api';
import { Context } from '../../Context';

export default function MeasurementsList(props) {

    const auth = useContext(Context);

    const [measurements, setMeasurements] = useState([]);

    useEffect(() => {
        (async () => {
            if (!await auth.isLogged())
                window.location = "/login";

            let response = await api.get('measurements', auth.user.token);
            setMeasurements(response.data);
        })();
    }, [])

    const measurementDetail = id => { props.history.push(`/measurement/${id}`) }
    const measurementCreate = () => { props.history.push(`/measurements/new`) }

    return (
        <Container>
            <Row className="pt-4">
                <Col md="9">
                    <h1> Measurements </h1>
                </Col>

                <Col md="3" className="text-right">
                    <Button color="success" className="px-4 py-2 ml-auto" onClick={()=>measurementCreate()}>
                        + Create Measurement
                    </Button>
                </Col>
            </Row>


            <Row className="mt-5 pt-3">
                {
                    measurements.map((measurement, key) => {
                        return (
                            <Col sm="10" md="6" lg="4" className="p-3" key={key}>

                                <Card className="text-center">
                                    <CardHeader>{measurement.name}</CardHeader>
                                    <CardBody>
                                        <CardText>{measurement.description}</CardText>
                                        <Button className="mt-3" color="info" onClick={()=>measurementDetail(measurement._id)}>Open measurement</Button>
                                    </CardBody>
                                    <CardFooter className="text-right">Duration {measurement.duration} s</CardFooter>
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>

        </Container>
    );

}