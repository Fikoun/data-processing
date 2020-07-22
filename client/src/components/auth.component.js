import React, { useContext, useEffect } from 'react';
import { Context } from '../Context';
import { Spinner, Container } from 'reactstrap';

export default function Auth(props) {

    const auth = useContext(Context);
    
    // let permission = false;
    // if (auth.user.permission)
    //     permission = auth.user.permission


    useEffect(() => {
        (async () => {
            const res = await auth.isLogged()
            if(res) {
                props.history.go(-1)
            }else {
                window.location = "/login";
            }
            // console.log({auth, res});
        })();
    }, [])
    
    return (
        <Container className="text-center py-5">
           <Spinner className="my-5 theme-color" size="lg"/>
        </Container>
    );
}