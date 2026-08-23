import React from "react";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { followDecline, followAccept } from "../../services/followService";


const FollowRequestModel = ({ onClose, profileData, setProfileData, setFollowRequest }) => {

  const handleDecline = async (declineuserId) => {
    try {

      const res = await followDecline(declineuserId)

      toast.success(res.data.message)

      setProfileData(prev => ({
        ...prev,
        followRequests: prev.followRequests.filter(
          req => req.user._id !== declineuserId
        ),
      }));



    }
    catch (error) {
      console.error("Failed to Decline follow-request", error);
    }
  }

  const handleAccept = async (acceptUserId) => {
    try {
      const res = await followAccept(acceptUserId)
      toast.success(res.data.message)

      setProfileData(prev => ({
        ...prev,
        followRequests: prev.followRequests.filter(
          req => req.user._id !== acceptUserId
        ),
      }));

    }
    catch (error) {
      console.error("Failed to Accept follow request", error)
    }

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-fadeIn">

        <div className="relative border-b border-gray-200 px-5 py-4">
          <h2 className="text-center text-lg font-semibold text-gray-900">
            Follow Requests
          </h2>

          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <FaTimes className="text-gray-600" size={18} />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {profileData.followRequests.length > 0 ? (
            profileData.followRequests.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.user?.profilePic?.url ||
                      "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                    }
                    alt="Profile"
                    className="h-14 w-14 rounded-full object-cover border border-gray-200"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {user.user?.username}
                    </h3>

                    <p className="text-xs text-gray-500 max-w-[170px] line-clamp-2 mt-1">
                      {user.user?.bio || "No bio available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAccept(user.user?._id)}
                    className="bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => handleDecline(user.user?._id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="h-20 w-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-8 0v2m8 0H9m4-10a4 4 0 110-8 4 4 0 010 8z"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No Follow Requests
              </h3>

              <p className="mt-2 text-sm text-gray-500 text-center max-w-xs">
                When someone requests to follow you, you'll see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowRequestModel;
