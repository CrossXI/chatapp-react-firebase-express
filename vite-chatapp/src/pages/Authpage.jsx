import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { ToastContainer, toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

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
      <div className="h-screen flex justify-center items-center text-white">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-lg">
          
          {/* Tabs */}
          <div className="flex mb-4 space-x-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 rounded-sm font-semibold transition-colors
              ${
                activeTab === "login"
                  ? "bg-[#fcb70c] text-gray-900"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}>
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 rounded-sm font-semibold transition-colors
              ${
                activeTab === "register"
                  ? "bg-[#fcb70c] text-gray-900"
                  : "bg-gray-900 text-gray-400 hover:text-white"
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
