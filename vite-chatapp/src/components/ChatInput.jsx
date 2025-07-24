import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function ChatInput({ user }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ✅ Send Text Message
  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageFile) {
      return toast.error("Please enter the message");
    }

    let imageUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const res = await axios.post("http://localhost:4000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = res.data.url;
      } catch (err) {
        console.error("Image upload failed:", err);
        return toast.error("Image upload failed");
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

    setText("");
    setImageFile(null);
    setImagePreview("");

    try {
      await addDoc(collection(db, "messages"), messageData);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    }
  };

  // 📁 File Selection & Preview
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <form className="flex" onSubmit={handleSend}>
        <div className="chatInputDiv">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="chatInputField"
          />
          <label className="chatInputFile">
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
          className="btn btn-soft btn-warning rounded-r-md rounded-l-none">
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
            className="fileCancel"
            onClick={() => {
              setImageFile(null);
              setImagePreview("");
            }}>
            Cancel
          </div>
        </div>
      )}
    </>
  );
}
