import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

export const LandingPage: React.FC<RouteComponentProps> = props => {

    // cotrolla se è stato salvata una classe
    const savedClassId = localStorage.getItem("favorite-classroom-id");
    if (savedClassId) props.history.push(`/${savedClassId}`);

    return (
        <div>
            <h1>CIAO!</h1>
            <button><Link to="/OBOXSL7ID">Vai alla classe</Link></button>
            <button><Link to="/new">Configura una nuova classe</Link></button>
        </div>
    );
}
