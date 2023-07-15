import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext";
import { supabase } from "../../backend/supabaseConfig";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Addachievementmodal from "./Addachievementmodal";
import { useParams } from "react-router-dom";
import "./Achievement.css";

const Achievement = () => {
  const { user } = useContext(LoginContext);
  const { profileId } = useParams();
  const [addAchievementModal, setAddAchievementModal] = useState(false);
  const [profileDetails, setProfileDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileCertificates, setProfileCertificates] = useState([]);
  const [certificateCount, setCertificateCount] = useState("");

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", profileId)
      .single();
    if (data) {
      setProfileDetails(data);
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from("achievements")
      .select()
      .eq("author", profileId);
    if (data) {
      setProfileCertificates(data);
      setCertificateCount(data.length);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCertificates();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className="main-achievements">
        <p className="page-title">
          {certificateCount === 1
            ? certificateCount + " Achievement "
            : certificateCount + " Achievements "}
            of
          {profileId === user?.id ? " Yours" : " "+ profileDetails?.name}
        </p>

        {/* add achievements button */}
        {user?.id === profileId && (
          <div
            className="add-achievement-button"
            onClick={() => setAddAchievementModal(true)}
          >
            + Add Achievement
          </div>
        )}
        {addAchievementModal && (
          <Addachievementmodal
            setAddAchievementModal={setAddAchievementModal}
          />
        )}

        <div className="achievements-container">
          {profileCertificates.map((certificate) => (
            <div className="achievement-card">
              <div className="card-description">
                <div className="card-description">
                  <p className="card-title">{certificate.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <h1>
        Achievement Page
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </h1>
      
      <div className="pdf">
      <Viewer fileUrl={pdfUrl} />
       </div> 

      <Addachievementmodal />
    </Worker> */}
    </>
  );
};

export default Achievement;
