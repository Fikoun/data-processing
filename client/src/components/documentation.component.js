import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'reactstrap';
import chamberImage from '../imgs/chamber.png';

import api from '../api';
import { Context } from '../Context';

export default function Documentation() {

    const auth = useContext(Context);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            if(!await auth.isLogged())
                window.location = "/login";
                
            let response = await api.get('users', auth.user.token);
            setUsers(response.data);
        }
        fetchUsers();
    }, [])


    return (
        <Container>
            <h1>Documentation</h1>
            
            How to use <br/>
            <img src={chamberImage} height="200px" alt="Chamber" /> 
            <h3>User:</h3>
            <ul>
                <li> Logged is: <strong> { auth.logged ? auth.user.email : 'nobody' }  </strong> </li>
                
                {
                    users.map((user, key) => {
                        return (
                            <li key={key}> 
                                <strong> {user.name.firstname} </strong>
                                    has email
                                <strong> {user.email} </strong>
                            </li>
                        )
                    })
                }
            </ul>
        
        </Container>
    );
    
}