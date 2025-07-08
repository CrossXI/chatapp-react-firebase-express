import { useEffect } from "react";
export default function RainbowCursor() {
useEffect(() => {
  const cursor = document.getElementById("rainbow-cursor");
  const move = (e) => {
    const size = 96; // w-24 in px
    cursor.style.transform = `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2}px)`;
  };
  window.addEventListener("mousemove", move);
  return () => window.removeEventListener("mousemove", move);
}, []);


  return (
<div
  id="rainbow-cursor"
  className="pointer-events-none fixed w-32 h-32 rounded-full z-[-1]
             bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500 
             opacity-50 blur-3xl transition-transform duration-75"
></div>

  );
}
