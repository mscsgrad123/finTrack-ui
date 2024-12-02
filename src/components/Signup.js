import React from "react";
import styles from "../stylesheet/signup.module.css"; // Import CSS module

const SignUp = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign-up submitted");
  };

  return (
    <div className={styles["signup-body"]}>
      <div className={styles["signup-container"]}>
        <div className={styles["form-container"]}>
          <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <div className={styles["form-group"]}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" className={styles.btn}>
              Sign Up
            </button>
            <div className={styles["extra-links"]}>
              <a href="/login">Already have an account? Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
