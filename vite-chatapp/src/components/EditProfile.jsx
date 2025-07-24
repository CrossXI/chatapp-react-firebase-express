import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { ToastContainer, toast } from "react-toastify";

export default function EditProfile({ user, flag, setFlag }) {
  const [name, setName] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setName(snapshot.data().name || "");
      }
    };
    loadProfile();
  }, [user.uid]);

  // Save New Name
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "users", user.uid), { name }, { merge: true });
      setFlag(!flag);
      toast.info("Name Change!");
    } catch (error) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <fieldset className="chatContainer mt-4">
        <legend className="chatContainerLegend">⚙️ Name Setting</legend>
        <form className="join" onSubmit={handleSave}>
          <input
            type="text"
            className="input join-item bg-transparent rounded-l-md focus:border-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
          <button type="submit" className="btn join-item btn-soft btn-warning">
            Save
          </button>
        </form>
      </fieldset>
    </>
  );
}
