import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import "./addpost.css";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";

const Addpost = () => {
  const { activebutton, user, setActivebutton } = useContext(LoginContext);

  useEffect(() => {
    setActivebutton("add post");
  }, []);

  return (
    <>
      <div className="addpost-container">
        {/* bookmarks */}
        <div className="addpost-bookmarks">
          <Link
            to="/bookmarks"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="addpost-bookmarks-title">
              <p>Bookmarks</p>
            </div>
          </Link>
        </div>

        {/* addpost */}
        <div className="addpost">
          <div className="addpost-profile-section">
            <div className="addpost-userinfo">
              <div className="addpost-profile-icon-image">
                <img src={user?.avatar} alt="" />
              </div>
              <div className="addpost-profile-name">
                <p>
                  {user?.name.length > 15
                    ? user?.name.slice(0, 15) + "..."
                    : user?.name}
                </p>
              </div>
            </div>
            <div>
              <button
                className="addpost-save-button"
                type="submit"
                // onClick={handleSubmit}
                style={
                  {
                    // display: uploading ? "none" : "inline",
                    // display: bucketUpload ? "none" : "inline",
                  }
                }
              >
                Post Content
              </button>
            </div>
          </div>
          <div className="addpost-input-section">
            <div className="addpost-input">
              <form>
                <textarea
                  className="input-textarea"
                  placeholder="Whats in your mind ?"
                />

                <label className="addpost-avatar-label">
                  <input
                    type="file"
                    accept="image/*"
                    className="addpost-upload-input"
                  />
                  <p>Choose Image</p>
                </label>

                <p className="image-selected-info">{/* <Loader /> */}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addpost;
