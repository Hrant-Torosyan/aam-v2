import React, { lazy } from 'react';
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

const App: React.FC = () => {
    return (
        <div className={styles.App}>
            <Router>
                <Routes>
                    <Route path="/login" element={<MainLogin />} />

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
                        <Route path="/market/product/:productId" element={<ProductDetails />} />
                        <Route path="/briefcase" element={<Briefcase />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/career" element={<Career />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;