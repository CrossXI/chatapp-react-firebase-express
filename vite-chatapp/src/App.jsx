import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Chat from "./components/Chat";
import EditProfile from "./components/EditProfile";
import AuthTabs from "./components/AuthTab";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
     
      <div style={{ padding: 20 }}>
        {user ? (
          <>
            <p>Welcome, {user.email}</p>
            <button onClick={() => signOut(auth)}>Logout</button>
            <EditProfile user={user} />
            <Chat user={user} />
          </>
        ) : (
          <>
            <AuthTabs />
          </>
        )}
      </div>
    </>
  );
}

export default App;
