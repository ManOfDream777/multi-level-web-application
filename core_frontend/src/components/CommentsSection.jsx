import styles from "../assets/css/modules/homepage.module.css"
import Button from "react-bootstrap/Button";
import {Card} from "react-bootstrap";
import {useEffect, useState} from "react";
import {create_comment} from "../services/crud";
import {clear_error_msg, handle_errors} from "../services/utils";
import {CommentValidator} from "../services/validators";
import Form from "react-bootstrap/Form";


function CommentsSection({comments_data, blog_id}) {
    const [noComments, setNoComments] = useState(true)
    const [comments, setComments] = useState(comments_data)

    useEffect(() => {
        if (comments.length > 0) {
            setNoComments(false)
        }
    }, [comments])
    const handleSubmit = e => {
        e.preventDefault()
        clear_error_msg()
        const comment_text = e.target.comment.value
        const validator = new CommentValidator(comment_text)
        if (validator.is_valid()) {
            const sendRequest = async () => {
                const result = await create_comment(blog_id, comment_text)
                if (result.status === 201) {
                    setComments(prev => [result.data, ...prev])
                    e.target.comment.value = ''
                }
            }
            sendRequest()
            return;
        }
        handle_errors(validator, e)
    }

    return (
        <div className={styles.comments}>
            <div className={styles.add_comment}>
                <h3>Add comment</h3>
                <form onSubmit={handleSubmit}>
                    <textarea name={'comment'} rows="5" placeholder="Comment..."/>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Form.Text error_tag='form_comment'></Form.Text>
                </form>
            </div>
            <div className={styles.other_comments}>
                <h3>Other comments</h3>
                {!noComments ? comments.map((comment, index) => (
                        <>
                            <Card border="primary" key={index} style={{width: '18rem'}}>
                                <Card.Header>{comment.author}</Card.Header>
                                <Card.Body>
                                    <Card.Title>Created at - {comment.created_at}</Card.Title>
                                    <Card.Text>
                                        {comment.body}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <br/>
                        </>
                    )) :
                    <>
                        <p>No comments yet. Become the first!</p>
                    </>}
            </div>
        </div>
    )
}

export default CommentsSection