import React, { lazy } from 'react';
import styles from './App.module.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from '../App/ProtectedRoutes';
import LayoutRoot from 'src/layouts/LayoutsRoot';
import Layout from 'src/layouts/Layouts';

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
                        />
                    </Routes>
                </Router>
        </div>
    );
};

export default App;