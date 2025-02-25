import { Outlet } from "react-router";
import { Suspense } from "react";

import Header from 'src/access/Header/Header';


const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Suspense
                    fallback={
                        <div className="loader">
                            <img
                                src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                                alt="loader"
                            />
                        </div>
                    }
                >
                    <Outlet />
                </Suspense>
            </main>
        </>
    );
};

export default Layout;
