import React, { useContext, useState } from 'react';
import { Row, ListGroup, ListGroupItem, Badge, Spinner, ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, Button, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import api from '../../api';
import { Context } from '../../Context';
import Device from './device.component';

export default function Station(props) {

    const auth = useContext(Context);
    const isNew = props.station.new;

    let defaultStation = { name: "", status: "new" }

    if (!isNew)
        defaultStation = props.station

    const [station, setStation] = useState(defaultStation)
    const [updatedStation, setUpdatedStation] = useState(defaultStation)

    const devices = station.devices || [];
    const [newDevice, setNewDevice] = useState({ name: "", port: "", commands: [] })
    const [ports, setPorts] = useState([])

    const [dropdown, setDropdown] = useState(false)
    const [popup, setPopup] = useState(isNew)

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
        setNewDevice({ ...newDevice, port: res.data[0] || "" })
        setPorts(res.data);
        setLoading(false);
    }

    const addDevice = async () => {
        setLoading(true);
        let res = await api.post(`/devices/add/${station._id}`, newDevice, auth.user.token);
        setStation({ ...station, devices: res.data });
        setAddingDevice(false)
        setLoading(false);
    }

    let isOnline = station.status === 'online'
    let status = station.status.charAt(0).toUpperCase() + station.status.slice(1)

    return [!isNew && (
        <fieldset className="col-md-9 col-lg-7 col-xl-5">
            <legend>
                {/* <i>DataStation</i> - */}

                <ButtonDropdown isOpen={dropdown} toggle={() => setDropdown(!dropdown)}>
                    <Button color="secondary" size="lg" outline>
                        {station.name}  <Badge color={isOnline ? 'success' : 'danger'}>{isOnline ? 'Online' : 'Offline'}</Badge>
                    </Button>
                    <DropdownToggle caret color="secondary" className="pr-3" />
                    <DropdownMenu className="row justify-content-center">
                        <Col sm={12} className="d-flex justify-content-center mb-2">
                            {
                                station.name === 'local' &&
                                <Button onClick={isOnline ? stopStation : startStation} color={isOnline ? 'danger' : 'success'} className="w-75">
                                    {loading ? <Spinner size="sm mx-3" /> : (isOnline ? "Stop" : "Start")}
                                </Button>
                            }
                        </Col>
                        <Col sm={12} className="d-flex justify-content-center">
                            <Button disabled={loading} onClick={setPopup} color="info" className="w-75">
                                Settings
                            </Button>
                        </Col>
                    </DropdownMenu>
                </ButtonDropdown>


            </legend>
            <ListGroup className="p-3">
                {
                    devices.map((device) => (
                        <ListGroupItem> <Device station={station._id} device={device} /> </ListGroupItem>
                    ))
                }
            </ListGroup>
            <Button className="d-block w-75 mx-auto my-3" color='success' onClick={() => setAddingDevice(true)}> Add device </Button>



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
        ),
        <Modal isOpen={popup} toggle={() => setPopup(false)}>
            <ModalHeader toggle={() => setPopup(false)}>
                Station connection
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup row>
                        <Label for="name" sm={4}>Station Name</Label>
                        <Col sm={6}>
                            <Input type="text" placeholder="station #1" defaultValue={updatedStation.name} onChange={({ currentTarget }) => setUpdatedStation({ ...updatedStation, name: currentTarget.value })} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="name" sm={4}>Available connections</Label>
                        <Col sm={6}>
                            {/* <Input type="select" onChange={({ currentTarget }) => setNewDevice({ ...newDevice, port: currentTarget.value })}>
                    {ports.map((port, key) => <option key={key} value={port.path}> {port.path} </option>)}
                </Input> */}
                        </Col>
                        <Col sm={2} className="p-1 pr-3">
                            <Button size="sm" color="info" onClick={portsRefresh} disabled={loading}>
                                Refresh
                </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="success" className="px-4 mx-2" onClick={addDevice} disabled={loading}> Save </Button>
                <Button color="secondary" onClick={() => setPopup(false)} disabled={loading}>Cancel</Button>
            </ModalFooter>
        </Modal>
    ];
}