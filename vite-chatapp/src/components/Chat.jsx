import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export default function Chat({ user, flag }) {
  const [clock, setClock] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userMap, setUserMap] = useState({});
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // 🕒 Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleString("sv-SE").replace(" ", " [") + "]";
      setClock(formatted);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📩 Real-time messages
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 👤 Load user map
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const map = {};
      snapshot.forEach((doc) => {
        map[doc.id] = doc.data().name || doc.data().email;
      });
      setUserMap(map);
    };
    fetchUsers();
  }, [flag]);

  // ✅ Send Text Message
  const handleSend = async (e) => {
    e.preventDefault();

    // Prevent empty submission
    if (!text.trim() && !imageFile) return;

    let imageUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const res = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.url;
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }

    const messageData = {
      createdAt: serverTimestamp(),
      uid: user.uid,
      email: user.email,
    };

    if (text.trim()) {
      messageData.text = text.trim();
    }

    if (imageUrl) {
      messageData.type = "image";
      messageData.url = imageUrl;
    }

    await addDoc(collection(db, "messages"), messageData);

    setText("");
    setImageFile(null);
    setImagePreview("");
  };

  // 🗑️ Delete Message (and image if needed)
  const handleDelete = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (msg?.type === "image") {
      await fetch("http://localhost:4000/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: msg.url }),
      });
    }
    await deleteDoc(doc(db, "messages", id));
  };

  // ✏️ Edit Message
  const handleEdit = async (id) => {
    await updateDoc(doc(db, "messages", id), { text: editText });
    setEditingMessageId(null);
    setEditText("");
  };

  // 📁 File Selection & Preview
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 💬 Render a single message
  const renderMessage = (msg) => {
    const isMine = msg.uid === user.uid;

    return (
      <div
        key={msg.id}
        className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}>
        <div
          className={`relative p-3 rounded-lg max-w-[70%] text-sm text-black ${
            isMine ? "bg-green-200 text-right" : "bg-gray-200 text-left"
          }`}>
          <strong className="block mb-1 mr-6">
            {userMap[msg.uid] || "Unknown"}
          </strong>
          <div>
            {editingMessageId === msg.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-[90%] p-1 border border-gray-400 rounded"
                />
                <button
                  onClick={() => handleEdit(msg.id)}
                  className="ml-2 text-blue-600">
                  Save
                </button>
                <button
                  onClick={() => setEditingMessageId(null)}
                  className="ml-2 text-gray-600">
                  Cancel
                </button>
              </>
            ) : msg.type === "image" ? (
              <img
                src={msg.url}
                alt="sent"
                className="mt-2 rounded-md max-w-full"
              />
            ) : (
              <span>{msg.text}</span>
            )}
          </div>

          {isMine && (
            <>
              <div
                onClick={() =>
                  setOpenMenuId(openMenuId === msg.id ? null : msg.id)
                }
                className="absolute top-2 right-2 text-lg cursor-pointer">
                ⋮
              </div>
              {openMenuId === msg.id && (
                <div className="absolute top-8 right-0 bg-white shadow-md border p-2 rounded-md z-10">
                  <div
                    onClick={() => {
                      setEditingMessageId(msg.id);
                      setEditText(msg.text);
                      setOpenMenuId(null);
                    }}
                    className="cursor-pointer hover:text-blue-600">
                    ✏️ Edit
                  </div>
                  <div
                    onClick={() => {
                      handleDelete(msg.id);
                      setOpenMenuId(null);
                    }}
                    className="cursor-pointer text-red-500 mt-1">
                    🗑️ Delete
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <fieldset className="fieldset bg-gray-800 border-none rounded-lg p-4 w-full md:max-w-3/4 lg:max-w-1/3 m-auto">
        <legend className="fieldset-legend text-lg">💬 Chat Room</legend>
        <p
          className="text-gray-400 text-sm mb-2.5"
          style={{ fontFamily: "'Comic Sans MS', cursive" }}>
          ⏰ {clock}
        </p>
        <div className="rounded-md bg-[#101828] border border-gray-600 overflow-y-scroll mb-[10px] h-[300px] p-[10px]">
          {messages.map(renderMessage)}
        </div>

        <form className="flex" onSubmit={handleSend}>
          <div className="flex w-full max-w-[320px]! rounded-l-md overflow-hidden border border-gray-600">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 bg-transparent focus:outline-none"
            />
            <label className="cursor-pointer px-4 border-l border-gray-600 bg-gray-800 text-lg content-center">
              📎
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-soft btn-warning rounded-r-md! rounded-l-none!">
            Sent
          </button>
        </form>

        {imagePreview && (
          <div className="mb-[10px]">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-[200px] rounded-md"
            />
            <br />
            <div
              className="badge badge-soft badge-error cursor-pointer"
              onClick={() => {
                setImageFile(null);
                setImagePreview("");
              }}>
              Cancel
            </div>
          </div>
        )}
      </fieldset>
    </>
  );
}
