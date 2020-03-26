import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";
import * as styles from "./MenuNavigation.module.scss";

const MenuNavigation: React.FC = () => {
  return (
    <div className={styles.container} id="TopMenuNavigation">
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoImage}>
            <img src={require(".././/../assets/images/logo.png")} alt="LOGO" />
          </div>
          <h4 className={styles.logo}>Classroom layout</h4>
        </div>
        <nav className={styles.headerNav}>
          <ul className={styles.navLinks}>
            <li>
              <NavLink to="/home" className={styles.navLink} activeClassName={styles.active}>
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/new" className={styles.navLink} activeClassName={styles.active}>
                <span>Registra classe</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/info" className={styles.navLink} activeClassName={styles.active} >
                <span>Informazioni</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className={styles.navLink} activeClassName={styles.active}>
                <span>FAQ</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default withRouter(MenuNavigation);