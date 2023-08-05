import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from 'react-query';
import { makeRequest } from "../../axios";

const Share = () => {

  const [ file, setFile ] = useState(null);
  const [ description, setDescription ] = useState("");

  const {currentUser} = useContext(AuthContext);

  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      
      const formData = new FormData();
      formData.append("file", file);

      const res = await makeRequest.post("/upload", formData);
      return res.data;


    } catch (err) {
      console.log(err);
    }
  }

  const mutation = useMutation((post) => {
    return makeRequest.post("/posts/add", post);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
    },
  });

  const handleAddPost = async (e) => {
    e.preventDefault();

    let imgUrl = "";
    if(file) imgUrl = await upload();

    mutation.mutate({ description, img: imgUrl });

    setDescription("");
    setFile(null);
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
              <img
                src={currentUser.profilePic}
                alt=""
              />
              <input type="text" placeholder={`What's on your mind ${currentUser.name}?`} value={description} onChange={ (e) => setDescription(e.target.value) } />
          </div>
          <div className="right">
              { file && <img className="file" src={ URL.createObjectURL(file) } alt="Image" /> }
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={ (e) => setFile(e.target.files[0]) } />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={ handleAddPost }>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
