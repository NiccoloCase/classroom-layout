import React, { useState, useRef, useContext } from "react";
import classnames from "classnames";
import { NavLink, withRouter, Link } from "react-router-dom";
import * as styles from "./MenuNavigation.module.scss";
import { ThemeContext } from '../../context';

const MenuNavigation: React.FC = () => {
  const refNavigation = useRef<HTMLDivElement>(null);
  // se il manu ad humburger è aperto
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // context
  const themeCtx = useContext(ThemeContext)
  // ultimo valore dello scrol
  let prevScrollPos = window.pageYOffset;

  React.useEffect(() => {
    const onScroll = () => {
      if (!refNavigation.current) return;
      const currentScrollPos = window.pageYOffset;

      if (isMenuOpen || prevScrollPos > currentScrollPos || currentScrollPos < 100) {
        refNavigation.current.style.top = "0";
        // imposta quando la barra deve essere trasparente 
        if (currentScrollPos === 0) refNavigation.current.classList.remove(styles.nonTransparent);
        else refNavigation.current.classList.add(styles.nonTransparent);
      }
      else refNavigation.current.style.top = "-51px";

      prevScrollPos = currentScrollPos;
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuOpen]);

  return (
    <div id="top-menu-navigation" ref={refNavigation}
      className={classnames(styles.menuNavigation, { [styles.light]: themeCtx.navBarStyle === "light" })} >
      {/* LOGO */}
      <div className={styles.logoContainer}>
        <div className={styles.logoImage}>
          <img alt="LOGO" src={
            require(`../../assets/images/logo-${themeCtx.navBarStyle === "light" ? "dark" : "light"}.png`)} />
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