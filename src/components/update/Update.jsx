import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "react-query";

function Update({setOpenUpdate, user}) {

    const [ cover, setCover ] = useState(null);
    const [ profile, setProfile ] = useState(null);
    const [ inputs, setInputs ] = useState({
        name: "",
        city: "",
        website: "",
    });
    
    const queryClient = useQueryClient();

    const upload = async (file) => {
        try {
          
          const formData = new FormData();
          formData.append("file", file);
    
          const res = await makeRequest.post("/upload", formData);
          return res.data;
    
    
        } catch (err) {
          console.log(err);
        }
    }
    
    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [ e.target.name ]: e.target.value }));
    }

    const mutation = useMutation((user) => {
        return makeRequest.put("/users/update", user);
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries('user')
        },
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        let coverUrl = user.coverPic;
        let profileUrl = user.profilePic;
        if(cover) coverUrl = await upload(cover);
        if(profile) profileUrl = await upload(profile);
    
        mutation.mutate({ ...inputs, coverPic: coverUrl, profilePic: profileUrl });
    
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
    }

    return (
        <div className="update">
            <button onClick={() => setOpenUpdate(false)}>x</button>

            <form>
                <input type="file" onChange={ (e) => setCover(e.target.files[0]) } />
                <input type="file" onChange={ (e) => setProfile(e.target.files[0]) } />
                <input type="text" name="name" onChange={ handleChange } />
                <input type="text" name="city" onChange={ handleChange } />
                <input type="text" name="website" onChange={ handleChange } />
                <button onClick={ handleUpdate }>Update</button>
            </form>
        </div>
    )
}

export default Update