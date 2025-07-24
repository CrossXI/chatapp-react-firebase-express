import { useEffect, useRef, useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Message({ msg, isMine, username }) {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef();

  // ✏️ Edit Message
  const handleEdit = async () => {
    try {
      await updateDoc(doc(db, "messages", msg.id), { text: editText });
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      toast.error("Error editing message:", error);
    }
  };

  // 🗑️ Delete Message (and image if needed)
  const handleDelete = async () => {
    try {
      if (msg?.type === "image") {
        await axios.post("http://localhost:4000/delete-image", {
          url: msg.url,
        });
      }
      await deleteDoc(doc(db, "messages", msg.id));
    } catch (error) {
      toast.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (
        openMenuId === msg.id &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [openMenuId, msg.id]);

  return (
    <div className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative p-3 rounded-lg max-w-[70%] text-sm text-black ${
          isMine ? "bg-green-200 text-right" : "bg-gray-200 text-left"
        }`}>
        <strong className="block mb-1 mr-6">{username || "Unknown"}</strong>

        <div>
          {editingMessageId === msg.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-[90%] p-1 border border-gray-400 rounded"
              />
              <button onClick={handleEdit} className="ml-2 text-blue-600">
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
              <div
                ref={menuRef} // ✅ only wrap the popup menu!
                className="absolute top-8 right-0 bg-white shadow-md border p-2 rounded-md z-10 w-[82px]">
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
                    handleDelete();
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
}
