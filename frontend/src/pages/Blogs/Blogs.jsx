import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { getAllBlogs } from "../../api/internal";
import styles from "./Blogs.module.css";
import Button from "../../components/Button/Button";

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async function getBlogsApiCall() {
      const response = await getAllBlogs();

      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    })();

    setBlogs([]);
  }, []);

  if (blogs.length === 0) {
    return <Loader text="blogs" />;
  }

  return (
    <>
      <h1 className={styles.header}>Crypto Blogs</h1>
      <div className={styles.buttonContainer}>
        <Button
          text="Create new blog"
          backgroundColor="#5465FF"
          onClick={() => {
            navigate("/create-blog");
          }}
        />
      </div>
      <div className={styles.blogsContainer}>
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className={styles.blog}
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            <img src={blog.photoPath} alt="blog-img" />
            <h1>{blog.title}</h1>
            {/* <h4>{`Author: ${blog.author}`}</h4> */}
            <p>{blog.content}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Blogs;
