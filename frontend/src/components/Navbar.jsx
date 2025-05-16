import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { QueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logout } from "../libs/services";
import { Link, useLocation, useNavigate } from "react-router";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";




function Navbar() {
  const navigate= useNavigate()
  const { authUser } = useAuthUser();
  const queryClient = new QueryClient();
  const { mutate:logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully!");
      navigate("/login");
      
    },
  });

  const location = useLocation()
  const isChatPage = location.pathname.startsWith('/chat')

  return <nav className="bg-purple-500 border-b sticky top-0 z-30 h-16  flex items-center">
    <div className="container mx-auto px-4 s:px-6 lg:px-8">
      <div className="flex items-center justify-end w-full">
        {
          isChatPage && <div className="pl-5">
            <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-10 text-purple-700" />
          <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-300 tracking-wider">
            ChatYou..!
          </span>
        </Link>
          </div>
        }
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <Link to='/notification'>
          <button className="btn btn-ghost btn-circle">
            <BellIcon className="size-6 text-base-content opacity-70" />
          </button>
          </Link>
        </div>
        <ThemeSelector />
        <div className="avatar">
          <div className="rounded-full w-9">
            <img src={authUser?.profilePic} alt="profile" rel="noreferrer" />
          </div>
        </div>
        <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
          <LogOutIcon className="sixe-6 text-base-content opacity-70"/>
        </button>
      </div>
    </div>

  </nav>;
}

export default Navbar;
