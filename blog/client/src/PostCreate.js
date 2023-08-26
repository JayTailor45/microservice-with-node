import React, { useState } from "react";
import axios from "axios";

import { POSTS_SERVICE_HOST } from "./urls.const";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(POSTS_SERVICE_HOST + "/posts/create", {
        title,
      });
      setTitle("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </form>
      <button className="btn btn-primary" type="submit" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

export default PostCreate;
