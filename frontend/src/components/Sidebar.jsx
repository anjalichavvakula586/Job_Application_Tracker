import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">◆</span>
        <span className="logo-text">CareerHero</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/board"
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          Job Tracker
        </NavLink>
        <NavLink
  to="/analysis"
  className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
>
  Analysis
</NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item" onClick={onLogout} style={{ cursor: "pointer" }}>
          Log Out
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;