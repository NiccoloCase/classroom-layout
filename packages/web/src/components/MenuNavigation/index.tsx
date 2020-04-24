import * as React from "react";
import classnames from "classnames";
import { NavLink, withRouter } from "react-router-dom";
import * as styles from "./MenuNavigation.module.scss";

/* interface MenuNavigationProps {
  light?: boolean
} */

const MenuNavigation: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className={styles.menuNavigation} id="TopMenuNavigation">
      {/* LOGO */}
      <div className={styles.logoContainer}>
        <div className={styles.logoImage}>
          <img src={require("../../assets/images/logo.png")} alt="LOGO" />
        </div>
        <h4 className={styles.logo}>Classroom layout</h4>
      </div>
      <nav className={styles.menuNavigationNav}>
        {/* MENU AD HAMBURGER */}
        <div className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={classnames(styles.line, { [styles.close]: isMenuOpen })} />
        </div>
        {/* LINKS */}
        <ul className={classnames(styles.navLinks, { [styles.open]: isMenuOpen })}>
          <li>
            <NavLink to="/home" className={styles.navLink}
              activeClassName={styles.active} onClick={() => setIsMenuOpen(false)}>
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/new" className={styles.navLink}
              activeClassName={styles.active} onClick={() => setIsMenuOpen(false)}>
              <span>Registra classe</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/info" className={styles.navLink}
              activeClassName={styles.active} onClick={() => setIsMenuOpen(false)}>
              <span>Informazioni</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/faq" className={styles.navLink}
              activeClassName={styles.active} onClick={() => setIsMenuOpen(false)}>
              <span>FAQ</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div >
  );
};

export default withRouter(MenuNavigation);