import React, { useContext, useEffect, useState } from 'react';
import { Button, Badge, Card, CardBody, CardFooter, CardHeader, CardText, Col, Container, ListGroup, ListGroupItem, Row, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import api from '../../api';
import { Context } from '../../Context';
import Alerts from '../alerts.component';
import StationsList from '../stations/list.component';

export default function MeasurementsList(props) {

    const auth = useContext(Context);

    const [measurements, setMeasurements] = useState([]);
    const [devices, setDevices] = useState([]);
    const [alerts, setAlerts] = useState([])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            if (!await auth.isLogged())
                window.location = "/login";

            let response = await api.get('measurements', auth.user.token);
            setMeasurements(response.data);
        })();

        (async () => {
            let response = await api.get('devices/variables', auth.user.token);
            setDevices(response.data);
        })();
    }, [])

    const testCommand = async (key) => {
        setLoading(true)
        let newDevices = devices;
        try {
            let response = await api.post('devices/command/'+devices[key]._id, {command: 'get'}, auth.user.token);
            newDevices[key] = response.data;
            setDevices(newDevices);
        } catch (error) {
            console.log(error.response.data);
            setAlerts([...alerts, ['danger', error.response.data]])
        }
        setLoading(false)
    }

    const measurementDetail = id => { props.history.push(`/measurement/${id}`) }
    const measurementCreate = () => { props.history.push(`/measurements/new`) }

    return (
        <Container>
            <Alerts alerts={alerts} />
            
            <StationsList/>
           
            <Row className="pt-5">
                <Col md="7">
                    <h1> Measurements </h1>
                </Col>

                <Col md="5" className="text-right">
                    <Button color="success" className="px-4 py-2 ml-auto" onClick={() => measurementCreate()}>
                        + Create Measurement
                    </Button>
                </Col>
            </Row>

            <Row className="pt-3">
                {
                    measurements.map((measurement, key) => {
                        return (
                            <Col sm="10" md="6" lg="4" className="p-3" key={key}>

                                <Card className="text-center">
                                    <CardHeader>{measurement.name}</CardHeader>
                                    <CardBody>
                                        <CardText>{measurement.description}</CardText>
                                        <Button className="mt-3" color="info" onClick={() => measurementDetail(measurement._id)}>Open measurement</Button>
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