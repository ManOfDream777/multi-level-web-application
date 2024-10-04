import styles from "../assets/css/modules/homepage.module.css"
import NavBar from "../components/NavBar";
import Dashboard from "../components/Dashboard";

function Homepage() {
    return (
        <div className={styles.main}>
            <NavBar redirect_to_creation_page={true}/>
            <Dashboard/>
        </div>
    )
}

export default Homepage