import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Clock from "./Clock";
import Message from "./Message";
import ChatInput from "./ChatInput";

export default function ChatRoom({ user, flag }) {
  const [messages, setMessages] = useState([]);
  const [userMap, setUserMap] = useState({});

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

  return (
    <>
      <fieldset className="chatContainer">
        <legend className="chatContainerLegend">💬 Chat Room</legend>
        <Clock />
        <div className="chatRoom">
          {messages.length === 0 ? (
            <>
              <div className="flex h-full justify-center items-center">
                <span className="loading loading-spinner text-warning loading-xl" />
              </div>
            </>
          ) : (
            messages.map((msg) => (
              <Message
                key={msg.id}
                msg={msg}
                isMine={msg.uid === user.uid}
                username={userMap[msg.uid]}
              />
            ))
          )}
        </div>
        <ChatInput user={user} />
      </fieldset>
    </>
  );
}
