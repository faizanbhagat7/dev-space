import React, { useState, useEffect } from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useParams } from "react-router-dom";
import { supabase } from "../../backend/supabaseConfig";
import { LoginContext } from "../../context/LoginContext";
import { useContext } from "react";
import "./Certificateviewer.css";

const Certificateviewer = () => {
  const { certificateId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const { setActivebutton } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const [pdfDescription, setPdfDescription] = useState("");

  const fetchCertificate = async () => {
    const { data, error } = await supabase
      .from("achievements")
      .select("url, description")
      .eq("id", certificateId)
      .single();
    if (data) {
      setPdfUrl(data.url);
      setPdfDescription(data.description);
      setLoading(false);
    }
  };

  console.log(pdfUrl);
  useEffect(() => {
    setActivebutton("");
    fetchCertificate();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="pdf-container">
        <div className="pdf-description">{pdfDescription}</div>
        <div className="pdf">
          <Viewer fileUrl={pdfUrl} />
        </div>
      </div>
    </Worker>
  );
};

export default Certificateviewer;
