import React, { useContext, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { LoginContext } from "../../context/LoginContext";
import { supabase } from "../../backend/supabaseConfig";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Addachievementmodal from "./Addachievementmodal";
import { useParams } from "react-router-dom";

const Achievement = () => {
  const { user } = useContext(LoginContext);
  const { profileId } = useParams();
  const [addAchievementModal, setAddAchievementModal] = useState(false);
  console.log(profileId);
  return (
    <>
      <div className="main">
        <p className="title">Achievements for {user?.name}</p>

        {/* add achievements button */}
        {user?.id === profileId && (
          <div
            className="add-achievement-button"
            onClick={() => setAddAchievementModal(true)}
          >
            Add an achievement
          </div>
        )}
        {addAchievementModal && <Addachievementmodal setAddAchievementModal={setAddAchievementModal} />}
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
