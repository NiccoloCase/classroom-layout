import * as React from 'react';
import { Link } from 'react-router-dom';

export class LandingPage extends React.Component {
    public render() {
        return (
            <div>
                <button><Link to="/qw7qw97897">Vai alla classe</Link></button>
                <button><Link to="/new">Configura una nuova classe</Link></button>
            </div>
        );
    }
}
