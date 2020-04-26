import * as React from "react";
import classnames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Intervallo di tempo che deve passare da un click all'altro */
    interval: number;
}

/**
 * Pulsante che può essere premuto solo se è passato l'intervallo di tempo dal click precedente
 * @param props 
 */
export const IntermittentButton: React.FC<ButtonProps> = props => {
    const [clickable, setClickable] = React.useState(true);

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!props.onClick || !clickable) return;
        props.onClick(e);
        setClickable(false);
        setTimeout(() => setClickable(true), props.interval);
    }

    return (
        <button {...props} onClick={onClick}
            className={classnames(props.className, { temporarilyDisabled: !clickable })} />
    );
}