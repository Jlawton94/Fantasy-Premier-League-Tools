import { NavLink } from "react-router-dom";
import "../styling/sidebar.css";

const Sidebar = () => {
    return (
        <nav className="navbar col-2 vh-100 sticky-top align-items-start sidebar">
            <div className="conatiner-fluid w-100">
                <ul className="navbar-nav">
                    <li className="py-1">
                        <NavLink to="/" className={({ isActive }) =>
                            isActive ? "activeLink" : "link"
                        }>Home</NavLink>
                    </li>
                    <li className="py-1">
                        <NavLink to="/perfect-manager" className={({ isActive }) =>
                            isActive ? "activeLink" : "link"
                        }>Perfect Manager</NavLink>
                    </li>
                </ul>
            </div>
        </nav>

    );
}

export default Sidebar;