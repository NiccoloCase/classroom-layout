import React, { useState, useRef } from "react";
import classnames from "classnames";
import { NavLink, withRouter, Link } from "react-router-dom";
import * as styles from "./MenuNavigation.module.scss";

const MenuNavigation: React.FC = () => {
  // se il manu ad humburger è aperto
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // menu
  const refNavigation = useRef<HTMLDivElement>(null);
  // ultimo valore dello scrol
  //  const prevScrollPos = useRef<number>(window.pageYOffset);

  let prevScrollPos = window.pageYOffset;

  React.useEffect(() => {
    const onScroll = () => {
      if (!refNavigation.current) return;

      const currentScrollPos = window.pageYOffset;
      refNavigation.current.style.top = (prevScrollPos > currentScrollPos || currentScrollPos < 100) ?
        "0" : "-51px";

      prevScrollPos = currentScrollPos;
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div id="top-menu-navigation" className={styles.menuNavigation} ref={refNavigation}>
      {/* LOGO */}
      <div className={styles.logoContainer}>
        <div className={styles.logoImage}>
          <img src={require("../../assets/images/logo.png")} alt="LOGO" />
        </div>
        <Link to="/" className={styles.logo}>Classroom layout</Link>
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