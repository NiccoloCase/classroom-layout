import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

export const LandingPage: React.FC<RouteComponentProps> = props => {

    // cotrolla se è stato salvata una classe
    const lastClassId = localStorage.getItem("last-classroom-id");
    if (lastClassId) props.history.push(`/${lastClassId}`);

    return (
        <div>
            <h1>CIAO!</h1>
            <button><Link to="/0UEA5Nj4l">Vai alla classe</Link></button>
            <button><Link to="/new">Configura una nuova classe</Link></button>
        </div>
    );
}
