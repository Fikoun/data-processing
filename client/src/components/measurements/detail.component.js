import React, { useState, useEffect, useContext } from 'react';
import Chart from "react-google-charts";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import Alerts from '../alerts.component';

import api from '../../api';
import { Context } from '../../Context';
import { set } from 'mongoose';

export default function Measurement(props) {

    const auth = useContext(Context);

    const [measurement, setMeasurement] = useState({ data: [] });

    const [running, setRunning] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [editing, setEditing] = useState(false);

    const [error, setError] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');

    const [loading, setLoading] = useState(false);
   
    useEffect(() => {
        (async () => {
            if (!await auth.isLogged())
                window.location = "/login";

            let response = await api.get(`measurements/${props.match.params.id}`, auth.user.token);
            let {name, description, duration} = response.data;
            setName(name);
            setDescription(description);
            setDuration(duration);
            setMeasurement(response.data);
        })();
    }, [])

    const measurementEdit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        
        if(!await auth.isLogged())
                window.location = "/login";

        const update = { name, description, duration };
        setMeasurement(update);
        try {
            await api.post(`measurements/update/${measurement._id}`, update, auth.user.token);
            setLoading(false);
            setEditing(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    const measurementRemove = async () => {
        if (!removing) {
            setTimeout(() => setRemoving(false), 1000);
            return setRemoving(true);
        }

        try {
            await api.get(`measurements/delete/${props.match.params.id}`, auth.user.token);
            props.history.push(`/measurements`)
        } catch (error) {
            setError(error);
        }
    }

    const measurementRefresh = async () => {
        try {
            let response = await api.get(`measurements/${props.match.params.id}`, auth.user.token);
            setMeasurement(response.data);
        } catch (error) {
            setError(error);
        }
    }


    const measurementStart = async () => {
        if (running)
            return;

        setRunning(true);

        try {
            const refresh = setInterval(() => measurementRefresh(), 1000);

            await api.get(`measurements/run/${props.match.params.id}`, auth.user.token);

            clearInterval(refresh)
            measurementRefresh()
            setRunning(false)
        } catch (error) {
            setError(error);
            setRunning(false)
        }
    }

    let data = [];
    if (measurement.data && measurement.data.length > 0) {
        for (let i = 0; i < measurement.data.length; i += 2) {
            if (i + 2 > measurement.data.length)
                break;
            let values = [i, measurement.data[i].value, measurement.data[i + 1].value].map(Math.round);
            data.push(values);
        }
    } else {
        data = [[0, 0, 0]];
    }

    console.log(data);
    

    return (
        <Container>
            {error && <Alerts error={error} />}

            <Row className="py-4">
                <Col md="6">
                    <h3> Measurement ~ <i> {measurement.name} </i> </h3>
                </Col>

                <Col md="6" className="text-right py-3">
                    <Button color={running ? "warning" : "success"} disabled={running} className="px-4 mr-2" onClick={() => measurementStart()}>
                        {running ? (<> Running <Spinner size="sm" color="ligth" /> </>)
                            : "Start Measurement"}
                    </Button>
                    <Button color="info" disabled={editing} className="px-4 mx-2" onClick={() => setEditing(true)}>
                        Edit
                    </Button>
                    <Button color={removing ? "danger" : "warning"} disabled={running} className="px-4" onClick={() => measurementRemove()}>
                        {removing ? "Confirm?" : "Remove"}
                    </Button>
                </Col>
            </Row>

            <Row className="mt-5 pt-3">
                <Col>
                    <Chart
                        width="100%"
                        height="500px"
                        chartType="Line"
                        loader={<strong>Loading data</strong>}
                        data={[
                            ['Time', 'Temperature', 'Layer'],
                            ...data
                        ]}
                        options={{
                            hAxis: {
                                title: 'Time (seconds)',
                            },
                            series: {
                                0: { axis: 'Temperature' },
                                1: { axis: 'Layer' },
                            },
                            axes: {
                                y: {
                                    Temperature: { label: 'Tempreture (Kelvin)' },
                                    Layer: { label: 'Thickness' },
                                },
                            },
                        }}
                    />
                </Col>
            </Row>

            <Modal isOpen={editing} toggle={() => setEditing(false)}>
                <ModalHeader toggle={() => setEditing(false)}>
                    Edit measurement
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="name" sm={4}>Name</Label>
                            <Col sm={6}>
                                <Input type="text" placeholder="Name" value={name} onChange={({ currentTarget }) => setName(currentTarget.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="description" sm={4}>Description</Label>
                            <Col sm={6}>
                                <Input type="textarea" value={description} onChange={({ currentTarget }) => setDescription(currentTarget.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="duration" sm={4}>Duration</Label>
                            <Col sm={4}>
                                <Input type="number" placeholder="0" value={duration} onChange={({ currentTarget }) => setDuration(currentTarget.value)} />
                            </Col>
                        </FormGroup>
                        
                        <FormGroup check row>
                            <Col sm={12} className="text-center">
                               
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" className="px-4 mx-2" disabled={loading} onClick={measurementEdit} >
                        {loading ? <Spinner size="sm" color="light" /> : "Save"}
                    </Button>
                    <Button color="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </Container>
    );

}