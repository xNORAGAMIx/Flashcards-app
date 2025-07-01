import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profile } from "../api/userAPI";
import { setProfile } from "../features/auth/authSlice";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleProfile = async () => {
      setLoading(true);
      try {
        const response = await profile(token);
        console.log(response.data);
        dispatch(
          setProfile({
            userId: response.data.userId,
            bio: response.data.bio,
            friends: response.data.friends,
          })
        );
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    handleProfile();
  }, [token, dispatch]);

  return (
    <div>
      {loading ? (
        <p>Loading please wait</p>
      ) : (
        <div>
          <h1>Profile</h1>
          <p>User ID: {user?.userId}</p>
          <p>Bio: {user?.bio}</p>
          <h2>Friends:</h2>
          <ul>
            {(user && user.friends).map(
              (friend, index) => (
                <li key={index}>{friend}</li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
