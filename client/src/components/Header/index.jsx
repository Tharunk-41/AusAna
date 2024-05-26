import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const Header = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const nameFromStorage = localStorage.getItem("name");

    if (storedToken && nameFromStorage) {
      setToken(storedToken);
      setName(nameFromStorage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.reload();
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Austere Analytics</h1>
        {token && (
          <div className={styles.user_info}>
            <h2>Welcome, {name}</h2>
            <button className={styles.white_btn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
