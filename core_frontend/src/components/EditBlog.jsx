import {EditBlogValidator} from "../services/validators";
import {edit_blog} from "../services/crud";
import {clear_error_msg, handle_errors} from "../services/utils";
import BootstrapModal from "./BootstrapModal";

function EditBlog({blogs, idx, current_data, blog_id, blogSetter}) {
    const handleSubmit = e => {
        e.preventDefault()
        clear_error_msg()
        const title = e.target.title.value
        const body = e.target.querySelector('[data-contents=true]').innerHTML
        const is_draft = e.target.is_draft.checked
        const validator = new EditBlogValidator(title, body, is_draft)
        if (validator.is_valid()) {
            const sendRequest = async () => {
                const result = await edit_blog(blog_id, title, body, is_draft)
                if (result.status === 200) {
                    const current_blogs = blogs
                    current_blogs.splice(idx, 1)
                    blogSetter([result.data, ...current_blogs])
                    return;
                }
            }
            sendRequest()
        }
        handle_errors(validator, e)
    }

    return (
        <BootstrapModal modal_name={'Edition of the blog'} title={"Edit this blog"} handler={handleSubmit} blog={current_data}/>
    )
}

export default EditBlog