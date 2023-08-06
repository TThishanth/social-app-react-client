import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment/moment";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from "react-query";

const Post = ({ post }) => {

  const [commentOpen, setCommentOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(['likes', post.id], () =>
    
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })

  )

  const mutation = useMutation((liked) => {
    if(!liked) return makeRequest.post("/likes/add", { postId: post.id });
    return makeRequest.delete("/likes/remove?postId=" + post.id);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('likes')
    },
  });

  const handleLike = (e) => {
    e.preventDefault();

    mutation.mutate(data.includes(currentUser.id));

  }

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{ moment(post.createdAt).fromNow() }</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={ "./upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {data.includes(currentUser.id) 
              ? <FavoriteOutlinedIcon style={{ color: "red" }} onClick={ handleLike } /> 
              : <FavoriteBorderOutlinedIcon onClick={ handleLike } />
            }
            {data.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
