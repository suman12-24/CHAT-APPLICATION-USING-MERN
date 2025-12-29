import React, { useEffect } from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";
import { useSocketContext } from "../../context/SocketContext";

function Users() {
  const [allUsers, loading] = useGetAllUsers();
  console.log("all users: ", allUsers);
  const { onlineUsers } = useSocketContext();

  // Add CSS to hide scrollbar
  useEffect(() => {
    // Add a style tag to hide the scrollbar globally
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);

    // Clean up function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Sort users based on online status
  const sortedUsers = [...allUsers].sort((a, b) => {
    const isUserAOnline = onlineUsers.includes(a._id);
    const isUserBOnline = onlineUsers.includes(b._id);

    // If A is online and B is not, A comes first
    if (isUserAOnline && !isUserBOnline) return -1;
    // If B is online and A is not, B comes first
    if (!isUserAOnline && isUserBOnline) return 1;
    // If both have the same online status, maintain original order
    return 0;
  });

  return (
    <div>
      <h1 className="ml-2 mr-2 mt-1 px-6 py-2 text-white font-semibold bg-slate-800 rounded-md">
        Messages
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div
          className="py-2 flex-1 overflow-y-auto scrollbar-hide cursor-pointer"
          style={{
            maxHeight: "calc(84vh - 10vh)",
            scrollbarWidth: "none", /* Firefox */
            msOverflowStyle: "none", /* IE and Edge */

          }}
        >
          {sortedUsers.map((user, index) => (
            <User key={index} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;