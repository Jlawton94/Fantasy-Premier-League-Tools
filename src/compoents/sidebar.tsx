import { NavLink } from "react-router-dom";
import "../styling/sidebar.css";

const Sidebar = () => {
    return (
        <nav className="navbar bg-light col-1 vh-100 sticky-top align-items-start">
            <div className="conatiner-fluid">
                <ul className="navbar-nav">
                    <li>
                        <NavLink to="/" className={({ isActive, isPending }) =>
                            isPending ? "pendingLink" : isActive ? "activeLink" : ""
                        }>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/perfect-manager" className={({ isActive, isPending }) =>
                            isPending ? "pendingLink" : isActive ? "activeLink" : ""
                        }>Perfect Manager</NavLink>
                    </li>
                </ul>
            </div>
        </nav>

    );
}

export default Sidebar;