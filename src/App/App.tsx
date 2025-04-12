import React, { lazy, createContext, useState, useEffect } from 'react';
import styles from './App.module.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from '../App/ProtectedRoutes';
import LayoutRoot from 'src/layouts/LayoutsRoot';
import Layout from 'src/layouts/Layouts';

const Analytics = lazy(() => import("src/pages/Analytics/Analytics"));
const Market = lazy(() => import("src/pages/Market/Market"));
const ProductDetails = lazy(() => import("src/pages/ProductDetails/ProductDetails"));
const Briefcase = lazy(() => import("src/pages/Briefcase/Briefcase"));
const Wallet = lazy(() => import("src/pages/Wallet/Wallet"));
const Career = lazy(() => import("src/pages/Career/Career"));
const Profile = lazy(() => import("src/pages/Profile/Profile"));
const MainLogin = lazy(() => import('../pages/auth/MainLogin'));

export const MainContext = createContext<{
    hiddenHeader: string;
    setHiddenHeader: React.Dispatch<React.SetStateAction<string>>;
    imageInfo: any;
    setImageInfo: React.Dispatch<React.SetStateAction<any>>;
    checkWallet: boolean;
    setCheckWallet: React.Dispatch<React.SetStateAction<boolean>>;
    checkPay: any;
    setCheckPay: React.Dispatch<React.SetStateAction<any>>;
}>({
    hiddenHeader: "",
    setHiddenHeader: () => {},
    imageInfo: null,
    setImageInfo: () => {},
    checkWallet: false,
    setCheckWallet: () => {},
    checkPay: null,
    setCheckPay: () => {},
});

const App: React.FC = () => {
    const [hiddenHeader, setHiddenHeader] = useState("");
    const [imageInfo, setImageInfo] = useState(null);
    const [checkWallet, setCheckWallet] = useState(false);
    const [checkPay, setCheckPay] = useState(null);

    useEffect(() => {
        const handlePopState = () => {
            setHiddenHeader("");
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return (
        <MainContext.Provider
            value={{
                hiddenHeader,
                setHiddenHeader,
                imageInfo,
                setImageInfo,
                checkWallet,
                setCheckWallet,
                checkPay,
                setCheckPay,
            }}
        >
            <div className={styles.App}>
                <Router>
                    <Routes>
                        <Route path="/login" element={<MainLogin />} />

                        <Route
                            path="/market/product/:productId"
                            element={
                                <ProtectedRoutes href="/login">
                                    <LayoutRoot>
                                        <ProductDetails />
                                    </LayoutRoot>
                                </ProtectedRoutes>
                            }
                        />

                        {/* Main routes with Layout (navbar) */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoutes href="/login">
                                    <LayoutRoot>
                                        <Layout />
                                    </LayoutRoot>
                                </ProtectedRoutes>
                            }
                        >
                            <Route path="/" element={<Analytics />} />
                            <Route path="/market" element={<Market />} />
                            <Route path="/briefcase" element={<Briefcase />} />
                            <Route path="/wallet" element={<Wallet />} />
                            <Route path="/career" element={<Career />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
        </MainContext.Provider>
    );
};

export default App;