import React,{useContext} from "react";
import "./deletemodal.css";
import { supabase } from "../../backend/supabaseConfig";
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../../context/LoginContext";

const Deletemodal = ({setShowDeleteModal,feed,getFeed}) => {

    const { darkMode } = useContext(LoginContext);
    const deletePost = async () => {
        const { data, error } = await supabase
          .from("posts")
          .delete()
          .eq("id", feed?.id);
        if (!error) {
          // getFeed(); 
          toast.success("Post deleted successfully",{
            closeOnClick: true,
            closeButton: false,
            position: "bottom-center",
            duration: 1000,
            hideProgressBar: true,
          });
        }
      };

  return (
    <>
           <div className="delete-feed-modal">
        <div className="delete-feed-modal-content"
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
        >
          <div className="delete-feed-modal-header">
            <p>Delete Post</p>
          </div>
          <div className="delete-feed-modal-body"
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
          >
            <p>Are you sure you want to delete this Post?</p>
          </div>
          <div className="delete-feed-modal-footer"
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
          >
            <button
              className="delete-feed-modal-button-cancel"
              onClick={() => {
                setShowDeleteModal(false);
              }}
            >
              Cancel
            </button>
            <button
              className="delete-feed-modal-button-delete"
              onClick={() => {
                deletePost();
                setShowDeleteModal(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};

export default Deletemodal;
