import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../config/firebase";

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
      <fieldset className="fieldset bg-gray-800 border-none rounded-lg mt-4 p-4 w-full md:max-w-3/4 lg:max-w-1/3 m-auto">
        <legend className="fieldset-legend text-lg">⚙️ Name Setting</legend>
        <form className="join" onSubmit={handleSave}>
          <input
            type="text"
            className="input join-item bg-gray-800 rounded-l-md"
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
