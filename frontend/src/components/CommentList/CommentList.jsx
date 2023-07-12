import styles from "./CommentList.module.css";
import Comment from "../Comment/Comment";

function CommentList({ comments }) {
  return (
    <div className={styles.commentListContainer}>
      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <div className={styles.noComments}> Oops nothing to see here </div>
        ) : (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentList;
