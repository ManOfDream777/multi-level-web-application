import {useEffect, useState} from "react";
import {get_my_blogs} from "../services/crud";
import {Card, Col, Container, Row} from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";
import NoBlogs from "../components/NoBlogs";
import SafeHTML from "../components/SafeHTML";
import blog_logo from "../assets/images/homepage_bg.jpeg"
import EditBlog from "../components/EditBlog";
import DeleteBlog from "../components/DeleteBlog";


function MyBlogs() {
    const [blogs, setBlogs] = useState([])
    const [blogsLength, setBlogLength] = useState(-1)
    const [noBlogsYet, setNoBlogsYet] = useState(false)

    useEffect(() => {

        const fetchData = async () => {
            const response = await get_my_blogs()
            if (response.data.length === 0) {
                setNoBlogsYet(true)
                return;
            }
            setBlogs(response.data)
            setBlogLength(response.data.length)
        }

        fetchData()

    }, []);

    useEffect(() => {
        if (blogsLength === 0) {
            setNoBlogsYet(true)
        }else{
            setNoBlogsYet(false)
        }
    }, [blogsLength]);


    if (!blogs) return (
        <>
            <NavBar/>
            <LoadingSpinner/>
        </>
    )
    return (
        <div className='my_blogs'>
            <NavBar blogLengthSetter={setBlogLength} blogSetter={setBlogs}/>
            <Container fluid>
                <h2 className={'text-center'}>My Blogs</h2>
                {noBlogsYet ? <NoBlogs blogLengthSetter={setBlogLength} blogSetter={setBlogs}/> :
                <Row xs={1} md={2}>
                    {blogs.map((blog, idx) => (
                        <Col xs={6} md={4} key={idx}>
                            <Card>
                                <Card.Img variant="top" src={blog_logo}/>
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text>
                                        <SafeHTML body={blog.body}/>
                                    </Card.Text>
                                    <Card.Text>
                                        Author - {blog.author}
                                    </Card.Text>
                                    <Card.Text>
                                        {blog.is_draft ? `Created at - ${blog.created_at}` : `Published at - ${blog.created_at}`}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <EditBlog idx={idx} current_data={{
                                        title: blog.title,
                                        body: blog.body,
                                        is_draft: blog.is_draft
                                    }} blog_id={blog.id} blogs={blogs} blogSetter={setBlogs}/>
                                    <DeleteBlog blog_id={blog.id} blogs={blogs} blogLengthSetter={setBlogLength} blogSetter={setBlogs} idx={idx}/>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>}
            </Container>
        </div>
    )
}

export default MyBlogs