import React from 'react';
import { Container, Button, Jumbotron } from 'reactstrap';

export default function About(props) {
    
    return (
        <Container>
            <h2 className="mt-5 text-center"></h2>
            <Jumbotron className="mt-4 text-center">
                <h1 className="display-4">404</h1>
                <h1 className="display-5">Not found</h1>
                <hr className="my-4"/>
                <Button color="success" size="lg" className="theme-button px-4" onClick={()=>props.history.push('/')}>
                    Go Home
                </Button>
            </Jumbotron>
        </Container>
    );
    
}