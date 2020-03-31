import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import Alerts from '../alerts.component';

import api from '../../api';

export default function UserRegister(props) {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const register = async (e) => {
        e.preventDefault();
        
        if (password !== passwordCheck) 
            return setError("Passwords don't match!");

        setLoading(true);

        const user = {
            name: {firstname, lastname},
            email,
            password,
        };

        try {
            await api.post("users/register", user);
            props.history.push("/documentation");
        } catch (error) {
            setError(error);
            setPassword('');
            setPasswordCheck('');
            setLoading(false);
        }
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col className="my-3" sm="12" lg="10">
                    <Card>
                        <CardHeader> <h4 className="my-0">Register</h4> </CardHeader>
                        { error && <Alerts error={error} /> }

                        <CardBody>
                            <Form>
                                <FormGroup row>
                                    <Label for="firstname" sm={4}>Firstname</Label>
                                    <Col sm={6}>
                                        <Input type="text" placeholder="Firstname" value={firstname} onChange={({ currentTarget }) => setFirstname(currentTarget.value)} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="lastname" sm={4}>Lastname</Label>
                                    <Col sm={6}>
                                        <Input type="text" placeholder="Lastname" value={lastname} onChange={({ currentTarget }) => setLastname(currentTarget.value)} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="email" sm={4}>Email</Label>
                                    <Col sm={6}>
                                        <Input type="email" placeholder="Email" value={email} onChange={({ currentTarget }) => setEmail(currentTarget.value)} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="password" sm={4}>Password</Label>
                                    <Col sm={6}>
                                        <Input type="password" placeholder="Password" value={password} onChange={({ currentTarget }) => setPassword(currentTarget.value)} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="password" sm={4}>Password (again)</Label>
                                    <Col sm={6}>
                                        <Input type="password" placeholder="Password (again)" value={passwordCheck} onChange={({ currentTarget }) => setPasswordCheck(currentTarget.value)} />
                                    </Col>
                                </FormGroup>

                                <FormGroup check row>
                                    <Col sm={12} className="text-center">
                                        <Button color="primary" className="px-4 py-2 my-2" disabled={loading} onClick={register} >
                                            {loading ? <Spinner size="sm" color="light" /> : "Register"}
                                        </Button>
                                    </Col>
                                    <Col sm={12} className="text-center">
                                        <Button color="link" className="px-4 py-2 my-2" onClick={()=>props.history.push("/login")} >
                                            Login
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