import React from 'react'

function ProfileInfo({
    profileData,
    storyLoading,
    uploadStory,
    handleProfileStoryClick,
    isOwnProfile,
    handleEdit,
    showFollowRequest,
    setShowFollowRequest,
    FollowBack,
    isFollowing,
    followRequest,
    handleFollowBack,
    handleFollow,
    handleUnfollow
}) {
    return (
        <div className="profile-header flex justify-between items-start w-full px-4 sm:px-6 mt-4">
            {storyLoading && (
                <div className="fixed right-4  top-15  bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">

                    <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></span>

                    <span className="text-sm font-medium">
                        Story Uploading...
                    </span>

                </div>
            )}

            <div
                className={`flex items-center gap-4 ${uploadStory ? "cursor-pointer" : "cursor-default"}`}
                onClick={handleProfileStoryClick}
            >
                {/* Profile Image */}
                <img
                    src={
                        profileData.profilePic?.url ||
                        "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                    }
                    alt="Profile"
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 ${uploadStory ? "border-pink-500" : "border-gray-300"
                        }`}
                />

                {/* Profile Text Info */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold">
                        {profileData.username}
                    </h3>
                   
                    <h6 className="text-gray-600 text-sm sm:text-base">
                        {profileData.bio || "No bio available"}
                    </h6>
                  
                    {isOwnProfile ? (
                        <div className="flex items-center gap-3 mt-2">
                            <span
                                onClick={handleEdit}

                                className="px-3 py-1 border rounded-2xl  text-sm font-medium hover:bg-gray-100 transition shadow cursor-pointer"
                            >
                                Edit Profile
                            </span>

                            {profileData.followRequests?.length > 0 && (
                                <button
                                    onClick={() => setShowFollowRequest(!showFollowRequest)}
                                    className="border px-3 py-1 shadow hover:bg-gray-100 rounded  "
                                >
                                    <span className="font-bold">{profileData.followRequests?.length}</span>
                                    <span>Requests</span>
                                </button>
                            )}

                        </div>
                    ) : (
                        <div>
                            {/* <span>
                requests
                {profileData.followRequests.map((data,index)=>(
                <div>{data.user._id}       {data.status}   {data.user.username}</div>
                
                ))}
               </span> */}
               
                            {FollowBack && !isFollowing ?
                                <button onClick={() => handleFollowBack(profileData._id)} className={`mt-2 px-4 py-1 text-sm font-bold rounded-full transition ${isFollowing
                                    ? "bg-gray-200 text-black border"
                                    : "bg-blue-500 text-white"
                                    }`}>Follow Back</button>
                                :
                                <button
                                    className={`mt-2 px-4 py-1 text-sm font-bold rounded-full transition ${isFollowing
                                        ? "bg-gray-200 text-black border"
                                        : "bg-blue-500 text-white"
                                        }`}
                                    onClick={() =>
                                        isFollowing
                                            ? handleUnfollow(profileData._id)
                                            : handleFollow(profileData._id)
                                    }
                                >


                                    {isFollowing
                                        ? "Following"
                                        : followRequest
                                            ? "Request Sent"
                                            : FollowBack
                                                ? "Follow ack"
                                                : "follow"
                                    }

                                </button>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo  