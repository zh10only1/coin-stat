import { createBlog } from "../../api/internal";
import styles from "./CreateBlog.module.css";
import InputField from "../../components/InputField/InputField";
import WideButton from "../../components/WideButton/WideButton";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");
  const author = useSelector((state) => state.user._id);

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const createBlogHandler = async () => {
    const data = {
      title,
      author,
      content,
      photo,
    };

    const response = await createBlog(data);

    console.log(response)

    if (response.status === 201) {
        navigate("/blogs")
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Create a blog</div>
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
      <WideButton text="Create" onClick={createBlogHandler} />
    </div>
  );
}

export default CreateBlog;
