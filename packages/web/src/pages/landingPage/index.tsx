import * as React from 'react';
import { Link } from 'react-router-dom';

export class LandingPage extends React.Component {
    public render() {
        return (
            <div>
                <button><Link to="/0UEA5Nj4l">Vai alla classe</Link></button>
                <button><Link to="/new">Configura una nuova classe</Link></button>
            </div>
        );
    }
}
