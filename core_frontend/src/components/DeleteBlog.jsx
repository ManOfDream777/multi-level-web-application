import {useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {delete_blog} from "../services/crud";
import BootstrapModal from "./BootstrapModal";


function DeleteBlog({blog_id, blogs, blogLengthSetter, blogSetter, idx}){
    const handleDelete = e => {
        const fetchData = async () => {
            const result = await delete_blog(blog_id)
            if (result){
                const current_blogs = blogs
                current_blogs.splice(idx, 1)
                blogSetter([...current_blogs])
                blogLengthSetter(current_blogs.length)
            }
        }
        fetchData()
    }

    return (
        <BootstrapModal modal_name={'Delete blog'} delete_modal={true} title={'Deletion of the blog'} handler={handleDelete}/>
    )
}

export default DeleteBlog