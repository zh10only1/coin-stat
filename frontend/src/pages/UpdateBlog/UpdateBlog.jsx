import { getBlogById } from "../../api/internal";
import styles from "./UpdateBlog.module.css";
import InputField from "../../components/InputField/InputField";
import WideButton from "../../components/WideButton/WideButton";
import { updateBlog } from "../../api/internal";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdateBlog() {
  const params = useParams();
  const navigate = useNavigate();
  const blogId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");
  const author = useSelector((state) => state.user._id);

  useEffect(() => {
    (async function getBlogDetails() {
      const response = await getBlogById(blogId);
      if (response.status === 200) {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setPhoto(response.data.blog.photoPath);
      }
    })();
  }, []);

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const updateBlogHandler = async () => {
    const data = photo.includes("http")
      ? {
          title,
          content,
          author,
          blogId,
        }
      : {
          title,
          content,
          author,
          blogId,
          photo,
        };
        
    const response = await updateBlog(data);

    if (response.status === 200) {
      navigate(`/blog/${blogId}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Update your blog</div>
      <InputField
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "60%" }}
      />
      <textarea
        className={styles.content}
        placeholder="Your content goes here..."
        maxLength={1000}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className={styles.photoPrompt}>
        <p>Choose a photo:</p>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/jpg, image/jpeg, image/png"
          onChange={getPhoto}
        />
      </div>
      <WideButton text="Update" onClick={updateBlogHandler} />
    </div>
  );
}

export default UpdateBlog;
