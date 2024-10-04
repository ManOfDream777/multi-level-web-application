import {useEffect, useState} from "react";
import {get_blog, subscribe_to_author} from "../services/crud";
import {Container} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import NavBar from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";
import SafeHTML from "../components/SafeHTML";
import styles from "../assets/css/modules/homepage.module.css"
import LikeSection from "../components/LikeSection";
import CommentsSection from "../components/CommentsSection";


function Blog() {
    const blogId = document.location.pathname.split('/').pop();
    const [blogData, setBlogData] = useState({})
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [showErrorText, setShowErrorText] = useState(false)
    const [errorText, setErrorText] = useState("")

    const heart_icon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                            className="bi bi-heart-pulse" viewBox="0 0 16 16">
        <path
            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053.918 3.995.78 5.323 1.508 7H.43c-2.128-5.697 4.165-8.83 7.394-5.857q.09.083.176.171a3 3 0 0 1 .176-.17c3.23-2.974 9.522.159 7.394 5.856h-1.078c.728-1.677.59-3.005.108-3.947C13.486.878 10.4.28 8.717 2.01zM2.212 10h1.315C4.593 11.183 6.05 12.458 8 13.795c1.949-1.337 3.407-2.612 4.473-3.795h1.315c-1.265 1.566-3.14 3.25-5.788 5-2.648-1.75-4.523-3.434-5.788-5"/>
        <path
            d="M10.464 3.314a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.5a.5.5 0 0 0 0 1H4a.5.5 0 0 0 .416-.223l1.473-2.209 1.647 4.118a.5.5 0 0 0 .945-.049l1.598-5.593 1.457 3.642A.5.5 0 0 0 12 9h3.5a.5.5 0 0 0 0-1h-3.162z"/>
    </svg>

    const subscribed_icon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-check" viewBox="0 0 16 16">
        <path
            d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
    </svg>

    useEffect(() => {
        const fetchData = async () => {
            const result = await get_blog(blogId)
            if (result.data.subscription_status.is_subscribed){
                setIsSubscribed(true)
            }
            setBlogData(result.data)
        }
        fetchData()
    }, [blogId]);

    const handle_subscribe = e => {
        const sendRequest = async () => {
            const result = await subscribe_to_author(blogId)
            if (result.status === 201) {
                setIsSubscribed(true)
            }else if (result.status === 202){
                setIsSubscribed(false)
                setShowErrorText(true)
                setErrorText(result.data.message)
            }
        }

        sendRequest()
    }

    if (JSON.stringify(blogData) === '{}') {
        return (
            <>
                <NavBar redirect_to_creation_page={true}/>
                <LoadingSpinner text={"Perhaps this blog isn't exists or published yet"}/>
            </>
        )
    }

    return (
        <>
            <NavBar redirect_to_creation_page={true}/>
            <Container>
                <h1 className='text-center'>{blogData.title}</h1>
                <SafeHTML body={blogData.body}/>
                <div className={styles.footer}>
                    <p>Author of this blog is <span>{blogData.author}</span></p>
                    {!isSubscribed ?
                        <p>You can subscribe to this author -> {!showErrorText ? <Button onClick={handle_subscribe}
                                                                        variant={'primary'}>Subscribe {heart_icon}</Button> : <Button
                                                                        variant={'danger'}>{errorText}</Button>}</p> :
                        <Button variant={'success'}>Subscribed {subscribed_icon}</Button>}
                    <p>Published at - {blogData.created_at}</p>
                </div>
                <div className={styles.pre_comments}>
                    <div>
                        <p>Please write your opinion below.</p>
                        <CommentsSection blog_id={blogId} comments_data={blogData.comments_data}/>
                    </div>
                    <div>
                        <p>Like this blog or dislike to help us to improve content.</p>
                        <LikeSection blog_id={blogId} likes_data={blogData.likes_data}/>
                    </div>
                </div>
            </Container>
        </>

    )
}

export default Blog