import React, { useEffect, useState } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import Typesend from "./Typesend";
import useConversation from "../../zustand/useConversation.js";
import { useAuth } from "../../context/AuthProvider.jsx";
import { CiMenuFries } from "react-icons/ci";
import { MessageSquare, Users, Smile, ArrowRight } from "lucide-react";

function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  useEffect(() => {
    return setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="w-full bg-slate-900 text-gray-300">
      <div>
        {!selectedConversation ? (
          <NoChatSelected />
        ) : (
          <>
            <Chatuser />
            <div
              className="flex-1 overflow-y-auto"
              style={{ maxHeight: "calc(92vh - 8vh)" }}
            >
              <Messages />
            </div>
            <Typesend />
          </>
        )}
      </div>
    </div>
  );
}

export default Right;

const NoChatSelected = () => {
  const [authUser] = useAuth();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900 text-gray-300">
      {/* Mobile menu button - adjusted position to account for SubLeftPanel */}
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden absolute left-5 top-5 z-10"
      >
        <CiMenuFries className="text-white text-xl" />
      </label>

      {/* Welcome content */}
      <div className="flex flex-col items-center justify-center h-screen px-4 py-10">
        <div
          className={`bg-slate-800 rounded-xl shadow-lg max-w-md w-full mx-auto p-8 transition-all duration-700 ease-out ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="flex justify-center mb-6">
            <div className={`h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold transition-all duration-1000 delay-300 ${animate ? "scale-100" : "scale-0"
              }`}>
              {authUser?.user?.fullname?.charAt(0) || "U"}
            </div>
          </div>

          <h1 className={`text-center text-2xl font-bold mb-2 transition-all duration-500 delay-500 ${animate ? "opacity-100" : "opacity-0"
            }`}>
            Welcome <span className="text-blue-400">{authUser?.user?.fullname}</span>
          </h1>

          <p className={`text-center text-gray-400 mb-8 transition-all duration-500 delay-700 ${animate ? "opacity-100" : "opacity-0"
            }`}>
            Select a conversation to start chatting
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { icon: <MessageSquare className="mb-2" />, text: "Send messages" },
              { icon: <Users className="mb-2" />, text: "Connect with friends" },
              { icon: <Smile className="mb-2" />, text: "Share moments" }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-slate-700 p-4 rounded-lg text-center transition-all duration-500 hover:bg-slate-600 cursor-pointer ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
              >
                {feature.icon}
                <p className="text-sm">{feature.text}</p>
              </div>
            ))}
          </div>

          <div className={`flex items-center justify-center mt-8 text-blue-400 transition-all duration-500 delay-1500 ${animate ? "opacity-100" : "opacity-0"
            }`}>
            <p className="mr-2">Select a contact to start</p>
            <ArrowRight className="animate-pulse" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};