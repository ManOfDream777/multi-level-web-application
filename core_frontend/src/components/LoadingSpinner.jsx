import Spinner from 'react-bootstrap/Spinner';
import styles from "../assets/css/modules/homepage.module.css"
import {useEffect, useState} from "react";

function LoadingSpinner({text}) {
    const [showTextLabel, setShowTextLabel] = useState(false)
    const [textToShow, setTextToShow] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTextLabel(true)
            if (text !== undefined) {
                setTextToShow(text)
            }else{
                setTextToShow('Loading...')
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [text]);

    return (
        <div className={styles.loading}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">{textToShow}</span>
            </Spinner>
            {showTextLabel && <p>{textToShow}</p>}
        </div>
    );
}

export default LoadingSpinner;