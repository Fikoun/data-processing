import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import Alerts from '../alerts.component';

import api from '../../api';
import { Context } from '../../Context';

export default function MeasurementsCreate(props) {

    const auth = useContext(Context);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');

    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState({});

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            let response = await api.get('devices/variables', auth.user.token);
            setDevices(response.data);
            setDevice(response.data[0] || {})
            console.log(response.data);
            
        })();
    }, [])

    const create = async (e) => {
        e.preventDefault();

        if (!await auth.isLogged())
            window.location = "/login";

        setLoading(true);

        const measurement = { name, description, duration, device };
        try {
            await api.post("measurements/add", measurement, auth.user.token);
            props.history.push("/measurements");
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col className="my-3" sm="12" lg="10">
                    <Card>
                        <CardHeader> <h4 className="my-0">New Measurement</h4> </CardHeader>
                        {error && <Alerts error={error} />}

                        <CardBody>
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
                                    <Label for="duration" sm={4}>Frequency (of data collection)</Label>
                                    <Col sm={4}>
                                        <Input type="number" placeholder="per minute" value={duration} onChange={({ currentTarget }) => setDuration(currentTarget.value)} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="device" sm={4}>Device</Label>
                                    <Col sm={6}>
                                        <Input type="select" name="device" onChange={({ currentTarget }) => setDevice(currentTarget.value)}>
                                            {
                                                devices.map((d, key) => (
                                                    <option key={key} value={d._id}>
                                                        {d.name}
                                                    </option>
                                                ))
                                            }
                                        </Input>
                                    </Col>
                                </FormGroup>

                                <FormGroup check row>
                                    <Col sm={12} className="text-center">
                                        <Button color="success" className="px-4 py-2 my-2" disabled={loading} onClick={create} >
                                            {loading ? <Spinner size="sm" color="light" /> : "Create"}
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

}