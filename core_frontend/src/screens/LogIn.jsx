import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../assets/css/modules/auth.module.css'
import {Link, useNavigate} from "react-router-dom";
import {LoginValidator} from "../services/validators";
import {checkAuthenticated, login} from "../services/auth";
import Swal from "sweetalert2";
import {clear_error_msg, handle_errors} from "../services/utils";
import {useEffect} from "react";

function LogIn() {
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const result = await checkAuthenticated()
            if (result) {
                navigate('/home/', {replace: true})
            }
        }
        fetchData()
    }, []);
    const handleSubmit = e => {
        e.preventDefault();
        clear_error_msg()
        const email = e.target.email.value
        const password = e.target.password.value
        const validator = new LoginValidator(email, password)

        if (validator.is_valid()) {
            const sendRequest = async () => {
                const result = await login(email, password)
                if (result.status === 200){
                    navigate('/home/', {replace: true})
                    return;
                }

                Swal.fire({
                    title: 'Login error',
                    icon: 'error',
                    text: 'Server error occurred. Try again later. Sorry for inconvenience.',
                })
            }

            sendRequest()
            return;
        }
        handle_errors(validator, e)
    }

    return (
        <div className={styles.login}>
            <div className={styles.wrapper}>
                <h2>Login</h2>
                <div className={styles.form_wrapper}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="form_email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" name={'email'} placeholder="Enter email"/>
                            <Form.Text error_tag={'form_email'} className="text-muted">
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="form_password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name={'password'} placeholder="Password"/>
                            <Form.Text error_tag={'form_password'} className="text-muted">
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                    <h5>First time? Please <Link to={'/signup/'}>signup</Link> here.</h5>
                </div>
            </div>
        </div>

    )
}

export default LogIn