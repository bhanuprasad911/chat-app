import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUser } from "../libs/services";
import { CameraIcon, LoaderIcon, MapIcon, MapPinIcon, ShipWheel, ShipWheelIcon, ShuffleIcon, WholeWord } from "lucide-react";
import { LANGUAGES } from "../constants/index.js";

function OnboardingPage() {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [formData, setFormData] = useState({
    fullname: authUser?.fullname || "",
    profilePic: authUser?.profilePic || "",
    bio: authUser?.bio || "",
    learningLang: authUser?.learningLang || "",
    nativeLang: authUser?.nativeLang || "",
    location: authUser?.location || "",
  });
  const {
    mutate: onboardingMutation,
    isPending,
    Error,
  } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User onboarded successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError:(error)=>{
      console.log(error);
      toast.error(error.response.data.message)
    }
  });
  const generateRandomAvatar = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    const randAvatar = `https://avatar.iran.liara.run/public/${randomNum}.png`;
    setFormData({ ...formData, profilePic: randAvatar });
    toast.success("Random avatar generated successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formData);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-300 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete your profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/*PROFILE PIC*/}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="size-28 rounded-full bg-base-300 overflow-hidden">
                {formData.profilePic ? (
                  <img
                    className="w-full h-full object-cover"
                    src={formData.profilePic}
                    alt="Profile Pic"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              {/* Generate random avataar button*/}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary text-sm"
                  onClick={generateRandomAvatar}
                >
                  <ShuffleIcon className="size-3 mr-2" />
                  Generate random avatar
                </button>
              </div>
            </div>
            {/*FULLNAME*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                className="input w-full input-bordered"
                placeholder="Your full name"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>
            {/*BIO*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                className="input w-full input-bordered h-20"
                placeholder="Tell about yourself"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
            {/*LANGUAGES*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/*Native language*/}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native language</span>
                </label>
                <select
                  name="nativeLang"
                  onChange={(e) => {
                    setFormData({ ...formData, nativeLang: e.target.value });
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang, index) => (
                    <option key={index} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              {/*Learning language*/}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning language</span>
                </label>
                <select
                  name="learningLang"
                  onChange={(e) => {
                    setFormData({ ...formData, learningLang: e.target.value });
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang, index) => (
                    <option key={index} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/*LOCATION*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  className="input w-full input-bordered pl-10"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>
            <button className="btn bg-purple-500 text-white w-full" disabled={isPending}>
              {!isPending?(
                <>
                <ShipWheelIcon className="size-5 mr-2"/>
                Complete onboarding
                </>
              ):(
                <>
                <LoaderIcon className="animate-spin size-5 mr-2"/>
                loading...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
