import { NavLink } from "react-router-dom";
import "../styling/sidebar.css";

const Sidebar = () => {
    return (
        <nav className="navbar col-2 vh-100 sticky-top align-items-start sidebar">
            <div className="conatiner-fluid w-100">
                <ul className="navbar-nav">
                    <li className="py-1">
                        <NavLink to="/" className={({ isActive }) =>
                            isActive ? "activeLink" : "parentLink"
                        }>Home</NavLink>
                    </li>
                    <li className="py-1">
                        <NavLink to="/perfect-manager" className={({ isActive }) =>
                            isActive ? "activeLink" : "parentLink"
                        }>Perfect Manager</NavLink>
                    </li>
                    <li className="py-1">
                        <NavLink to="/perfect-manager-user" className={({ isActive }) =>
                            isActive ? "activeLink" : "link"
                        }>User</NavLink>
                    </li>
                    <li className="py-1">
                        <NavLink to="/perfect-manager-league" className={({ isActive }) =>
                            isActive ? "activeLink" : "link"
                        }>League</NavLink>
                    </li>
                </ul>
            </div>
        </nav>

    );
}

export default Sidebar;