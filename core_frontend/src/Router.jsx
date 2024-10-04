import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Homepage from "./screens/Homepage";
import Logout from "./screens/Logout";
import SignUp from "./screens/SignUp";
import LogIn from "./screens/LogIn";
import MyBlogs from "./screens/MyBlogs";
import News from "./screens/News";
import Blog from "./screens/Blog";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoutes/>}>
                    <Route element={<Homepage/>} path={'/home/'}/>
                    <Route element={<MyBlogs/>} path={'/my_blogs/'}/>
                    <Route element={<Blog/>} path={'/blog/:id/'}/>
                    <Route element={<News/>} path={'/news/'}/>
                    <Route element={<Logout/>} path={'/logout/'}/>
                </Route>

                <Route element={<SignUp/>} path={'/signup/'}/>
                <Route element={<LogIn/>} path={'/login/'}/>
                <Route element={<div> Страница не найдена </div>} path={'*'}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
