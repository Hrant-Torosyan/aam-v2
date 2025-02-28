import { Outlet } from "react-router";
import React, { Suspense } from "react";

import Header from 'src/access/Header/Header';
import Loader from "src/ui/Loader/Loader";


const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Suspense
                    fallback={
                        <Loader />
                    }
                >
                    <Outlet />
                </Suspense>
            </main>
        </>
    );
};

export default Layout;
