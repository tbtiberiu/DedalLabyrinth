import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.Navbar}>
      <div>
        <h1>Dedal's Labyrinth</h1>
      </div>
      <div>
        <ul className={styles.NavLinks}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.ActiveNavLink : ''
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? styles.ActiveNavLink : ''
              }
            >
              History
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
