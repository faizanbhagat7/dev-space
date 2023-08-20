import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext";
import { supabase } from "../../backend/supabaseConfig";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Addachievementmodal from "./Addachievementmodal";
import { useParams } from "react-router-dom";
import "./Achievement.css";
import { Link } from "react-router-dom";
import { DeleteForeverOutlined } from "@mui/icons-material";
import Deleteachievementmodal from "./Deleteachievementmodal";
import Loader from "../loader/Loader";

const Achievement = () => {
  const { user ,darkMode} = useContext(LoginContext);
  const { profileId } = useParams();
  const [addAchievementModal, setAddAchievementModal] = useState(false);
  const [profileDetails, setProfileDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileCertificates, setProfileCertificates] = useState([]);
  const [certificateCount, setCertificateCount] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [deletecertificateid, setDeletecertificateid] = useState(null);

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
      setCertificateCount(data?.length);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCertificates();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="main-achievements">
        <p className="page-title"
          style={{
            color: darkMode ? "white" : "black",
          }}
        >
          {certificateCount === 1
            ? certificateCount + " Achievement "
            : certificateCount + " Achievements "}
          of
          {profileId === user?.id ? " Yours" : " " + profileDetails?.name}
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
            fetchCertificates={fetchCertificates}
          />
        )}

        <div className="achievements-container">
          {profileCertificates.map((certificate) => (
            <div className="achievement-card"
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
            >
              <Link
                to={`/view-certificate/${certificate.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="card-description">
                  <p className="card-title"
                    style={{
                      color: darkMode ? "white" : "black",
                    }} 
                  >{certificate.description}</p>
                </div>
              </Link>
              {user?.id === profileId && (
                <div
                  className="delete-button"
                  onClick={() => {
                    setDeletemodal(true);
                    setDeletecertificateid(certificate.id);
                  }}
                >
                  <DeleteForeverOutlined className="delete-icon" />
                </div>
              )}
            </div>
          ))}
          {deletemodal && (
            <Deleteachievementmodal
              setDeletemodal={setDeletemodal}
              fetchCertificates={fetchCertificates}
              deletecertificateid={deletecertificateid}
              setDeletecertificateid={setDeletecertificateid}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Achievement;
