import React from 'react';
import { UncontrolledAlert as Alert } from 'reactstrap';

export default function Alerts(props) {

    let alerts = props.alerts ?? [];

    if (alert.alerts)
        alerts = alert.alerts;

    if (!Array.isArray(alerts))
        alerts = [['primary', alerts.toString()]];

    if (props.error) {
        console.log([props.error]);
        
        let errors = props.error.response ?? props.error;
        errors = errors.errors ?? errors;
        errors = errors.data ?? errors;
        errors = errors.message ?? [errors.toString()];

        if (!Array.isArray(errors))
            errors = [errors.toString()];

        errors.forEach(error => alerts.push(['danger', error]));
    }

    return (
        <div>
            {
                alerts.map( ([type, message], key) => {
                    return  <Alert key={key} className="my-3 mx-5" color={type}>
                                {message.toString()}
                            </Alert>
                })
            }
        </div>
    );
}
