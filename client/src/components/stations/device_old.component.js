import React, { useContext, useState } from 'react';
import { Row, ListGroup, Spinner, ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, Button, Col, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import api from '../../api';
import { Context } from '../../Context';

export default function Device(props) {

    const auth = useContext(Context);

    const [device, setDevice] = useState(props.device)
    const [loading, setLoading] = useState(false)
    const [edditing, setEdditing] = useState(false)
    const isNew = props.station.new;

    const statusRefresh = async () => {
        setLoading(true);
        let res = await api.get("/devices/station/" + props.station, auth.user.token);
        setDevice(res.data);
        setLoading(false);
    }

    const saveDevice = async () => {
        // todo
    }
    const removeDevice = async () => {
        let res = await api.get("/devices/remove/" + props.station + "/" + device._id, auth.user.token);
        setEdditing(false);
        window.location.reload()
    }


    return (<>
        <div className="d-flex">
            <Col grow={1}>
                <h4 className="d-inline">
                    {device.name}
                </h4> <br />
                <Badge> {device.port} </Badge>
            </Col>
            <Col className="d-flex justify-content-end align-items-center" sm={1}>
                {loading && <Spinner />}
                <Button color='info' onClick={() => setEdditing(true)}>Settings</Button>
            </Col>
        </div>

        <Modal isOpen={edditing} toggle={() => setEdditing(false)}>
            <ModalHeader toggle={() => setEdditing(false)}>
                Edditing {device.name}
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup row>
                        <Label for="name" sm={4}>Device Name</Label>
                        <Col sm={6}>
                            <Input type="text" placeholder="thermocouple" defaultValue={device.name} onChange={({ currentTarget }) => setDevice({ ...device, name: currentTarget.value })} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="name" sm={4}>Port</Label>
                        <Col sm={6}>
                            {device.port}
                        </Col>

                    </FormGroup>
                    <FormGroup row>
                        <Label for="command" sm={4}>Data Command</Label>
                        <Col sm={6}>
                            <Input type="text" placeholder="get" defaultValue={device.command} onChange={({ currentTarget }) => setDevice({ ...device, command: currentTarget.value })} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="command" sm={3}>Station</Label>
                        <Col sm={8}>
                            <Input disabled type="text" />
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" className="px-3 mx-2" onClick={removeDevice} disabled={loading}> Delete </Button>
                <Button color="success" className="px-4 mx-2" onClick={saveDevice} disabled={loading}> Save </Button>
                <Button color="secondary" onClick={() => setEdditing(false)} disabled={loading}>Cancel</Button>
            </ModalFooter>
        </Modal>
    </>);
}