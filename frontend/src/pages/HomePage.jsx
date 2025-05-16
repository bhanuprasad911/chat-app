import React, { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFriends,
  getOutGoingFrndReqs,
  getRecommendations,
  sendFrndReq,
} from "../libs/services";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import NoFriends from "../components/NoFriends";
import FriendCard, { getFlag } from "../components/FriendCard";

function Homepage() {
  const queryClient = useQueryClient();
  const [outGoingRequests, setOutgoingRequests] = useState(new Set());
  const {
    data: friends = [],
    isPending: loadingFrnds,
    error,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { data: recommendations, isPending: loadingRecommendations } = useQuery(
    {
      queryKey: ["recommendedUsers"],
      queryFn: getRecommendations,
    }
  );

  const { data: outGOingFrndReqs } = useQuery({
    queryKey: ["outGoingRequests"],
    queryFn: getOutGoingFrndReqs,
  });

  const { mutate: sendFrndReqMutation, isLoading } = useMutation({
    mutationFn: sendFrndReq,
    onSuccess: () =>{
      console.log("executing outgoing")
      queryClient.invalidateQueries({ queryKey: ["outGoingRequests"] })},
    
  });

  useEffect(() => {
    console.log(outGOingFrndReqs)
    const OutGoingIds = new Set();
    if (outGOingFrndReqs && outGOingFrndReqs.length > 0) {
      console.log('in if')
      outGOingFrndReqs.forEach((req) => {
        OutGoingIds.add(req.receiver._id);
        console.log('outGoingIds', OutGoingIds)
      });
      setOutgoingRequests(OutGoingIds);
    }
    console.log('executing useeffect')
  }, [outGOingFrndReqs]);
  console.log(outGoingRequests)

  return (
    <div className="p-4 h-auto sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <UsersIcon className="size-4 mr-2" />
            Friend requests
          </Link>
        </div>
        {loadingFrnds ? (
          <div className="flex items-center gap-4">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriends />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend, index) => (
              <FriendCard key={index} friend={friend} />
            ))}
          </div>
        )}
        <div>
          <h2 className="font-semibold text-xl">Recommended users</h2>
        </div>
        <section>
          {loadingRecommendations ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="card bg-base-200 text-center py-4">
              <h3 className="font-semibold">No recommendations available</h3>
              <p className="text-base-content opacity-70 mt-4">
                Check back later for new people
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((user, index) => {
                
                const isOutGoing = outGoingRequests.has(user._id)
                return (
                  <div
                    key={index}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body space-y-5 p-5">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullname} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl">
                            {user.fullname}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />{" "}
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="badge bg-purple-400 text-white text-xs p-3">
                          {getFlag(user.nativeLang)}
                          Native: {capitalise(user.nativeLang)}
                        </span>
                        <span className="badge badge-outline text-xs p-3">
                          {getFlag(user.learningLang)}
                          Learning: {capitalise(user.learningLang)}
                        </span>
                      </div>
                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}
                      <button
                        className={`btn w-full ${
                          isOutGoing
                            ? "btn-disabled"
                            : "bg-purple-500 text-white"
                        }`}
                        onClick={() => {
                          sendFrndReqMutation(user._id);
                        }}
                        disabled={isLoading || isOutGoing}
                      >
                       {
                        isOutGoing? (
                          <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request sent
                          </>
                        ) :(
                          <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                          </>
                        )
                       }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Homepage;
const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
