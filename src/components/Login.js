import React from "react";
import styles from "../stylesheet/login.module.css"; // Import CSS module

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <div className={styles["login-body"]}>
      <div className={styles["login-container"]}>
        <div className={styles["form-container"]}>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className={styles["form-group"]}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" className={styles.btn}>
              Login
            </button>
            <div className={styles["extra-links"]}>
              <a href="#">Forgot Password?</a>
              <a href="/signup">Create an Account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
