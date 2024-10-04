import styles from '../assets/css/modules/auth.module.css'
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";

function Logout() {
    const navigate = useNavigate()
    const handleClick = e => {
        e.preventDefault();
        localStorage.clear();
        navigate('/login/', {replace: true})
    }

    return (
        <div className={styles.logout}>
            <div className={styles.wrapper}>
                <h2>Logout</h2>
                <Button onClick={handleClick} variant="primary" type="submit">
                    Logout
                </Button>
            </div>
        </div>

    )
}

export default Logout