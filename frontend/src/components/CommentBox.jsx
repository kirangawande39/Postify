import { useState, useContext, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "../assets/css/CommentBox.css";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthContext } from "../context/AuthContext";
import { MdDeleteForever } from "react-icons/md";

dayjs.extend(relativeTime);

const CommentBox = ({ postId }) => {
  const { user , updateUser } = useContext(AuthContext);
  const token = user?.token || localStorage.getItem("token");

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
        console.log("Fetched Comments:", res.data.comments);
        setComments(res.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${postId}`,
        { newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentDelete=async(commentId)=>{
    alert("Comment is here");
      try {
      const res=await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`);
        
      // setComments([...comments, res.data]);
      // setNewComment("");
      alert(res.data.message);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  
  };

  return (
    <div className="comment-box">
      <div className="comments-list">
        {comments.slice(0).reverse().map((comment) => (
          <div key={comment._id} className="comment">
            <img
              src={comment.user?.profilePic || user.profilePic}
              alt="Profile"
              className="comment-profile-pic"
            />
            <div className="comment-content">
              <div className="comment-header">
                <strong>{comment.user?.username || user.username}</strong>
                <span className="comment-time">{dayjs(comment.createdAt).fromNow()}</span>
                {comment.user._id === user.id ?
                  <div className="comment-delete-btn">
                   <spam onClick={()=>handleCommentDelete(comment._id)}>
                   <MdDeleteForever/>
                    </spam>
                </div>
                 :
                 " "
                 }
               
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <img
             src={user.profilePic || updateUser.profilePic ||  "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
             alt="Profile"
             className="comment-profile-pic"
           />
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit" title="Send">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
