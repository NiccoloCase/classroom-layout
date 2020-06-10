import React, { useContext, useEffect } from "react";
import styles from "./ErrorComponent.module.scss";
import { ThemeContext } from '../../context';

export const UnauthorizedComponent: React.FC = () => {
    // context
    const ctx = useContext(ThemeContext);
    useEffect(() => {
        ctx.changeNavBarStyle("light");
        return () => ctx.changeNavBarStyle("default");
    }, []);

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.content}>
                    <h1 className={styles.title}>Ehi, sembra che ti sei perso!</h1>
                    <h3 className={styles.subtitle}>Non sei autorizzato ad accedere questa pagina</h3>
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