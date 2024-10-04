import {useEffect, useState} from "react";
import {get_news} from "../services/crud";
import {Card, Col, Container, Row} from "react-bootstrap";
import blog_logo from "../assets/images/homepage_bg.jpeg";
import SafeHTML from "../components/SafeHTML";
import NavBar from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";
import AdminTool from "../components/AdminTool";
import {decrypt_data} from "../services/utils";
import {Link} from "react-router-dom";
import styles from "../assets/css/modules/homepage.module.css"


function News() {
    const [news, setNews] = useState([])
    const [role, setRole] = useState('user')
    const [newsLength, setNewsLength] = useState(1)
    const [showEmptyPage, setShowEmptyPage] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const result = await get_news()
            const _role = await decrypt_data(localStorage.getItem('role'))
            if (result.data.length === 0) {
                setShowEmptyPage(true)
                setNewsLength(0)
                return;
            }
            setNews(result.data)
            setRole(_role)
        }
        fetchData()
    }, []);

    useEffect(() => {
        if (newsLength === 0) {
            setShowEmptyPage(true)
        } else {
            setShowEmptyPage(false)
        }
    }, [newsLength]);

    return (
        <>
            <NavBar redirect_to_creation_page={true}/>
            {!showEmptyPage ? <Container>
                    <h2 className={'text-center'}>Newest Blogs!</h2>
                    <Row xs={1} md={2}>
                        {news.map((_new, idx) => (
                            <Col xs={6} md={4} key={idx}>
                                <div style={{position: "relative"}}>
                                    {role === 'admin' ?
                                        <AdminTool newsSetter={setNews} idx={idx} new_id={_new.id} news={news}
                                                   blog_data={_new} newsLengthSetter={setNewsLength}/> : ''}
                                    <Link className={styles.link} to={_new.revert_url}>
                                        <Card>

                                            <Card.Img variant="top" src={blog_logo}/>
                                            <Card.Body>
                                                <Card.Title>{_new.title}</Card.Title>
                                                <Card.Text>
                                                    <SafeHTML body={_new.body}/>
                                                </Card.Text>
                                                <Card.Text>
                                                    Author - {_new.author}
                                                </Card.Text>
                                                <Card.Text>
                                                    Published - {_new.created_at}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container> :
                <LoadingSpinner/>}
        </>
    )
}

export default News