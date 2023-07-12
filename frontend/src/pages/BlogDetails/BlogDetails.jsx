import {
  getBlogById,
  deleteBlog,
  addComment,
  getCommentsById,
} from "../../api/internal";
import styles from "./BlogDetails.module.css";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import CommentList from "../../components/CommentList/CommentList";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function BlogDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;

  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);

  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    async function getBlogDetails() {
      const commentResponse = await getCommentsById(blogId);
      if (commentResponse.status === 200) {
        setComments(commentResponse.data.data);
      }

      const blogResponse = await getBlogById(blogId);
      if (blogResponse.status === 200) {
        setBlog(blogResponse.data.blog);
        setOwnsBlog(userId === blogResponse.data.blog.authorId);
      }
    }
    getBlogDetails();
  }, []);

  useEffect(() => {
    (async function getComments() {
      const commentResponse = await getCommentsById(blogId);
      if (commentResponse.status === 200) {
        setComments(commentResponse.data.data);
      }
    })();
  }, [commentAdded]);

  const postCommentHandler = async () => {
    if (newComment === "") return;
    
    const data = {
      author: userId,
      blog: blogId,
      content: newComment,
    };
    const response = await addComment(data);

    if (response.status === 201) {
      setNewComment("");
      setCommentAdded(!commentAdded);
    }
  };

  const deleteBlogHandler = async () => {
    const response = await deleteBlog(blogId);

    if (response.status === 200) {
      navigate("/blogs");
    }
  };

  if (blog.length === 0) {
    return (<Loader text="Blog Details" />)
  }

  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.blog}>
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <p>{`by @${blog.authorUsername} on ${new Date(
            blog.createdAt
          ).toDateString()}`}</p>
        </div>
        <div className={styles.blogImage}>
          <img src={blog.photoPath} width={250} height={250} alt="blog-img" />
        </div>
        <p className={styles.content}>{blog.content}</p>
        {ownsBlog && (
          <div className={styles.controls}>
            <Button
              text="Edit Blog"
              backgroundColor="#5465FF"
              onClick={() => {
                navigate(`/blog-update/${blog._id}`);
              }}
            />
            <Button
              text="Delete Blog"
              backgroundColor="#ea3943"
              onClick={deleteBlogHandler}
            />
          </div>
        )}
      </div>
      <div className={styles.comments}>
        <div className={styles.commentsContainer}>
          <CommentList comments={comments} />
          <div className={styles.postComment}>
            <input
              placeholder="Comment goes here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              text="Post"
              backgroundColor="#5465FF"
              onClick={postCommentHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
