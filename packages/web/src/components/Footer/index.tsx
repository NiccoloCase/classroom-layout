import * as React from "react";
import styles from "./Footer.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

const FooterComponent: React.FC<RouteComponentProps> = ({ history }) => {
    const [searchValue, setSearchValue] = React.useState<string>("");

    const serachClass = () => {
        history.push(`/${searchValue}`);
        setSearchValue("");
        scrollUp();
    }

    const scrollUp = () =>
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

    return (
        <div className={styles.footer}>
            <div className={styles.main}>
                <div className={styles.logoSection}>
                    <div className={styles.logoWrapper}>
                        <img src={require("../../assets/images/logo-light.png")} alt="LOGO" />
                        <h2>Classroom <br /> Layout </h2>
                    </div>
                </div>
                <div className={styles.searchSection}>
                    <h4 className={styles.sectionTitle}>Vai alla tua classe</h4>
                    <input type="text" className={styles.searchBar}
                        value={searchValue} onChange={e => setSearchValue(e.target.value)}
                        onKeyPress={e => { if (e.key === "Enter") serachClass(); }}
                        placeholder="Inserisci l'ID associato alla classse" />
                    <button className={styles.searchButton} onClick={serachClass}>
                        Vai alla classe
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
                <div className={styles.navigationSection}>
                    <div className={styles.links}>
                        <h4 className={styles.sectionTitle}>Navigazione</h4>
                        <NavLink to="/" className={styles.link} onClick={scrollUp}>Home</NavLink>
                        <NavLink to="/new" className={styles.link} onClick={scrollUp}>Registra classe</NavLink>
                        <NavLink to="/info" className={styles.link} onClick={scrollUp}>Informazioni</NavLink>
                        <NavLink to="/faq" className={styles.link} onClick={scrollUp}>Domande frequenti</NavLink>
                    </div>
                </div>
                <div className={styles.contactsSection}>
                    <div className={styles.contacts}>
                        <h4 className={styles.sectionTitle}>Contatti</h4>
                        <div className={styles.contact}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>esempio@gmail.com</span>
                        </div>
                        <div className={styles.contact}>
                            <FontAwesomeIcon icon={faTwitter} />
                            <span>@esempio</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.minor}>
                <span className={styles.copyright}>
                    {`© ${new Date().getFullYear()} Tutti i diritti sono riservati`}
                </span>
            </div>
        </div>
    );
}

export default withRouter(FooterComponent);