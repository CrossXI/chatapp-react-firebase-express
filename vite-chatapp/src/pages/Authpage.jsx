import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import AuthForm from "../components/AuthForm";

export default function Authpage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [fmInput, setFmInput] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "login") {
        await signInWithEmailAndPassword(auth, fmInput.email, fmInput.password);
        toast.success("Logged In!");
        setFmInput({ email: "", password: "" });
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 300);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          fmInput.email,
          fmInput.password
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: fmInput.email,
          name: "",
        });
        toast.success("Account created!");
        setFmInput({ email: "", password: "" });
        setActiveTab("login");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="authContainer">
        <div className="authCard">
          
          {/* Tabs */}
          <div className="authTab">
            <button
              onClick={() => setActiveTab("login")}
              className={`authTabMethod
              ${activeTab === "login" ? "tab_Selected" : "tab_NotSelected"}`}>
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`authTabMethod
              ${
                activeTab === "register" ? "tab_Selected" : "tab_NotSelected"
              }`}>
              Register
            </button>
          </div>

          {/* Active Form */}
          {activeTab === "login" ? (
            <AuthForm
              fmInput={fmInput}
              setFmInput={setFmInput}
              handleSubmit={handleSubmit}
              title={"Login"}
            />
          ) : (
            <AuthForm
              fmInput={fmInput}
              setFmInput={setFmInput}
              handleSubmit={handleSubmit}
              title={"Register"}
            />
          )}
        </div>
      </div>
    </>
  );
}
