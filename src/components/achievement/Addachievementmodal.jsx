import React, { useState, useEffect, useContext } from "react";
import "./Addachievementmodal.css";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addachievementmodal = ({setAddAchievementModal}) => {
  const { user } = useContext(LoginContext);
  const [uploading, setUploading] = useState(false);
  const [certificateDescription, setCertificateDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = async (e) => {

    if (certificateDescription === "") {
      toast.error("Please enter a description");
      return;
    } else if (selectedFile === null) {
      toast.error("Please select a file");
      return;
    } 
    else if (selectedFile.type !== "application/pdf") {
      toast.error("Please select a pdf file");
      return;
    }
    else {
      // file upload to the bucket
      setUploading(true);
      const file = selectedFile;
      const filePath = `${user?.id}/${Date.now()}-${file?.name}`;
      const { data, error } = await supabase.storage
        .from("achievements")
        .upload(filePath, file);
      if (error) {
        toast.error("Error uploading certificate");
        setUploading(false);
        return;
      } else {
        //  insert into the database
        const uploadedUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/achievements/${filePath}`;
        console.log(uploadedUrl);
        const { data, error } = await supabase.from("achievements").insert(
          {
            author: user?.id,
            description: certificateDescription,
            url: uploadedUrl,
          },
        );
        if (error) {
          toast.error("Error uploading certificate");
            setUploading(false);
          return;
        } else {
          toast.success("Certificate uploaded successfully");
            setUploading(false);
            setCertificateDescription("");
            setSelectedFile(null);
            setAddAchievementModal(false);
          return;
        }
      }
    }
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4>Add Certification</h4>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFileUpload}>
              <p className="label">Description about the Certificate </p>
              <textarea
                className="skills-textarea"
                cols="30"
                rows="5"
                value={certificateDescription}
                onChange={(e) => setCertificateDescription(e.target.value)}
              />
              <p className="label">Certificate</p>

              <label className="avatar-label">
                <input
                  type="file"
                  accept="application/pdf"
                  className="upload-input"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <p>select a pdf file</p>
              </label>
            </form>
            {
                uploading && (
                    <div className="uploading">
                        <p>Uploading...</p>
                    </div>
                ) 
            }
             {

                     selectedFile && (
                    <div className="selected-file">
                        <p>{selectedFile.name}</p>
                    </div>
                )
            }
          </div>
          <div className="modal-footer">
            <button
              className="cancel-button"
                onClick={() => setAddAchievementModal(false)}
            >
              Cancel
            </button>
            <button
              className="save-button"
              type="submit"
                onClick={handleFileUpload}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addachievementmodal;
