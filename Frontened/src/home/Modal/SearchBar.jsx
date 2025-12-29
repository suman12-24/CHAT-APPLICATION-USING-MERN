import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

function SearchBar({ onSubmit }) {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    
    const isSuccess = onSubmit(search);
    
    if (isSuccess) {
      setSearch("");
    } else {
      toast.error("User not found", {
        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "8px",
        },
        icon: "🔍",
      });
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-grow lg:max-w-md xl:max-w-lg transition-all duration-300"
    >
      <div className={`relative group ${isFocused ? "" : ""}`}>
        <div className={`
          flex items-center rounded-xl overflow-hidden
          ${isFocused ? "bg-slate-700" : "bg-slate-900"}
          border ${isFocused ? "border-indigo-500" : "border-gray-600"}
          transition-all duration-300 hover:border-gray-400
        `}>
          <span className="pl-4 text-gray-400">
            <BiSearch className="text-xl" />
          </span>

          <input
            type="text"
            className="w-full py-3 px-3 outline-none bg-transparent text-gray-100 placeholder-gray-400"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="pr-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              <IoMdClose className="text-xl" />
            </button>
          )}

          <button
            type="submit"
            className={`
              flex items-center justify-center h-full px-2 py-2 md:py-3
              bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
              text-white transition-colors duration-300
              text-sm rounded-r-xl
            `}
            title="Search"
          >
            <BiSearch className="text-lg" />
          </button>
        </div>

        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </form>
  );
}

export default SearchBar;