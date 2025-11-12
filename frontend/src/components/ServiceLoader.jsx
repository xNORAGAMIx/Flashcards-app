import { useEffect, useState } from "react";
import axios from "axios";

const services = [
  { name: "Auth", url: import.meta.env.VITE_API_AUTH_TEST },
  { name: "Study", url: import.meta.env.VITE_API_STUDY_TEST },
  { name: "Deck", url: import.meta.env.VITE_API_DECK_TEST },
  { name: "File", url: import.meta.env.VITE_API_FILE_TEST },
  { name: "Flashcard", url: import.meta.env.VITE_API_FLASHCARD_TEST },

  { name: "User", url: import.meta.env.VITE_API_USER_TEST },
];

export default function ServiceLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const pingServices = async () => {
      try {
        const results = await Promise.all(
          services.map(async (service) => {
            const res = await axios.get(service.url);
            return { name: service.name, status: res.data.status };
          })
        );

        const statusMap = {};
        results.forEach(({ name, status }) => {
          statusMap[name] = status;
        });

        const allUp = results.every((r) => r.status === "UP");
        setStatuses(statusMap);

        if (allUp) {
          setLoading(false);
        } else {
          setTimeout(pingServices, 2000);
        }
      } catch (err) {
        console.error("Service wake-up failed, retrying...", err);
        setTimeout(pingServices, 2000);
      }
    };

    pingServices();
  }, []);

  if (loading) {
    return (
      <div
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cloud.png')`,
        }}
      >
        {/* Animated blurred gradients */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[200px] top-[-100px] left-[-100px] animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[180px] bottom-[-120px] right-[-100px] animate-pulse" />
        </div>

        {/* Glassmorphism Loader Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 md:p-8 rounded-2xl shadow-xl w-[90%] max-w-md transition-all duration-500">
          <div className="flex flex-col items-center space-y-6">
            {/* Spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-t-green-400 border-b-purple-500 border-l-transparent border-r-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-green-400 text-sm animate-bounce">
                  ⚡
                </span>
              </div>
            </div>

            {/* Status text */}
            <p className="text-white text-center text-sm opacity-90 font-light">
              Waking up servers from sleep...
            </p>

            {/* Service status list */}
            <div className="w-full flex flex-col gap-2">
              {services.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between text-white font-bold text-sm px-3 py-2 bg-white/5 rounded-md border border-white/10 transition-colors duration-300"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        statuses[s.name] === "UP"
                          ? "bg-green-400"
                          : "bg-yellow-400 animate-pulse"
                      }`}
                    />
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <span className="text-xs opacity-70">
                    {statuses[s.name] === "UP" ? "Ready" : "Waking..."}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
