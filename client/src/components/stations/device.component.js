import React from 'react';
import { FormGroup, Label, Col, Input, Badge, Spinner, Button, Card, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Form from './form.component';
import api from '../../api';

class Device extends Form {
    constructor(props) {
        let selectedIO = ''
        if (props.default.connections && props.default.connections[0])
            selectedIO = props.default.connections[0]

        super(props, {
            id: "",
            name: "",
            port: "",
            portList: [],
            baudRate: 9600,
            station: "",
            connections: [],

            selectedIO,
            removing: false,
        })
    }

    componentDidMount() {
        api.get(`/devices/ports`).then(res => {
            console.log({ res });
            this.setState({ values: { ...this.state.values, portList: res.data} });
        });
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


    addIO = async () => {
        this.setState({ loading: true });

        // console.log(this.getValue('selectedIO'));
        let res = await api.post(`/devices/connections/add/${this.getValue('_id')}/${this.getValue('selectedIO')}`);
        console.log(res);
        // this.onSave(this.state.values)
        this.setState({ values:{  ...this.state.values, connections: res.data }});
        this.setState({ loading: false });
    }

    removeIO = async (id) => {
        //this.setState({ loading: true });

        // if (this.getValue('removing') === false)
        //     this.setState({values:{removing:id}})
        // else{
        let res = await api.post(`/devices/connections/remove/${this.getValue('_id')}/${id}`, this.state.values);
        // }
        this.setState({ loading: false });
    }

    header() {
        return (<>
            <i>{(this.state.isNew ? "New device" : "Edditing")}</i>
            {" ~ " + this.getValue('name')}
        </>)
    }

    body() {
        let removing = this.get('removing');
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
                            this.getValue('portList').map((d, key) => (
                                <option key={key} value={d._id}>
                                    {d.path}
                                </option>
                            ))
                        }
                    </Input>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="command" sm={3}>Station</Label>
                <Col sm={8}>
                    <Input disabled type="text" defaultValue={this.getValue('station')} />
                </Col>
            </FormGroup>

            <hr />

            <Card className="shadow-sm mt-5" style={{ backgroundColor: 'rgba(0,0,0,.125)', padding: '10px 0', margin: '15px 0', border: 'none' }}>
                <h2 className="w-100 text-center ">
                    <Badge className="px-4 shadow-sm translate-up" color="light">I/O</Badge>
                </h2>

                <FormGroup row className="justify-content-center flex-wrap-reverse">
                    <Col sm={6} className="text-center my-2">
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <Button color='success' className="border-gray px-3" onClick={this.addIO}><strong> + </strong></Button>
                                {/* <Badge className="px-1 mt-3" color='success' onClick={this.addIO} pill>+</Badge> */}
                            </InputGroupAddon>
                            <Input className="w-80" type="text" name="connections" onChange={this.getSetter('selectedIO')} />

                            {/* <Input className="w-80" type="select" name="connections" onChange={this.getSetter('selectedIO')}>
                                {
                                    this.getValue('connections').map((d, key) => (
                                        <option key={key} value={d._id}>
                                            {d.name}
                                        </option>
                                    ))
                                }
                            </Input> */}
                        </InputGroup>
                    </Col>
                    <Col sm={3} className="my-2 px-2">
                        <Button color='info' className="w-100" onClick={this.addIO}>New</Button>
                    </Col>
                </FormGroup>

                <FormGroup row className="justify-content-center flex-wrap-reverse">


                    <Col sm={11}>
                        <ListGroup>
                            {
                                this.getValue('connections').map((conn, key) => (
                                    <ListGroupItem className="my-1" key={key}>
                                        {conn.command} <Badge color='success' onClick={this.addIO}>{{ I: "Input", O: "Output" }[conn.type]}</Badge>
                                        <Button className="float-right" size="sm" color={removing.val == conn._id ? "danger" : "warning"} onClick={() => this.removeIO(conn._id)}>
                                            {removing.val == conn._id ? "Confirm!" : "Remove"}
                                        </Button>
                                    </ListGroupItem>
                                ))
                            }
                        </ListGroup>
                    </Col>
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

export default Device;