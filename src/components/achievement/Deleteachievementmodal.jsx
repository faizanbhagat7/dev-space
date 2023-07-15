import React from "react";
import { supabase } from "../../backend/supabaseConfig";
import "./Deleteachievementmodal.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Deleteachievementmodal = ({
  setDeletemodal,
  fetchCertificates,
  deletecertificateid,
  setDeletecertificateid,
}) => {
  const deleteCertificate = async () => {
    const { data, error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", deletecertificateid);
    if (!error) {
      toast.success("Achievement Deleted Successfully", {
        position: "top-center",
        autoClose: 1500,
        borderRadius: 20,
        hideProgressBar: true,
        closeOnClick: true,
        closeButton: false,
      });
      setDeletemodal(false);
      fetchCertificates();
      setDeletecertificateid(null);
    } else {
      toast.error("Error Deleting Achievement", {
        position: "top-center",
        autoClose: 1500,
        borderRadius: 20,
        hideProgressBar: true,
        closeOnClick: true,
        closeButton: false,
      });
      setDeletemodal(false);
      setDeletecertificateid(null);
    }
  };

  return (
    <>
      <div className="delete-achievement-modal">
        <div className="delete-achievement-modal-content">
          <div className="delete-achievement-modal-header">
            <p>Delete Achievement</p>
          </div>
          <div className="delete-achievement-modal-body">
            <p>Are you sure you want to delete this achievement?</p>
          </div>
          <div className="delete-achievement-modal-footer">
            <button
              className="delete-achievement-modal-button-cancel"
              onClick={() => {
                setDeletemodal(false);
                setDeletecertificateid(null);
              }}
            >
              Cancel
            </button>
            <button
              className="delete-achievement-modal-button-delete"
              onClick={() => {
                deleteCertificate();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deleteachievementmodal;
