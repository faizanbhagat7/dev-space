import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import "./addpost.css";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import { supabase } from "../../backend/supabaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addpost = () => {
  const { activebutton, user, setActivebutton } = useContext(LoginContext);

  useEffect(() => {
    setActivebutton("add post");
  }, []);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [filePath, setFilePath] = useState("");

  const fileUpload = (e) => {
    const file = e.target.files[0];
    const path = `${user?.id}/${Date.now()}-${file?.name}`;
    setFilePath(path);
    const url = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/posts/${path}`;
    setImage(file);
    setImageURL(url);
  };

  const postContent = async (e) => {
    e.preventDefault();
    if (caption !== "" || image !== null) {
    setIsUploading(true);
    if (image) {
      const { data, error } = await supabase.storage
        .from("posts")
        .upload(filePath, image);
      if (error) {
        toast.error("Error uploading image", {
          closeOnClick: true,
          closeButton: false,
          position: "bottom-center",
          duration: 1000,
          hideProgressBar: true,
        });
        return;
      }

      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            author: user?.id,
            caption: caption,
            image: imageURL,
          },
        ]);
      if (postError) {
        toast.error("Error uploading post", {
          closeOnClick: true,
          closeButton: false,
          position: "bottom-center",
          duration: 1000,
          hideProgressBar: true,
        });
        return;
      }
      toast.success("Post uploaded successfully", {
        closeOnClick: true,
        closeButton: false,
        position: "bottom-center",
        duration: 1000,
        hideProgressBar: true,
      });
      setIsUploading(false);
      setCaption("");
      setImage(null);
      setImageURL("");
      setFilePath("");
    } else {
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            author: user?.id,
            caption: caption,
          },
        ]);
      if (postError) {
        toast.error("Error uploading post", {
          closeOnClick: true,
          closeButton: false,
          position: "bottom-center",
          duration: 1000,
          hideProgressBar: true,
        });
        return;
      }
      toast.success("Post uploaded successfully", {
        closeOnClick: true,
        closeButton: false,
        position: "bottom-center",
        duration: 1000,
        hideProgressBar: true,
      });
      setIsUploading(false);
      setCaption("");
    }}
    else{
      toast.error("Please enter caption or upload image", {
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
      <div className="addpost-container">
      

        {/* addpost */}
        <div className="addpost">
          <div className="addpost-profile-section">
            <div className="addpost-userinfo">
              <div className="addpost-profile-icon-image">
                <img src={user?.avatar} alt="" />
              </div>
              <div className="addpost-profile-name">
                <p>
                  {user?.name.length > 15
                    ? user?.name.slice(0, 15) + "..."
                    : user?.name}
                </p>
              </div>
            </div>
            <div>
              <button
                className="addpost-save-button"
                type="submit"
                onClick={(e) => postContent(e)}
              >
                Post Content
              </button>
            </div>
          </div>
          <div className="addpost-input-section">
            <div className="addpost-input">
              <form onSubmit={(e) => postContent(e)}>
                <textarea
                  className="input-textarea"
                  placeholder="Whats in your mind ?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />

                <label className="addpost-avatar-label">
                  <input
                    type="file"
                    accept="image/*"
                    className="addpost-upload-input"
                    onChange={(e) => fileUpload(e)}
                  />
                  <p>Choose Image</p>
                </label>

                <p className="image-selected-info">
                  {image ? `Image selected: ${image.name}` : ""}
                </p>
                {isUploading ? <Loader /> : ""}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addpost;
