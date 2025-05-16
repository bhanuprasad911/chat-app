import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShipWheelIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { signup } from "../libs/services.js";
import PageLoader from "../components/PageLoader.jsx";

function Signuppage() {
  const queryClient = useQueryClient();
  const [formData, setFormdata] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    retry: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation(formData);
  };
  if (isPending) return <PageLoader />;

  return (
    <div className=" h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-purple-400 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/*Left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-3">
            <ShipWheelIcon className="size-10 text-purple-700" />
            <span className="text-4xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-red-300 tracking-wider">
              ChatYou..!
            </span>
          </div>
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-semibold">Create an account</h1>
                  <p className="text-sm opacity-70">
                    Join ChatYou and start your language learning adventure
                  </p>
                </div>
                <div className="space-y-3">
                  {/* Fullname */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Fullname</span>
                    </label>
                    <input
                      type="text"
                      name="Fullname"
                      placeholder="John doe"
                      className="input w-full input-bordered"
                      value={formData.fullname}
                      onChange={(e) =>
                        setFormdata({ ...formData, fullname: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/*EMAIL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="johndoe@example.com"
                      name="email"
                      className="input w-full input-bordered"
                      value={formData.email}
                      onChange={(e) =>
                        setFormdata({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter a password"
                      name="password"
                      className="input w-full input-bordered"
                      value={formData.password}
                      onChange={(e) =>
                        setFormdata({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <p className="text-xs opacity-70 mt-1">
                    password mus be 6 characters long
                  </p>
                  <div className="form-control w-full">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="checkbox-label">
                        I agree to the{" "}
                        <span className="text-purple-400 hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-purple-400 hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  className="btn bg-purple-400 w-full text-xl hover:bg-purple-600"
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <div className="text-center mt-4">
                  <p className="text-base">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-purple-400 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/*Right side */}
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

export default Signuppage;
