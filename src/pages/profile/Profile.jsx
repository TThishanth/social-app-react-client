import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery('user', () =>
    
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })

  )

  const { isLoading: rIsLoading, data: relationshipData } = useQuery('relationships', () =>
    
    makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
      return res.data;
    })

  )

  const mutation = useMutation((followed) => {
    if(!followed) return makeRequest.post("/relationships/add", { userId: userId });
    return makeRequest.delete("/relationships/remove?userId=" + userId);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('relationships')
    },
  });

  const handleFollow = (e) => {
    e.preventDefault();

    mutation.mutate(relationshipData.includes(currentUser.id));
  }

  if (isLoading) return 'Loading...'

  if (rIsLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="profile">
      <div className="images">
        <img
          src={ data.coverPic }
          alt=""
          className="cover"
        />
        <img
          src={ data.profilePic }
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{ data.name }</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{ data.city }</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{ data.website }</span>
              </div>
            </div>
            { userId === currentUser.id 
              ? (<button>Update</button>) 
              : (<button onClick={ handleFollow }>
                  { relationshipData.includes(currentUser.id) ? "Following" : "Follow" }
                </button>) 
            }
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts userId={userId} />
      </div>
    </div>
  );
};

export default Profile;
