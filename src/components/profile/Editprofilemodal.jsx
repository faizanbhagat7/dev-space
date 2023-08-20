import React from "react";
import "./Editprofilemodal.css";
import { supabase } from "../../backend/supabaseConfig";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route, useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Loader from "../loader/Loader";

const EditProfileModal = ({
  setShowModal,
  fetchDynamicUserProfile,
  userProfile,
}) => {
  const { user, setUser, fetchUserProfile ,  darkMode} = useContext(LoginContext);
  const Session = useSession();
  const { profileId } = useParams();

  const [userName, setUserName] = useState(userProfile?.name);
  const [userDescription, setUserDescription] = useState(
    userProfile?.description
  );
  const [userSkills, setUserSkills] = useState(userProfile?.skills);
  const [uploadData, setUploadData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bucketUpload, setBucketUpload] = useState(false);

  const handleSubmit = async (e) => {
    if (userName === "") {
      toast.error("Name cannot be empty");
      return;
    }
    if (userDescription?.length > 20) {
      toast.error("Description cannot be more than 20 characters");
      return;
    }
    e.preventDefault();

    if (uploadData) {
      setUploading(true);

      const url = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/avatars/${uploadData?.path}`;
      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: userName,
          description: userDescription,
          skills: userSkills,
          avatar: url,
        })
        .eq("id", userProfile?.id);

      if (!error) {
        fetchDynamicUserProfile(profileId);
        fetchUserProfile(Session);
        toast.success("Profile updated successfully", {
          closeOnClick: true,
          closeButton: false,
          position: "bottom-center",
          duration: 1000,
          hideProgressBar: true,
        });
        setShowModal(false);
        setUploading(false);
      } else {
        toast.error("Error updating profile", {
          closeOnClick: true,
          closeButton: false,
          position: "bottom-center",
          duration: 1000,
          hideProgressBar: true,
        });
      }
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: userName,
          description: userDescription,
          skills: userSkills,
        })
        .eq("id", userProfile?.id);
      if (!error) {
        fetchDynamicUserProfile(profileId);
        fetchUserProfile(Session);
        toast.success("Profile updated successfully", {
          closeOnClick: true,
          closeButton: false,
          position: "bottom-center",
          hideProgressBar: true,
          duration: 1000,
        });
        setShowModal(false);
        setUploading(false);
      } else {
        toast.error("Error updating profile", {
          closeOnClick: true,
          closeButton: false,
          position: "bottom-center",
          duration: 1000,
          hideProgressBar: true,
        });
      }
    }
  };

  const handleAvatar = async (e) => {
    setBucketUpload(true);
    const file = e.target.files[0];
    const filePath = `${userProfile?.id}/${Date.now()}-${file?.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (data) {
      setBucketUpload(false);
      setUploadData(data);
      return;
    }

    if (error) {
      setBucketUpload(false);
      toast.error("Error uploading image");
      return;
    }
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content"
          style={{
            backgroundColor: darkMode ? "#1f1f1f" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <div className="modal-header">
            <h4>Edit Profile</h4>
          </div>
          <div className="modal-body"
            style={{
              backgroundColor: darkMode ? "#1f1f1f" : "#fff",
              color: darkMode ? "#fff" : "#000",
            }}
          >
            <form onSubmit={handleSubmit}
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
            >
              <p className="label">name</p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#15202b" : "#fff",
                  color: darkMode ? "#fff" : "#000",
                  border:darkMode && "1px solid #fff"
                }}
              />
              <p className="label">description</p>
              <input
                type="text"
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#15202b" : "#fff",
                  color: darkMode ? "#fff" : "#000",
                  border:darkMode && "1px solid #fff"
                }}
              />
              <p className="label">skills</p>
              <textarea
                className="skills-textarea"
                cols="30"
                rows="5"
                value={userSkills}
                onChange={(e) => setUserSkills(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#15202b" : "#fff",
                  color: darkMode ? "#fff" : "#000",
                  border:darkMode && "1px solid #fff"
                }}
              />
              <p className="label">avatar</p>

              <label className="avatar-label">
                <input
                  type="file"
                  accept="image/*"
                  className="upload-input"
                  onChange={handleAvatar}
                />
                <p>Choose Image</p>
              </label>
            </form>
            {bucketUpload ? (
              <div className="uploading">
                <p
                  style={{
                    color: darkMode ? "#fff" : "#000",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    marginTop: "10px",
                    marginBottom: "0px",
                  }}
                >
                  Processing Image ..
                </p>
              </div>
            ) : (
              uploadData && (
                <p
                  style={{
                    color: darkMode ? "#fff" : "#000",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    marginTop: "10px",
                    marginBottom: "0px",
                  }}
                >
                  Image selected
                </p>
              )
            )}
          </div>
          <div className="modal-footer">
            <button
              className="cancel-button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="save-button"
              type="submit"
              onClick={handleSubmit}
              style={{
                display: uploading ? "none" : "inline",
                display: bucketUpload ? "none" : "inline",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
