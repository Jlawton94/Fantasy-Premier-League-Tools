import PerfectManagerUser from './pages/perfectManagerUser';
import { Routes, Route } from "react-router-dom";
import Sidebar from './compoents/sidebar';
import Home from './pages/home';
import PerfectManager from './pages/perfectManager';

const Router = () => {
    return (
        <div className="container-fluid row">
            <Sidebar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/perfect-manager" element={<PerfectManager />} />
                <Route path="perfect-manager-user/:id" element={<PerfectManagerUser />} />
                <Route path="perfect-manager-user/" element={<PerfectManagerUser />} />
                <Route path="/perfect-manager-league" element={<PerfectManager />} />
            </Routes>
        </div>
    );
}

export default Router;