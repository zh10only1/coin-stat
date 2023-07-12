import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Button from "../Button/Button";
import { useSelector } from "react-redux";
import { logout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";

function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.auth);

  const handleLogout = async () => {
    const response = await logout();

    if(response.status === 200) {
      dispatch(resetUser());
    }
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div
          className={`${styles.background} ${styles.logo}`}
          style={{ marginLeft: 20 }}
        >
          <NavLink to="/" className={styles.logoLink}>
            CoinStat
          </NavLink>
        </div>

        <div className={styles.background}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.links}`
                : `${styles.inactive} ${styles.links}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="crypto"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.links}`
                : `${styles.inactive} ${styles.links}`
            }
          >
            Crypto
          </NavLink>
          <NavLink
            to="blogs"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.links}`
                : `${styles.inactive} ${styles.links}`
            }
          >
            Blogs
          </NavLink>
        </div>

        <div className={styles.background} style={{ marginRight: 30 }}>
          {isAuthenticated ? (
            <Button onClick={handleLogout} marginRight={15} backgroundColor="red" text="Logout" />
          ) : (
            <NavLink
              to="login"
              className={styles.background}
              style={{ marginRight: 15 }}
            >
              <Button backgroundColor="#5465FF" text="Login" />
            </NavLink>
          )}
        </div>
      </nav>
      <div></div>
    </>
  );
}

export default Navbar;
