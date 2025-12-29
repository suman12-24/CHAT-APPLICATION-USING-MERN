
import Search from "./Search";
import Users from "../LeftPart/Users";

function Left() {
  return (
    <div className="w-full bg-black text-gray-300">
      <Search />
      <div
        className="flex-1 overflow-y-auto mt-1"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        <Users />
      </div>
      {/* <Logout /> */}
    </div>
  );
}

export default Left;