import React from 'react';
import { FormGroup, Label, Col, Input, Badge, Spinner, Button, Card, ListGroup, ListGroupItem } from 'reactstrap';
import Form from './form.component';
import api from '../../api';

class Connection extends Form {
    constructor(props) {
        super(props, {
            name: "",
            port: "",
            baudRate: 9600,
            station: "",
            connections: []
        })
    }

    save = async () => {
        this.setState({ loading: true });

        try {
            let res = await api.post(`/devices/add`, this.state.values);
            this.onSave(this.state.values)
        } catch (error) {
            this.setState({ loading: false, isOpen: false });
            console.log({ error });
        }

        this.setState({ loading: false, isOpen: false });
    }


    adIO = () => {
        this.setState({ loading: true });

        // let res = await api.post(`/devices/add`, this.state.values);
        // this.onSave(this.state.values)

        this.setState({ loading: false, isOpen: false });
    }

    header() {
        return (<>
            <i>{(this.state.isNew ? "New device" : "Edditing")}</i>
            {" ~ " + this.getValue('name')}
        </>)
    }

    body() {
        return (<>
            <FormGroup row>
                <Label for="name" sm={4}>Device Name</Label>
                <Col sm={6}>
                    <Input type="text" placeholder="thermocouple" defaultValue={this.getValue('name')} onChange={this.getSetter('name')} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="baudrate" sm={4}>Baudrate</Label>
                <Col sm={6}>
                    <Input type="number" placeholder="9600" defaultValue={this.getValue('baudRate')} onChange={this.getSetter('baudRate')} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="port" sm={4}>Port</Label>
                <Col sm={6}>
                    <Input type="select" name="ports" defaultValue={this.getValue('port')} onChange={this.getSetter('port')} >
                        {
                            this.getValue('connections').map((d, key) => (
                                <option key={key} value={d._id}>
                                    {d.name}
                                </option>
                            ))
                        }
                    </Input>
                    {/* <Input type="text" placeholder="COM1" defaultValue={this.getValue('port')} onChange={this.getSetter('port')} /> */}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="command" sm={3}>Station</Label>
                <Col sm={8}>
                    <Input disabled type="text" defaultValue={this.getValue('station')} />
                </Col>
            </FormGroup>


            <Card style={{ backgroundColor: 'rgba(0,0,0,.125)', padding: '10px 0', margin: '15px 0' }}>
                <FormGroup row>
                    <Label for="port" sm={2}><strong>I/O</strong></Label>
                    <Col sm={1}>
                        <Button color='success' size="sm" className="mt-1 px-2" onClick={this.addIO}>+</Button>
                        {/* <Badge className="px-1 mt-3" color='success' onClick={this.addIO} pill>+</Badge> */}
                    </Col>
                    <Col sm={6} className="pr-1 position-relative">
                        <Input className="w-80" type="select" name="connections" onChange={() => { }}>
                            {
                                this.getValue('connections').map((d, key) => (
                                    <option key={key} value={d._id}>
                                        {d.name}
                                    </option>
                                ))
                            }
                        </Input>
                    </Col>
                    <Col sm={2}>
                        <Button color='info' onClick={this.addIO}>New</Button>
                    </Col>
                    <ListGroup className="p-3 w-100">
                        {
                            this.getValue('connections').map((conn, key) => (
                                <ListGroupItem className="my-1" key={key}>
                                    {conn.name} <Badge color='success' onClick={this.addIO}>{{ I: "Input", O: "Output" }[conn.type]}</Badge>
                                </ListGroupItem>
                            ))
                        }
                    </ListGroup>
                </FormGroup>
            </Card>
        </>)
    }

    detail() {
        return (
            <div className="d-flex">
                <Col grow={1}>
                    <h4 className="d-inline">
                        {this.getValue('name')}
                    </h4> <br />
                    <Badge> {this.getValue('port')} </Badge>
                </Col>
                <Col className="d-flex justify-content-end align-items-center" sm={1}>
                    {this.getValue('loading') && <Spinner />}
                    <Button color='info' onClick={() => this.setState({ isOpen: true })}>Settings</Button>
                </Col>
            </div>
        )
    }
}

export default Connection;