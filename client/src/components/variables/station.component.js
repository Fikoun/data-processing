import React, { useContext, useState } from 'react';
import { Row, ListGroup, ListGroupItem, Spinner, ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, Button, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import api from '../../api';
import { Context } from '../../Context';
import Device from './device.component';

export default function Station(props) {

    const auth = useContext(Context);

    const [station, setStation] = useState(props.station)
    const devices = station.devices || [];
    const [newDevice, setNewDevice] = useState({name:"", port:"", commands:[]})
    const [ports, setPorts] = useState([])

    const [loading, setLoading] = useState(false)
    const [addingDevice, setAddingDevice] = useState(false)


    // useEffect(() => {
    //     setLoading(true);
    //     (async () => {
    //         if (!await auth.isLogged())
    //             window.location = "/login";

    //         let res = await api.get("/stations", auth.user.token);
    //         setStation(res.data);
    //         setLoading(false);
    //     })();

    // }, [])

    //  STATION ACTIONS
    const statusRefresh = async () => {
        setLoading(true);
        let res = await api.get("/stations/status/" + station._id, auth.user.token);
        setStation(res.data);
        setLoading(false);
    }

    const startStation = async () => {
        setLoading(true);
        await api.get("/stations/start/" + station._id, auth.user.token);
        setTimeout(() => {
            statusRefresh()
        }, 2000);
    }
    const stopStation = async () => {
        setLoading(true);
        await api.get("/stations/stop/" + station._id, auth.user.token);
        setTimeout(() => {
            statusRefresh()
        }, 2000);
    }


    // DEVICE ACTIONS
    const portsRefresh = async () => {
        setLoading(true);
        let res = await api.get(`/stations/ports/${station._id}`, auth.user.token);
        console.log(res.data);
        setNewDevice({...newDevice, port: res.data[0] || ""})
        setPorts(res.data);
        setLoading(false);
    }

    const addDevice = async () => {
        setLoading(true);
        let res = await api.post(`/devices/add/${station._id}`, newDevice, auth.user.token);
        setStation({...station, devices: res.data});
        setAddingDevice(false)
        setLoading(false);
    }

    let isOnline = station.status === 'online'
    let status = station.status.charAt(0).toUpperCase() + station.status.slice(1)

    return (
        <fieldset className="col-11">
            <legend>
                <i>DataStation</i> - {station.name}
                <Button disabled={loading} onClick={statusRefresh} color={isOnline ? 'success' : 'danger'} className="ml-3">
                    {loading ? <Spinner size="sm mx-3" /> : status}
                </Button>
                {
                    station.name === 'local' &&
                    <Button onClick={isOnline ? stopStation : startStation} color={isOnline ? 'danger' : 'success'} size="sm" className="ml-2">
                        {loading ? <Spinner size="sm mx-3" /> : (isOnline ? "Stop" : "Start")}
                    </Button>
                }
            </legend>
            <ListGroup>
                {
                    devices.map((device) => (
                        <ListGroupItem> <Device station={station._id} device={device} /> </ListGroupItem>
                    ))
                }
            </ListGroup>
            <Button color='info' onClick={() => setAddingDevice(true)} className="mt-3"> Add device </Button>

            <Modal isOpen={addingDevice} toggle={() => setAddingDevice(false)}>
                <ModalHeader toggle={() => setAddingDevice(false)}>
                    New device connection
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="name" sm={4}>Device Name</Label>
                            <Col sm={6}>
                                <Input type="text" placeholder="thermocouple" defaultValue={newDevice.name} onChange={({ currentTarget }) => setNewDevice({ ...newDevice, name: currentTarget.value })} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="name" sm={4}>Available ports</Label>
                            <Col sm={6}>
                                <Input type="select" onChange={({ currentTarget }) => setNewDevice({ ...newDevice, port: currentTarget.value })}>
                                    {ports.map((port, key) => <option key={key} value={port.path}> {port.path} </option>)}
                                </Input>
                            </Col>
                            <Col sm={2} className="p-1 pr-3">
                                <Button size="sm" color="info" onClick={portsRefresh} disabled={loading}>
                                    Refresh
                                </Button>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="command" sm={4}>Data Command</Label>
                            <Col sm={6}>
                                <Input type="text" placeholder="get" defaultValue={newDevice.command} onChange={({ currentTarget }) => setNewDevice({ ...newDevice, command: currentTarget.value })} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="command" sm={3}>Station</Label>
                            <Col sm={8}>
                                <Input disabled type="text" value={station._id} />
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" className="px-4 mx-2" onClick={addDevice} disabled={loading}> Save </Button>
                    <Button color="secondary" onClick={() => setAddingDevice(false)} disabled={loading}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </fieldset>
    );
}