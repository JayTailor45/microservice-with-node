import React from "react";

const PostCreate = () => {
  return (
    <div>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" />
        </div>
      </form>
      <button className="btn btn-primary">Submit</button>
    </div>
  );
};

export default PostCreate;
