import * as React from "react";
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from "./InfoIconComponent.module.scss";

interface InfoIconProps {
    children: React.ReactNode;
    className?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ children, className }) => {
    return (
        <Popup closeOnDocumentClick position="bottom center" on="hover" className={className}
            trigger={<span><FontAwesomeIcon className={styles.icon} icon={faInfoCircle} /></span>}>
            {() => (
                <div className={styles.popup}>{children}</div>)}
        </Popup>
    );
} 