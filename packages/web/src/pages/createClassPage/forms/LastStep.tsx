import * as React from "react";
import { Link } from "react-router-dom";

export const LastStep: React.FC = () => {

    const id = 8732987392872983872;

    return (
        <div className="CreateClassPage__LastStep">
            <h1 className="subtitle"> Abbiamo finito!</h1>
            <button><Link to={`/${id}`}>Vai alla classe</Link></button>
        </div>
    );
}