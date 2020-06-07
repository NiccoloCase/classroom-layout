import React, { useContext, useEffect } from "react";
import styles from "./ErrorComponent.module.scss";
import image from "../../assets/images/errors/500.svg"
import { ThemeContext } from '../../context';

export const ServerErrorView: React.FC = () => {
    // context
    const ctx = useContext(ThemeContext);
    useEffect(() => {
        ctx.changeNavBarStyle("light");
        return () => ctx.changeNavBarStyle("default");
    }, []);

    return (
        <div className={styles.container}>
            <div>
                <img src={image} />
                <div className={styles.content}>
                    <h1 className={styles.title}>Si è verificato un errore!</h1>
                    <h4 className={styles.subtitle}>Ti inviatiamo di riprovare più tardi</h4>
                    <a href="/landing" className={styles.cta}>
                        <span>Vai alla home</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10">
                            <path d="M1,5 L11,5" />
                            <polyline points="8 1 12 5 8 9" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}