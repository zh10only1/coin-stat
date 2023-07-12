import styles from './Error.module.css'
import { NavLink } from 'react-router-dom';
import Button from '../../components/Button/Button';

function Error() {
    return (
        <div className={styles.error}>
            <h1> Oops! </h1>
            <h4> 404 - PAGE NOT FOUND </h4>
            <div>
                <p> The page you are looking for might have been removed <br/> or had its name changed or is temporarily unavailable</p>
            </div>
            <NavLink className={styles.background} to='/'> <Button text="Go to Homepage" /> </NavLink>
        </div>
    )
}


export default Error;