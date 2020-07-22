import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner} from 'reactstrap';
import api from '../../api';
import { Context } from '../../Context';
import Station from './station.component';

export default function VariablesList(props) {

    const auth = useContext(Context);

    const [stationsState, setStations] = useState([])
    const [loading, setLoading] = useState(false)

    let stations = stationsState.filter((station) => station.name !== "local")
    let localStation = stationsState.find((station) => station.name === "local")


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

    return (
        <Container>
            <Row className="pt-4">
                <Col md="7">
                    <h1> Variables </h1>
                </Col>

                <Col md="5" className="text-right">
                    <Button color="success" className="px-4 py-2 ml-auto">
                        + Add DataStation
                    </Button>
                </Col>
            </Row>

            <Row className="pt-4 justify-content-center">
                {
                   localStation ? <Station station={localStation} /> : (
                        <fieldset className="col-11">
                            <legend>
                                <i>DataStation</i> - local
                                <Button disabled={loading} onClick={setupLocalStation} color="info" className="ml-3">
                                    {loading ? <Spinner size="sm mx-3" /> : "Setup local DataStation"}
                                </Button>
                            </legend>
                        </fieldset>
                   )
                }

                { 
                    stations.map((station, key) => <Station key={key} station={station} />)
                }
            </Row>

        </Container>
    );

}