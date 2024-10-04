import styles from "../assets/css/modules/homepage.module.css"
import CreateBlog from "./CreateBlog";


function NoBlogs({blogLengthSetter, blogSetter}) {
    return (
        <div className={styles.center_block}>
            <h1>No blogs yet</h1>
            <CreateBlog blogLengthSetter={blogLengthSetter} blogSetter={blogSetter} is_first={true}/>
        </div>
    )
}

export default NoBlogs