import Left from "./home/Leftpart/Left";
import Right from "./home/Rightpart/Right";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import SubLeftPart from "./home/SubLeftPart/SubLeftPart";

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log("Auth User:-", authUser);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className="flex h-screen">
                {/* SubLeft Panel - Always visible on desktop */}
                <div className="hidden lg:block">
                  <SubLeftPart />
                </div>

                {/* Main Layout with Drawer for Mobile */}
                <div className="drawer lg:drawer-open flex-1">
                  <input
                    id="my-drawer-2"
                    type="checkbox"
                    className="drawer-toggle"
                  />
                  <div className="drawer-content flex flex-col items-center justify-center">
                    <Right />
                  </div>
                  <div className="drawer-side">
                    <label
                      htmlFor="my-drawer-2"
                      aria-label="close sidebar"
                      className="drawer-overlay"
                    ></label>

                    {/* Mobile: SubLeft + Left combined */}
                    <div className="flex lg:hidden">
                      <SubLeftPart />
                      <div className="w-80 min-h-full bg-black text-base-content">
                        <Left />
                      </div>
                    </div>

                    {/* Desktop: Only Left panel (SubLeft is separate) */}
                    <div className="hidden lg:block w-100 min-h-full bg-black text-base-content">
                      <Left />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
