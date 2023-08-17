import React, { useState, useEffect } from "react";
import axios from "axios";
import { COMMENTS_SERVICE_HOST } from "./urls.const";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${COMMENTS_SERVICE_HOST}/posts/${postId}/comments`
      );
      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
