import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../stylesheet/profile.module.css";
import profilepic from "../stylesheet/profile.avif";
import { oauthConfig } from "./Constants";
import { user } from "./MockData";
const Profile = ({ userId, setAuthToken }) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(user);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8080/api/users/${userId}`
  //       );
  //       if (!response.ok) {
  //         throw new Error("User not found");
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //       setError(null);
  //       setUserData(await response.json());
  //     } catch (err) {
  //       setUserData(null);
  //       setError(err.message);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const handleLogout = () => {
    // Clear local app state
    setAuthToken(null);
    localStorage.removeItem("authToken");
    // Redirect to the OAuth provider's logout endpoint
    const logoutUrl = `https://accounts.google.com/logout`; // Replace with the provider's logout URL
    window.location.href = logoutUrl;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false); // Save the changes and switch back to view mode
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Your Profile</h1>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.profilePicture}>
          <img src={profilepic} alt="Profile" className={styles.picture} />
        </div>
        <div className={styles.profileInfo}>
          {isEditing ? (
            <form onSubmit={handleSave}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <button type="submit" className={styles.saveButton}>
                Save
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{userData.name}</h2>
              <p>Email: {userData.email}</p>
              <button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
