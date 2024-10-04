import BootstrapModal from "./BootstrapModal";
import styles from '../assets/css/modules/homepage.module.css'
import {clear_error_msg, handle_errors} from "../services/utils";
import {EditBlogValidator} from "../services/validators";
import {delete_blog, edit_blog} from "../services/crud";

function AdminTool({blog_data, news, newsSetter, idx, new_id, newsLengthSetter}) {

    const edit_icon = <div className={styles.admin_interface}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
             className="bi bi-pencil-square" viewBox="0 0 16 16">
            <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
    </div>

    const handleSubmit = e => {
        e.preventDefault()
        clear_error_msg()
        const title = e.target.title.value
        const body = e.target.querySelector('[data-contents=true]').innerHTML
        const is_draft = e.target.is_draft.checked
        const validator = new EditBlogValidator(title, body, is_draft)

        if (validator.is_valid()) {
            const sendRequest = async () => {
                const result = await edit_blog(new_id, title, body, is_draft)
                if (result.status === 200) {
                    const current_news = news
                    current_news.splice(idx, 1)
                    newsSetter([result.data, ...current_news])
                    return;
                }
            }
            sendRequest()
        }
        handle_errors(validator, e)
    }

    const handleDelete = e => {
        e.preventDefault()
         const fetchData = async () => {
            const result = await delete_blog(new_id)
            if (result){
                const current_news = news
                current_news.splice(idx, 1)
                newsSetter([...current_news])
                newsLengthSetter(current_news.length)
            }
        }
        fetchData()
    }

    return (
        <BootstrapModal modal_name={edit_icon} admin_interface={true} title={"Edit User's blog"} admin_delete_handler={handleDelete} handler={handleSubmit} blog={blog_data}/>
    )
}

export default AdminTool