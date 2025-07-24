import { useState, useEffect } from "react";

export default function Clock() {
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

  return (
    <>
      {clock ? (
        <p
          className="text-gray-400 text-sm mb-2.5"
          style={{ fontFamily: "'Comic Sans MS', cursive" }}>
          ⏰ {clock}
        </p>
      ) : (
        <div className="text-sm mb-2.5 flex">
          ⏰<p className="skeleton ml-1 h-5 w-30" />
        </div>
      )}
    </>
  );
}
