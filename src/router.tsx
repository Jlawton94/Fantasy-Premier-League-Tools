import PerfectManager from './pages/perfectManager';
import { Routes, Route } from "react-router-dom";
import Sidebar from './compoents/sidebar';
import Home from './pages/home';

const Router = () => {
    return (
        <div className="container-fluid row">
            <Sidebar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/perfect-manager" element={<PerfectManager />} />
            </Routes>
        </div>
    );
}

export default Router;