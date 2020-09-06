import React, { useContext, useState } from 'react';
import { Row, ListGroup, Spinner, ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, Button, Col, Badge } from 'reactstrap';
import api from '../../api';
import { Context } from '../../Context';

export default function Device(props) {

    const auth = useContext(Context);

    const [device, setDevice] = useState(props.device)
    const [loading, setLoading] = useState(false)

    const statusRefresh = async () => {
        setLoading(true);
        let res = await api.get("/devices/station/" + props.station, auth.user.token);
        setDevice(res.data);
        setLoading(false);
    }


    return (
        <div className="d-flex">
            <Col grow={1}>
                <h4 className="d-inline">
                    {device.name}
                </h4> <br/>
                <Badge> {device.port} </Badge>
            </Col>
            <Col className="d-flex justify-content-end align-items-center" sm={1}>
                {loading && <Spinner />}
                <Button color='info'>Settings</Button>
            </Col>
        </div>
    );
}