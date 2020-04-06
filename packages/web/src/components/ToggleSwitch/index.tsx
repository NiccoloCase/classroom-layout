import * as React from "react";
import * as styles from "./toggleSwitch.module.scss"

export const ToggleSwitch: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => {
    return (
        <label className={styles.toggleSwitch}>
            <input type="checkbox" id="toggle"
                className={styles.checkbox} {...props} />
            <label htmlFor="toogle" className={styles.slider} />
        </label>
    );
} 