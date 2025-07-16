import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Chat from "../components/Chat";
import EditProfile from "../components/EditProfile";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";

export default function Chatpage() {
  const [user, setUser] = useState(null);
  const [flag, setFlag] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged Out!");
  };

  return (
    <>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <p className="">Welcome, {user.email}</p>
          <button onClick={handleLogout} className="btn btn-soft btn-error">
            Logout
          </button>
        </div>
        <div className="divider" />
        <Chat user={user} flag={flag} />
        <EditProfile user={user} flag={flag} setFlag={setFlag} />
      </div>
    </>
  );
}
