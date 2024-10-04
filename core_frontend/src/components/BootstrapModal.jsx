import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import TextAreaWithEditor from "./TextAreaWithEditor";
import {useState} from "react";


function BootstrapModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true)
    };

    const support_handler = e => {
        if (props.admin_delete_handler){
            props.admin_delete_handler(e)
        }else{
            props.handler(e)
        }
        handleClose()
    }
    let button = <></>
    let admin_delete_button = <></>

    if (props.is_first){
        button = <Button variant="primary" onClick={handleShow}>Create first!</Button>
    } else if (props.is_first === false){
        button = <div onClick={handleShow}>Create Blog</div>
    }else if (props.admin_interface){
        button = <div onClick={handleShow}>{props.modal_name}</div>
        admin_delete_button = <Button variant="danger" onClick={support_handler}>
                        Delete
                    </Button>
    }else{
        button = <Button variant="primary" onClick={handleShow}>{props.modal_name}</Button>
    }

    if (props.delete_modal){
        return (
            <>
                <Button variant="danger" onClick={handleShow}>{props.modal_name}</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this blog ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={support_handler}>
                        Confirm Delete
                    </Button><Button variant="secondary" onClick={handleClose}>
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
            </>
        )
    }
    return (
        <>
            {button}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={support_handler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control defaultValue={props.blog.title} name={'title'} placeholder="Title"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <TextAreaWithEditor content={props.blog.body}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Switch
                                id="is_draft"
                                label="Is your post a draft?"
                                name={'is_draft'}
                                defaultChecked={props.blog.is_draft}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Text error_tag='form_message'></Form.Text>
                        </Form.Group>
                        <Button variant="primary" type={'submit'}>
                            Submit
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    {admin_delete_button}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default BootstrapModal