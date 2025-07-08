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

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userMap, setUserMap] = useState({});
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [clock, setClock] = useState("");

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

  // 👤 Fetch users for display
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
  }, []);

  // ✅ Send Text Message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, "messages"), {
      text,
      createdAt: serverTimestamp(),
      uid: user.uid,
      email: user.email,
    });
    setText("");
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

  // 📷 Send Image
  const handleSendImage = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await res.json();
      await addDoc(collection(db, "messages"), {
        type: "image",
        url,
        createdAt: serverTimestamp(),
        uid: user.uid,
        email: user.email,
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // 💬 Render a single message
  const renderMessage = (msg) => {
    const isMine = msg.uid === user.uid;
    return (
      <div
        key={msg.id}
        style={{
          display: "flex",
          justifyContent: isMine ? "flex-end" : "flex-start",
          position: "relative",
          marginBottom: 8,
        }}>
        <div
          style={{
            background: isMine ? "#dcf8c6" : "#f1f0f0",
            color:"#000",
            padding: 10,
            borderRadius: 8,
            maxWidth: "70%",
            textAlign: isMine ? "right" : "left",
            position: "relative",
          }}>
          <strong>{userMap[msg.uid] || "Unknown"}:</strong>
          <div>
            {editingMessageId === msg.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ width: "90%" }}
                />
                <button onClick={() => handleEdit(msg.id)}>Save</button>
                <button onClick={() => setEditingMessageId(null)}>
                  Cancel
                </button>
              </>
            ) : msg.type === "image" ? (
              <img
                src={msg.url}
                alt="sent"
                style={{ maxWidth: "100%", marginTop: 5, borderRadius: 5 }}
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
                style={{
                  position: "absolute",
                  right: 5,
                  top: 5,
                  cursor: "pointer",
                }}>
                ⋮
              </div>
              {openMenuId === msg.id && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 25,
                    background: "#eee",
                    padding: 4,
                    borderRadius: 4,
                    zIndex: 1,
                  }}>
                  <div
                    onClick={() => {
                      setEditingMessageId(msg.id);
                      setEditText(msg.text);
                      setOpenMenuId(null);
                    }}
                    style={{ cursor: "pointer" }}>
                    ✏️ Edit
                  </div>
                  <div
                    onClick={() => {
                      handleDelete(msg.id);
                      setOpenMenuId(null);
                    }}
                    style={{
                      cursor: "pointer",
                      color: "red",
                      marginTop: 4,
                    }}>
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
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <p className="text-lg">💬 Chat Room</p>
      <p
        style={{
          fontFamily: "'Comic Sans MS', cursive",
          fontSize: "14px",
          color: "#555",
          marginBottom: "10px",
        }}>
        ⏰ {clock}
      </p>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "scroll",
          marginBottom: 10,
        }}>
        {messages.map(renderMessage)}
      </div>

      {imagePreview && (
        <div style={{ marginBottom: 10 }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "200px", borderRadius: 8 }}
          />
          <br />
          <button onClick={handleSendImage} style={{ marginTop: 5 }}>
            Send Image
          </button>
          <button
            onClick={() => {
              setImageFile(null);
              setImagePreview("");
            }}
            style={{ marginLeft: 5, color: "red" }}>
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "75%", padding: 8 }}
        />
        <input type="file" accept="image/*" onChange={handleFileSelect} />
        <button type="submit" style={{ padding: 8 }}>
          Send
        </button>
      </form>
    </div>
  );
}
