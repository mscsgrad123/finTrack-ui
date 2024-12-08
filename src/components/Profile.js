import React, { useState } from "react";
import styles from "../stylesheet/profile.module.css";
import profilepic from "../stylesheet/profile.avif";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    location: "New York, NY",
    bio: "Software developer with a passion for building web applications.",
  });

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
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={userData.location}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Bio:
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  className={styles.textArea}
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
              <p>Location: {userData.location}</p>
              <p>Bio: {userData.bio}</p>
              <button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
