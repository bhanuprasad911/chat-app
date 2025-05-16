import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { acceptFrndReq, getFrndReqs } from "../libs/services";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

function Notificationpage() {
  const queryClient = useQueryClient();

  const { data: friendrequests, isLoading } = useQuery({
    queryKey: ["friendrequests"],
    queryFn: getFrndReqs,
  });
  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFrndReq,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendrequests"]);
      queryClient.invalidateQueries(["friends"]);
    },
  });

  const accepted = friendrequests?.acceptedRequests || [];
  const pending = friendrequests?.pendingRequests || [];
  console.log(pending);
  console.log(accepted);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {" "}
          Notifications
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-purple-400" />
                  Friend Requests
                  <span className="badge bg-purple-400 ml-2">
                    {pending.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {pending.map((request) => (
                    <div
                      key={request._id}
                      className="card bg=base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request.sender?.profilePic}
                                alt={request.sender?.fullname}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender?.fullname}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge bg-purple-400 badge-sm">
                                  Native:{request.sender?.nativeLang}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning:{request.sender?.learningLang}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn bg-purple-400 btn-sm"
                            onClick={() => {
                              acceptRequestMutation(request._id);
                            }}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {accepted.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {accepted.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.sender.profilePic}
                              alt={notification.sender.fullname}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.sender.fullname}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.sender.fullname} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {accepted.length === 0 && pending.length === 0 && !isLoading && (
                <NoNotificationsFound /> 
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Notificationpage;
