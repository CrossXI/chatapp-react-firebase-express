import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc,setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function EditProfile({ user }) {
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
    await setDoc(doc(db, "users", user.uid), { name }, { merge: true });
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <h3>Edit Profile</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <button type="submit">Save</button>
      </form>
    </>
  );
}
