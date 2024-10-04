import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../assets/css/modules/auth.module.css'
import {SignUpValidator} from "../services/validators";
import {checkAuthenticated, signup} from "../services/auth";
import {Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {clear_error_msg, handle_errors} from "../services/utils";
import {useEffect} from "react";

function SignUp() {
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
        const password2 = e.target.password2.value
        const validator = new SignUpValidator(email, password, password2)

        if (validator.is_valid()) {
            const sendRequest = async () => {
                const result = await signup(email, password, password2)
                if (result.status === 201){
                    navigate('/home/', {replace: true})
                    return;
                }
                console.log(result)
                Swal.fire({
                    title: 'Sign up error',
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
        <div className={styles.signup}>
            <div className={styles.wrapper}>
                <h2>SignUp</h2>
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
                        <Form.Group className="mb-3" controlId="form_password2">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control type="password" name={'password2'} placeholder="Confirm password"
                                          label="Confirm password"/>
                            <Form.Text error_tag={'form_password2'} className="text-muted">
                            </Form.Text>
                            <Form.Text error_tag={'form_message'} className="text-muted">
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            SignUp
                        </Button>
                    </Form>
                    <h5>Do you have an Account? Please <Link to={'/login/'}>login</Link></h5>
                </div>
            </div>
        </div>
    )
}

export default SignUp