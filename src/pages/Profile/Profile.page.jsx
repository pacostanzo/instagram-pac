import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getUserByUsername } from '../../services/firebase';
import * as ROUTES from '../../constants/routes';
import Header from '../../components/Header';
import useUser from '../../hooks/use-user';
import LoggedInUserContext from '../../context/logged-in-user';
import UserProfile from '../../components/Profile';

const Profile = ({ user: loggedInUser }) => {
  const { username } = useParams();
  const [userExists, setUserExists] = useState(false);
  const history = useHistory();
  const { user, setActiveUser } = useUser(loggedInUser.uid);
  const [currentProfileUser, setCurrentProfileUser] = useState(null);

  useEffect(() => {
    async function checkUserExists() {
      const profileUser = await getUserByUsername(username);
      if (profileUser.length > 0) {
        setUserExists(true);
        document.title = profileUser[0].fullName;
        setCurrentProfileUser(profileUser[0]);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, history]);

  return (
    <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
      <div className="bg-gray-background">
        <Header />
        {userExists && currentProfileUser ? (
          <div className="mx-auto max-w-screen-lg">
            <UserProfile user={currentProfileUser} />
          </div>
        ) : null}
      </div>
    </LoggedInUserContext.Provider>
  );
};
export default Profile;
