import React from "react";
import "./Editprofilemodal.css";
import { supabase } from "../../backend/supabaseConfig";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

const EditProfileModal = ({ setShowModal }) => {
  const { user , setUser , fetchUserProfile } = useContext(LoginContext);
  const Session = useSession();

  const [userName, setUserName] = useState(user?.name);
  const [userDescription, setUserDescription] = useState(user?.description);
  const [userSkills, setUserSkills] = useState(user?.skills);
  const [uploadData, setUploadData] = useState(null);

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
      const url = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/avatars/${uploadData?.path}`;
      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: userName,
          description: userDescription,
          skills: userSkills,
          avatar: url,
        })
        .eq("id", user?.id);

      if (!error) {
        fetchUserProfile(Session);
        toast.success("Profile updated successfully");
        setShowModal(false);
      } else {
        toast.error("Error updating profile");
      }
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: userName,
          description: userDescription,
          skills: userSkills,
        })
        .eq("id", user?.id);
      if (!error) {
        fetchUserProfile(Session);
        toast.success("Profile updated successfully");
        setShowModal(false);
      } else {
        toast.error("Error updating profile");
      }
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    const filePath = `${user?.id}/${file?.name}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (data) {
      console.log(data);
      setUploadData(data);
      return;
    }

    if (error) {
      toast.error("Error uploading image");
      return;
    }
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4>Edit Profile</h4>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <p className="label">name</p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <p className="label">description</p>
              <input
                type="text"
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
              />
              <p className="label">skills</p>
              <textarea
                className="skills-textarea"
                cols="30"
                rows="5"
                value={userSkills}
                onChange={(e) => setUserSkills(e.target.value)}
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
