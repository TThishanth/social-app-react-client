import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {

  const [ description, setDescription ] = useState("");

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();
  
  const { isLoading, error, data } = useQuery('comments', () =>
    
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })

  )

  const mutation = useMutation((comment) => {
    return makeRequest.post("/comments/add", comment);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments')
    },
  });

  const handleAddComment = async (e) => {
    e.preventDefault();

    mutation.mutate({ description, postId });

    setDescription("");
  }

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" value={description} onChange={ (e) => setDescription(e.target.value) } />
        <button onClick={ handleAddComment }>Send</button>
      </div>
      {data.map((comment) => (
        <div className="comment">
          <img src={comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p> 
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
