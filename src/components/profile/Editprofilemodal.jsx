import React from "react";
import "./Editprofilemodal.css";
import { supabase } from "../../backend/supabaseConfig";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, Route } from "react-router-dom";

const EditProfileModal = ({ setShowModal }) => {
  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4>Edit Profile</h4>
          </div>
          <div className="modal-body">
            <form>
              <p className="label">name</p>
              <input type="text" />
              <p className="label">description</p>
              <input type="text" />
              <p className="label">skills</p>
              <textarea className="skills-textarea" cols="30" rows="5" />
                <p className="label">avatar</p>
                <input className="hidden" type="file" accept="image/*" />
            </form>
          </div>
          <div className="modal-footer">
            <button
              className="cancel-button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="save-button">Save</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
