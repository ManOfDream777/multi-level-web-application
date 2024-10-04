import {Link} from "react-router-dom";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import CreateBlog from "./CreateBlog";
import SideBar from "./SideBar";

function NavBar({blogLengthSetter, blogSetter, redirect_to_creation_page}) {

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand><Link to={'/home/'}>Pet-Project</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link><Link to={'/home/'}>Home</Link></Nav.Link>
                        <Nav.Link><Link to={'/news/'}>News</Link></Nav.Link>
                        <NavDropdown title="My Blogs" id="basic-nav-dropdown">
                            {redirect_to_creation_page ?
                                <NavDropdown.Item>
                                    <Link to={'/my_blogs/'}>Create blog</Link>
                                </NavDropdown.Item> :
                                <div className={'dropdown-item'} role={'button'}>
                                    <CreateBlog blogLengthSetter={blogLengthSetter} blogSetter={blogSetter}
                                                is_first={false}/>
                                </div>}

                            <NavDropdown.Item>
                                <Link to={'/my_blogs/'}>My Blogs</Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link><Link to={'/logout/'}>Logout</Link></Nav.Link>
                    </Nav>
                    <SideBar/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar