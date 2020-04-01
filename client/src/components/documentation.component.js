import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'reactstrap';
import chamberImage from '../imgs/chamber.png';

import api from '../api';
import { Context } from '../Context';

export default function Documentation() {

    const auth = useContext(Context);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            if(!await auth.isLogged())
                window.location = "/login";
                
            let response = await api.get('users', auth.user.token);
            setUsers(response.data);
        })();
    }, [])


    return (
        <Container>
            <h1 className="pt-3">Documentation</h1>
            <p>
                This documentation describes the prcess of operating MOTES pressure chamber and <br/>
                manual for controling the web aplication.
            </p>
            <img src={chamberImage} height="500px" alt="Chamber" style={{float:'right'}}/> 
            
            <h3 className="pt-3">How to operate MOTES pressure chamber</h3>
            <ul>
                <li>Turn on the power switch for vacuum under the table.</li>
                <li>Login to computer connected to the experiment.</li>
                <li>Open web application DataPro and login or register with your credetials</li>
            </ul>
            
            <h3 className="pt-3">Manual for DataPro aplication</h3>
            <ul>
                <li>First go to measurements and select 'Create Measurement'</li>
                <li>Name you experiment(measurement) and specify duration</li>
                <li>After creation open newly created measurement</li>
                <li>Click on 'Start Measurement' and wait for new to apper on graph</li>
            </ul>
            <h4>Edditing and Removing</h4>
            <ul>
                <li>For edditing measurement select 'Edit' in measurement detail</li>
                <li>To remove measurement double click Remove in measurement detail</li>
            </ul>
        
        </Container>
    );
    
}