import React, { useState, useContext } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import Alerts from '../alerts.component';

import api from '../../api';
import { Context } from '../../Context';

export default function UserLogin(props) {

    const auth = useContext(Context);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (e) => {
        e && e.preventDefault();

        setLoading(true);

        const user = { email, password };

        try {
            const response = await api.post("users/login", user);
            // console.log(response);
            auth.set(response.data)
            window.location = "/measurements";
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col className="my-3" sm="12" lg="10">
                    <Card onKeyPress={event => ((event.key === "Enter") ? login() : void (0))}>
                        <CardHeader> <h4 className="my-0">Login</h4> </CardHeader>
                        {error && <Alerts error={error} />}

                        <CardBody>
                            <Form>
                                <FormGroup row>
                                    <Label for="email" sm={4}>Email</Label>
                                    <Col sm={6}>
                                        <Input type="email" placeholder="Email" onChange={({ currentTarget }) => setEmail(currentTarget.value)} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="password" sm={4}>Password</Label>
                                    <Col sm={6}>
                                        <Input type="password" placeholder="Password" onChange={({ currentTarget }) => setPassword(currentTarget.value)} />
                                    </Col>
                                </FormGroup>


                                <FormGroup check row>
                                    <Col sm={12} className="text-center">
                                        <Button color="primary" className="px-4 py-2 my-2" disabled={loading} onClick={login} >
                                            {loading ? <Spinner size="sm" color="light" /> : "Login"}
                                        </Button>
                                    </Col>
                                    <Col sm={12} className="text-center">
                                        <Button color="link" className="px-4 py-2 my-2" onClick={() => props.history.push("/register")} >
                                            Register
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container >
    );

}