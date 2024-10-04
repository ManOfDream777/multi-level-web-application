import styles from "../assets/css/modules/homepage.module.css"
import {useEffect, useRef, useState} from "react";
import {decrypt_data} from "../services/utils";
import {Link} from "react-router-dom";

function SideBar() {
    const [notifications, setNotifications] = useState([]);
    const overlay = useRef()
    const notification_icon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                   className="bi bi-bell-fill" viewBox="0 0 16 16">
        <path
            d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
    </svg>

    useEffect(() => {
        const webSocket = new WebSocket(`ws://127.0.0.1:8000/notifications/`)

        webSocket.onmessage = function (event) {
            const data = JSON.parse(event.data)
            setNotifications(prevState => {
                const isDuplicate = prevState.some(notification => notification.message === data.message.message);
                if (!isDuplicate) {
                    return [...prevState, data.message];
                }
                return prevState;
            });
        }

        webSocket.onerror = function (error) {
            console.log('WebSocket error:', error);
        }

        webSocket.onclose = function (event) {
            console.log('WebSocket connection closed:', event);
        }

        webSocket.onopen = async function () {
            console.log('WebSocket connection opened');
            const token = await decrypt_data(localStorage.getItem('access_token'))
            webSocket.send(JSON.stringify({token: token}))
        }
    }, []);

    const handleClick = e => {
        overlay.current.classList.add(styles.overlay_show)
        document.body.style.overflow = 'hidden'
    }

    const handleClose = e => {
        overlay.current.classList.remove(styles.overlay_show)
        document.body.style.overflow = 'auto'
    }

    const handleRemoveNotification = e => {
        const index = e.target.getAttribute('notification_index')
        setNotifications(prevState => prevState.splice(index, 1))
    }

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.notification_icon} onClick={handleClick}>{notification_icon}
                    {notifications.length > 0 &&
                        <div className={styles.notification_count}>{notifications.length}</div>}
                </div>
            </div>
            {<div ref={overlay} className={styles.overlay}>
                <div className={styles.close} onClick={handleClose}>X</div>
                {notifications.length > 0 ? notifications.map((notification, index) => (
                    <div className={styles.notification} key={index}>
                        <div notification_index={index} className={styles.remove_notification}
                             onClick={handleRemoveNotification}>X
                        </div>
                        <Link to={notification.url}>
                            {notification.message}
                        </Link>
                    </div>
                )) : <p>No notifications yet</p>}
            </div>
            }
        </>

    )
}

export default SideBar