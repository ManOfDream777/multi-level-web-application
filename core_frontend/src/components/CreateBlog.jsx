import {CreateBlogValidator} from "../services/validators";
import {create_new_blog} from "../services/crud";
import {clear_error_msg, handle_errors} from "../services/utils";
import BootstrapModal from "./BootstrapModal";


function CreateBlog({blogLengthSetter, blogSetter, is_first}) {
    const handleSubmit = e => {
        e.preventDefault()
        clear_error_msg()
        const title = e.target.title.value
        const body = e.target.querySelector('[data-contents=true]').innerHTML
        const is_draft = e.target.is_draft.checked
        const validator = new CreateBlogValidator(title, body)
        if (validator.is_valid()) {
            const sendRequest = async () => {
                const result = await create_new_blog(title, body, is_draft)
                if (result.status === 201) {
                    blogSetter(prev => [...prev, result.data])
                    is_first ? blogLengthSetter(prev => prev + 2) : blogLengthSetter(prev => prev + 1)
                    return;
                }
            }
            sendRequest()
        }
        handle_errors(validator, e)
    }

    return (
        <BootstrapModal modal_name={'Create blog'} handler={handleSubmit} is_first={is_first} title={'Create blog'}
                        blog={{title: '', body: '', is_draft: true}}/>
    )
}

export default CreateBlog