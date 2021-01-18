import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner, Jumbotron } from 'reactstrap';
import api from '../../api';
import { Context } from '../../Context';
import Station from './station.component';

export default function StationsList(props) {

    const auth = useContext(Context);

    const [stationsState, setStations] = useState([])
    const [loading, setLoading] = useState(false)

    let stations = stationsState.filter((station) => station.name !== "local")
    let localStation = stationsState.find((station) => station.name === "local")
    console.log(localStation);

    useEffect(() => {
        setLoading(true);
        (async () => {
            if (!await auth.isLogged())
                window.location = "/login";

            let res = await api.get("/stations", auth.user.token);
            setStations(res.data);
            setLoading(false);
        })();
    }, [])

    const setupLocalStation = async () => {
        setLoading(true);
        await api.get("/stations/setup", auth.user.token);
        window.location.reload();
    }

    const connectStation = () => {
        setStations([localStation, ...stations, { new: true }])
    }

    return (<>
        <Row>
            <Col md="7" className="my-2">
                <h1> Data stations </h1>
            </Col>

            <Col md="5" className="text-center my-3">
                <Button color="info" className="w-100 py-2" row onClick={connectStation}>
                    <span>{' > '}</span>Connect Station
                </Button>
            </Col>
        </Row>

        <hr/>

        <Row className="mx-0 pt-2 justify-content-around">
            {/* LOCAL Station */}
            {
                localStation ? <Station station={localStation} /> : (
                    <fieldset className="col-11">
                        <legend>
                            <i>DataStation - local </i>
                            <Button disabled={loading} onClick={setupLocalStation} color="info" className="ml-3">
                                {loading ? <Spinner size="sm mx-3" /> : "Setup local DataStation"}
                            </Button>
                        </legend>
                    </fieldset>
                )
            }

            {/* Other Stations */}
            {
                //stations.map((station, key) => (<Station key={key} station={station} />))
            }
        </Row>
    </>);

}