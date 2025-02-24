import React, {ReactNode } from "react";
// import { GetUerInfo } from "../api/profile";
// import { logout } from "../api/autorisation";
// @ts-ignore
import { Navigate } from "react-router-dom";
// Define the prop types for the ProtectedRoutes component
interface ProtectedRoutesProps {
    children: ReactNode; // ReactNode allows any valid React child
    href: string; // href is a string for the redirect path
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children, href }) => {
    const login = window.localStorage.getItem("userAuth");

    // useEffect(() => {
    //     if (login) {
    //         GetUerInfo().then((res) => {
    //             if (res.status) {
    //                 logout();
    //             }
    //         });
    //     }
    // }, [login]);

    if (!login) {
        return <Navigate to={href} replace={true} />;
    }

    return <>{children}</>;
};

export default ProtectedRoutes;