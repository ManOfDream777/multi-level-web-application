import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {checkAuthenticated} from "../services/auth";

function ProtectedRoutes() {
    const [isAuth, setIsAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const async_callback = async () => {
            setLoading(true);
            const check_authentication = await checkAuthenticated();
            setIsAuth(check_authentication);
            setLoading(false);
        };

        async_callback();
    }, [location.pathname]);

    if (loading) {
        return <div></div>;
    }

    return isAuth ? <Outlet/> : <Navigate to={'/login/'} replace={true}/>;
}

export default ProtectedRoutes;