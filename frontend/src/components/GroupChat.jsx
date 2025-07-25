import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

let socket;

const GroupChat = ({ groupId, userId, username }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    socket = io(import.meta.env.VITE_API_CHAT_URL);

    socket.emit("joinGroup", groupId);

    fetch(`${import.meta.env.VITE_API_CHAT_URL}/api/chat/${groupId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [groupId, isAuthenticated]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      groupId,
      senderId: userId,
      senderName: username,
      message: input,
    };

    socket.emit("sendMessage", newMsg);
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="w-full max-w-4xl mx-auto flex flex-col h-[500px] rounded-2xl backdrop-blur-sm bg-white/10 dark:bg-zinc-900/50  overflow-hidden transition-all dark:shadow-2xl shadow-[0_0_30px_rgba(59,130,246,0.2),0_0_30px_rgba(34,211,238,0.2)]
 "
    >
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs px-4 py-2 rounded-xl backdrop-blur-md shadow-md text-sm ${
              msg.senderId === userId
                ? "ml-auto bg-gradient-to-br from-blue-500/80 to-indigo-600/80 text-white shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                : "mr-auto bg-white/10 border border-white/10 text-white"
            }`}
          >
            <div className="font-semibold mb-1">{msg.senderName}</div>
            <div>{msg.message}</div>
            <div className="text-xs mt-1 text-right opacity-70">
              {new Date(msg.sentAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="px-5 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow hover:opacity-90 transition ring-1 ring-white/10 hover:ring-2 hover:ring-blue-400/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
