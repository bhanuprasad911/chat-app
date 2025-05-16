import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { login } from "../libs/services";
import toast from "react-hot-toast";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";


function Loginpage() {
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged in successfully!");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formdata);
  };
  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-purple-300 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-300 rounded-xl shadow-xl overflow-hidden">
        {/*Login form*/}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/*logo*/}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-purple-700" />
            <span className="text-4xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-red-300 tracking-wider">
              ChatYou..!
            </span>
          </div>
          {/*ERRORS*/}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold"> Welcome back..!</h2>
                  <p className="text-sm opacity-70">Login and continue chatting</p>
                </div>
                <div className="flex flex-col gap-3">
                  {/*EMAIL*/}
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="johndoe@example.com"
                      name="email"
                      value={formdata.email}
                      className="input w-full input-bordered"
                      onChange={(e)=> setFormdata({...formdata, email: e.target.value })}
                      required
                      />

                  </div>
                  {/*PASSWORD*/}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={formdata.password}
                      className="input w-full input-bordered"
                      onChange={(e)=> setFormdata({...formdata, password: e.target.value })}
                      required
                    />
                  </div>
                  {/*LOGIN*/}
                  <button className="btn bg-purple-500 w-full" disabled={isPending}>
                    {isPending?(
                      <>
                       <span className="loading loading-spinner loading-sm"></span>
                        Logging in..
                      </>
                    ):(
                      "Login"
                    )}
                  </button>
                  <div className="text-center mt-4">
                  <p className="text-base">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-purple-400 hover:underline"
                    >
                      Signup
                    </Link>
                  </p>
                </div>

                </div>

              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/20 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/signup.png"
                alt="Language learning illustrator"
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners world wide
              </h2>
              <p className="opacity-70">
                Practice conversation, learn, and share your language skills
                with others
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
