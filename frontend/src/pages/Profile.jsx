
import React, { useContext, useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { BsFillPostcardHeartFill } from "react-icons/bs";
import "../assets/css/Profile.css"
import { FaPlus } from "react-icons/fa";
import { FaUserCircle, FaInfoCircle, FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { handleError } from '../utils/errorHandler';
import Spinner from "../components/common/Spinner";
import { FiMoreVertical, FiX } from "react-icons/fi";
import { MdAddBox } from "react-icons/md";
import FollowingModal from "../components/profile/FollowingModal";
import FollowersModal from "../components/profile/FollowersModal";
import FollowRequestModel from "../components/profile/FollowRequestModel";

import LoadingDots from "../components/common/LoadingDots";
import { getProfileData } from "../services/userService";
import { postDelete, getPersonalPosts, createPost } from "../services/postService";

import { storyUpload } from '../services/storyService'

import { removeFollower, sendFollow, sendUnFollow, followBack } from '../services/followService'

import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileCompletion from "../components/profile/ProfileCompletion";

import PrivateProfile from "../components/profile/PrivateProfile";
import CreatePost from "../components/profile/CreatePost";
import ProfilePosts from "../components/profile/ProfilePosts";

// Start of component
const Profile = () => {
  const [file, setFile] = useState(null);
  const [mpost, setMpost] = useState(true);
  const [mreals, setMreals] = useState(false);
  const [postText, setPostText] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [story, setStory] = useState(false);
  const [uploadStory, setUploadedStory] = useState(null);
  const [storyFile, setStoryFile] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [validated, setValidated] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);


  const [expandedPostId, setExpandedPostId] = useState(null);

  const [showFollowRequest, setShowFollowRequest] = useState(false);

  const [createPostStatus, setCreatePostStatus] = useState(false);


  const validateAndPost = () => {
    if (!imageSelected || captionText.trim() === "") {
      setValidated(false);
      return;
    }
    handleCreatePost();
  };


  const [unfollowModal, setUnfollowModal] = useState({ show: false, user: null });

  const [removeModal, setRemoveModal] = useState({ show: false, follower: null });

  const [showStoryModal, setShowStoryModal] = useState(false); // for modal


  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [canViewPosts, setCanViewPosts] = useState(false);
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [followRequest, setFollowRequest] = useState(false);

  const [mutualCount, setMutualCount] = useState(0)
  const [mutualUsernames, setMutualUserName] = useState([])

  const [showMutualPopup, setShowMutualPopup] = useState(false);
  const [allMutualUsers, setAllMutualUsers] = useState([]);


  const [posts, setPosts] = useState([])

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(AuthContext);
  const token = user?.token || localStorage.getItem("token");
  const { id } = useParams();

  const [profileData, setProfileData] = useState(null);

  const navigate = useNavigate();

  const fileInputRef = useRef();

  const isOwnProfile = String(profileData?._id) === String(user?.id);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (!profileData || !user || !Array.isArray(profileData.followers)) return;



    // Step 2: Check if the current user follows this profile
    const isFollowed = profileData.followers.some(
      (follower) => follower._id?.toString() === user.id?.toString()
    );

    setIsFollowing(isFollowed);

    // Step 3: Handle private/public visibility
    if (profileData.isPrivate) {
      if (isOwnProfile) {
        setCanViewPosts(true);
      } else {
        setCanViewPosts(isFollowed); // follower only can view
      }
      setIsPrivateAccount(true);
    } else {
      // public account → everyone can view
      setIsPrivateAccount(false);
      setCanViewPosts(true);
    }
  }, [profileData, user]);

  useEffect(() => {
    if (!profileData || !profileData.followRequests || !user) return;

    const isSendFollowRequest = profileData.followRequests
      .some(req => req.user?._id === user.id);

    setFollowRequest(isSendFollowRequest);
    // console.log("isSendFollowRequest:", isSendFollowRequest);

  }, [user?.id, profileData?.followRequests]);



  const toggleMenu = (postId) => {
    setOpenMenuId(openMenuId === postId ? null : postId);
  };

  const handlePostDelete = async (postId) => {
    // alert(`Post was deleted ${postId} is here`)

    try {
      const res = await postDelete(postId)

      // Remove deleted post from local state
      setPosts(posts.filter(post => post._id !== postId));
      toast.success(res.data.message);
    } catch (err) {
      handleError(err);
    }
  }

  // console.log("Id::", id);
  // console.log("UserId::", user?.id)



  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {


        const response = await getProfileData(id)



        setProfileData(response.data.user);
        setMutualCount(response.data.mutualCount);
        setMutualUserName(response.data.mutualList);

      } catch (err) {
        handleError(err);
      }
    };

    fetchProfileData();
  }, [user]);


  useEffect(() => {
    if (!user) return;
    if (!id) return;

    const fetchPostData = async () => {
      try {


        const res = await getPersonalPosts(id)
        setPosts(res.data.posts || []);
      } catch (err) {
        handleError(err)
      }
    };

    fetchPostData();
  }, [id]);



  if (!user) {
    return (
      <div className="container mt-4">
        <h3>Please login to view your profile.</h3>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mt-10">
        <Spinner />
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/profile/${user.id}/edit_profile`, {
      state: { profileData, posts },
    });
  };

  const handlePostImage = (e) => {
    const selectedPost = e.target.files[0];
    if (selectedPost) {
      setPostImage(selectedPost);
      toast.success(`post selected`);
    }
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("description", postText);
    formData.append("postImage", postImage);

    try {

      if (postImage.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }

      setCreatePostStatus(true);


      const userId = user?.id;

      const res = await createPost(userId, formData)

      setCreatePostStatus(false)
      toast.success(res.data.message);
      setPostImage(null);
      setPostText(null);
    } catch (err) {
      handleError(err);
    }
  };

  // const handleStory = () => {
  //   alert("Add your story");
  //   setStory(true);
  // };

  // const handleChange = (e) => {
  //   const selected = e.target.files[0];
  //   if (selected) {
  //     if (selected.type.startsWith("video")) {
  //       const video = document.createElement("video");
  //       video.preload = "metadata";
  //       video.onloadedmetadata = () => {
  //         window.URL.revokeObjectURL(video.src);
  //         if (video.duration > 15) {
  //           alert("Video must be 15 seconds or less.");
  //           setStoryFile(null);
  //         } else {
  //           setStoryFile(selected);
  //         }
  //       };
  //       video.src = URL.createObjectURL(selected);
  //     } else {
  //       setStoryFile(selected);
  //     }
  //   }
  // };



  // This function will open the file dialog when the user clicks on the "+ Story" button.
  const handleStoryClick = () => {
    fileInputRef.current.click();
  };



  // This function will handle the file upload process
  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Set the selected file to the state
    setStoryFile(selectedFile);

    // Create a form data object to send the file to the server
    const formData = new FormData();
    formData.append("story", selectedFile);

    setStoryLoading(true);

    try {

      const res = await storyUpload(formData);

      // Store the uploaded story data in the parent component state
      const story = res.data.story;
      setStoryLoading(false);
      setUploadedStory(story);

      toast.success("Story uploaded successfully!");
    } catch (err) {
      if (err.response && err.response.status === 429) {
        toast.error(err.response.data || "Too many requests, try again later.");
      } else {
        handleError(err);
      }
    }
  };




  const handleProfileStoryClick = () => {
    if (uploadStory) setShowStoryModal(true);
  };


  const handleRemove = async (followerId) => {


    try {


      const res = await removeFollower(followerId)

      toast.success(res.data.message)



      setProfileData((prev) => ({
        ...prev,
        followers: prev.followers.filter(f => f._id !== followerId)
      }));


      // Close modal
      setRemoveModal({ show: false, follower: null });
    } catch (err) {
      handleError(err);
    }
  };


  const handleFollow = async (userIdTofollow) => {

    // console.log("Follow api call");
    try {


      const res = await sendFollow(userIdTofollow)

      toast.success(res.data.message)

      if (res.data.sendrequest) {
        setFollowRequest(res.data.sendrequest)
      }
      else {
        setIsFollowing(true);
      }
      // setProfileData(prev => ({
      //     ...prev,
      //     following: prev.following.filter(user => user._id !== userIdToUnfollow)
      //   }));
    } catch (err) {
      toast.error("Failed to follow user");
    }
  };



  const handleUnfollow = async (userIdToUnfollow) => {
    try {

      await sendUnFollow(userIdToUnfollow)

      setProfileData(prev => ({
        ...prev,
        following: prev.following.filter(user => user._id !== userIdToUnfollow)
      }));

      setIsFollowing(false);


      // Close modal
      setUnfollowModal({ show: false, user: null });
      // alert(res.data.message || "Unfollowed successfully!");
    } catch (err) {
      handleError(err);
    }
  };


  // const handleFollowRequest = async () => {
  //   alert("call followRequest")
  // }


  // console.log("MutuleCounts::", mutualCount)
  // console.log("MutuleUsername::", mutualCount)


  const FollowBack = profileData.following.some((followings) => followings._id == user?.id)

  // console.log("FollowBack::", FollowBack)




  const handleFollowBack = async (followbackUserId) => {
    try {
      const res = await followBack(followbackUserId)

      toast.success(res.data.message)
    }
    catch (error) {
      console.error("failed to followback", error)
    }
  }




  // console.log("profile user id:", profileData._id);
  // console.log("logged in user id:", user.id);

  return (
    <div className="profile-container">

      {/* Profile Section */}
      <ProfileInfo
        profileData={profileData}

        storyLoading={storyLoading}

        uploadStory={uploadStory}

        handleProfileStoryClick={handleProfileStoryClick}

        isOwnProfile={isOwnProfile}

        handleEdit={handleEdit}

        setShowFollowRequest={setShowFollowRequest}

        showFollowRequest={showFollowRequest}

        FollowBack={FollowBack}

        isFollowing={isFollowing}

        handleFollowBack={handleFollowBack}

        handleFollow={handleFollow}

        handleUnfollow={handleUnfollow}

        followRequest={followRequest}
      />

      <div className="text-end mt-4 mb-5">
        <div className="profile-stats">
          <span><strong>{posts?.length || 0}</strong> Posts</span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setShowFollowers(true)}
          >
            <strong>{profileData.followers?.length || 0}</strong> Followers
          </span>

          <span
            style={{ cursor: "pointer" }}
            onClick={() => setShowFollowing(true)}
          >
            <strong>{profileData.following?.length || 0}</strong> Following
          </span>
        </div>

      </div>

      {!isOwnProfile && (
        mutualCount > 0 ? (
          <div className="flex items-center gap-3 mt-3">

            {/* Mutual Profile Images */}
            <div className="flex -space-x-3">
              {mutualUsernames.slice(0, 3).map((user, index) => (
                <img
                  key={index}
                  src={
                    user.profilePic ||
                    "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                  }
                  alt={user.username}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
            </div>

            {/* Mutual Text */}
            <p className="text-xs text-gray-500 leading-tight">
              Followed by{" "}
              <span className="font-semibold text-gray-700">
                {mutualUsernames[0]?.username}
              </span>

              {mutualCount > 1 && (
                <>
                  {" "}and{" "}
                  <span
                    className="font-semibold text-gray-700 cursor-pointer hover:underline"
                    onClick={() => {
                      setAllMutualUsers(mutualUsernames);
                      setShowMutualPopup(true);
                    }}
                  >
                    {mutualCount - 1} others
                  </span>
                </>
              )}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-2">
            Suggested for you
          </p>
        )
      )}


      {showMutualPopup && (
        <div className="mutual-popup-overlay" onClick={() => setShowMutualPopup(false)}>
          <div className="mutual-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">Mutual Connections</h3>

            <ul className="popup-list">
              {allMutualUsers.map((user, index) => (
                <li key={index} className="popup-user">
                  <img
                    src={user.profilePic || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"}
                    alt={user.username}
                    className="popup-avatar"
                  />
                  <span className="popup-username">{user.username}</span>
                </li>
              ))}
            </ul>

            <button className="popup-close-btn" onClick={() => setShowMutualPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}





      {/* {profileData.isPrivate ?
        <div>
          <h1>This Account is Private</h1>
        </div>
        :
        <div>
          <h1>This Account is Public</h1>
        </div>
      } */}

      {/* {isPrivateAccount && !canViewPosts ? (
        <div>
          <h1>don't see posts </h1>
        </div>

      ) : (
        <div>
          see posts
        </div>
      )} */}


      {isPrivateAccount && !canViewPosts ? (
        ""
      ) :
        showFollowers && (
          <FollowersModal profileData={profileData} isOwnProfile={isOwnProfile} removeModal={removeModal} setRemoveModal={setRemoveModal} handleRemove={handleRemove} setShowFollowers={setShowFollowers} />
        )
      }

      {isPrivateAccount && !canViewPosts ? (
        ""
      ) :
        (
          showFollowing && (
            <FollowingModal profileData={profileData} isOwnProfile={isOwnProfile} unfollowModal={unfollowModal} setUnfollowModal={setUnfollowModal} handleUnfollow={handleUnfollow} setShowFollowing={setShowFollowing} />
          )
        )
      }






      {/* Story upload button */}
      {isOwnProfile && (
        <div>
          <h3 className="story-btn" onClick={handleStoryClick}>
            <FaPlus />
          </h3>
        </div>
      )}

      {isOwnProfile && (
        <div className="my-3">
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </div>
      )}

      {showFollowRequest && <FollowRequestModel onClose={() => setShowFollowRequest(false)} profileData={profileData} token={token} setProfileData={setProfileData} setFollowRequest={setFollowRequest} />}

      {/* Story Modal */}
      {showStoryModal && uploadStory && (
        <div className="story-modal-backdrop" onClick={() => setShowStoryModal(false)}>
          <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
            {['.mp4', '.mov', '.webm'].some(ext => uploadStory?.mediaUrl?.toLowerCase().endsWith(ext)) ? (
              <video
                src={uploadStory.mediaUrl}
                controls
                autoPlay
                muted
                loop
                className="story-media"
              />
            ) : (
              <img
                src={uploadStory.mediaUrl}
                alt="story"
                className="story-media"
              />
            )}

            <button className="story-close-btn" onClick={() => setShowStoryModal(false)}>×</button>
          </div>
        </div>
      )}



      {/* Media Switcher */}
      {isOwnProfile && (
        <div className="w-full flex justify-center gap-3 mt-4">

          <button
            className={`flex items-center gap-2 px-2 shadow py-2 rounded-4 font-medium transition ${mpost
              ? "bg-black text-white"
              : "border border-gray-700 text-black hover:bg-gray-100"
              }`}
            onClick={() => {
              setMpost(true);
              setMreals(false);
            }}
          >
            <BsFillPostcardHeartFill /> Your Posts
          </button>


          <button
            className={`flex items-center gap-2 px-4 py-2  shadow rounded-4 font-medium transition ${mreals
              ? "bg-black text-white"
              : "border border-gray-700 text-black hover:bg-gray-100"
              }`}
            onClick={() => {
              setMpost(false);
              setMreals(true);
            }}
          >
            <MdAddBox size={22} /> Post
          </button>
        </div>
      )}




      {isPrivateAccount && !canViewPosts ? (

        <PrivateProfile />

      ) : (

        <div className=" bg-gray-50 px-1 sm:px-4 py-4">

          {mpost ? (

            <ProfilePosts
              posts={posts}

              isOwnProfile={isOwnProfile}

              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}

              expandedPostId={expandedPostId}
              setExpandedPostId={setExpandedPostId}

              openMenuId={openMenuId}
              toggleMenu={toggleMenu}

              handlePostDelete={handlePostDelete}

              setMpost={setMpost}
            />

          ) : (

            isOwnProfile && (

              <CreatePost
                postImage={postImage}
                setPostImage={setPostImage}

                captionText={captionText}
                setCaptionText={setCaptionText}

                imageSelected={imageSelected}
                setImageSelected={setImageSelected}

                validated={validated}

                handlePostImage={handlePostImage}

                validateAndPost={validateAndPost}

                setMpost={setMpost}

                createPostStatus={createPostStatus}
              />

            )

          )}

        </div>

      )}


      {/* Suggestion Boxes */}
      <ProfileCompletion
        isOwnProfile={isOwnProfile}
        handleEdit={handleEdit}
      />
    </div>
  );
};
export default Profile;
