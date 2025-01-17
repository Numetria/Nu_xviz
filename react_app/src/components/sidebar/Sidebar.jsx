import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar() {
    const menuItems = [
        { id: 1, title: "Dashboard", path: "/" },
        { id: 2, title: "Nucast", path: "/nucast" },  // Updated to match route
        { id: 3, title: "Trading", path: "/trading" },
        { id: 4, title: "Reports", path: "/reports" },
        { id: 5, title: "Settings", path: "/settings" }
    ];

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Menu</h2>
            <ul className={styles.menuList}>
                {menuItems.map((item) => (
                    <li key={item.id} className={styles.menuItem}>
                        <Link to={item.path} className={styles.menuLink}>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;