import React, { useContext, useState } from 'react';
import { Row, ListGroup, ListGroupItem, Spinner, ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, Button, Col } from 'reactstrap';
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
        <div>
            <h3 className="d-inline">{device.name}</h3>
            <span className="px-3">
                {device.port}
            </span>
            {loading && <Spinner />}
            <Button color='info'>Refresh</Button>
        </div>
    );
}