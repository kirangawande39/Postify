import React from 'react'
import { Link } from 'react-router-dom'

function UsersSuggestions({ setShowSuggestionModal, showAll, suggestions, role, user ,setShowAll , openStory, handleFollow , handleUnfollow, storyUserIds }) {



  return (
    <div>
      {role === "mobile" && <div className="vibenet-suggestion-modal-backdrop">
        <div className="vibenet-suggestion-modal">
          <div className="d-flex">
            <h5 className="font-bold  text-[2rem]">👋 Follow minimum 5 people to get started</h5>
            <button className="vibenet-close-suggestion " onClick={() => setShowSuggestionModal(false)}>Close</button>
          </div>
          <div className="vibenet-suggestion-list-scroll">
            {(showAll ? suggestions : suggestions.slice(0, 10)).map((sugg) => (
              <div className="vibenet-suggestion-card" key={sugg._id}>
                <Link to={`/profile/${sugg._id}`} className="vibenet-suggestion-link">
                  <img
                    src={
                      sugg.profilePic?.url ||
                      "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                    }
                    alt={sugg.username}
                    className="vibenet-suggestion-avatar"
                  />
                  <div className="vibenet-suggestion-info">
                    <span className="vibenet-suggestion-username">{sugg.username}</span>
                  </div>
                </Link>
                <button
                  className={`vibenet-follow-btn bg-blue-500 ${sugg.isFollowing ? "vibenet-following" : ""}`}
                  onClick={() =>
                    sugg.isFollowing
                      ? handleUnfollow(sugg._id)
                      : handleFollow(sugg._id)
                  }
                >
                  {sugg.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>}



      {role === "desktop" && <div className="vibenet-sidebar">
        <div className="vibenet-user-card">
          <img
            src={
              user?.profilePic?.url ||
              "https://png.pngtree.com/png-vector/20240529/ourmid/pngtree-the-logo-of-an-avatar-profile-outlines-in-an-icon-circle-vector-png-image_6959193.png"
            }
            alt={user.username}
            className="vibenet-user-avatar rounded-circle"
            onClick={(e) => {
              if (storyUserIds.includes(user._id || user.id)) {
                e.preventDefault();
                openStory(user._id || user.id);
              }
            }}
          />


          <div className="vibenet-user-info">
            <Link to={`/profile/${user._id || user.id}`} className="vibenet-username">
              {user.username}

            </Link>
            <span className="vibenet-name">{user.name}</span>
          </div>
        </div>
           <div className="vibenet-suggestions-header sticky top-0">
            <span>Suggestions For You</span>
            {suggestions.length > 7 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="vibenet-show-all"
              >
                {showAll ? "See Less" : "See All"}
              </button>
            )}
          </div>




        <div className="vibenet-suggestions max-h-[500px] overflow-y-auto ">
      
          {suggestions.length === 0 ? (
            <p className="vibenet-no-suggestions">No suggestions found</p>
          ) : (
            <>
              {(showAll ? suggestions : suggestions.slice(0, 7)).map((sugg) => (
                <div className="vibenet-suggestion-card" key={sugg._id}>
                  <Link to={`/profile/${sugg?._id}`} className="vibenet-suggestion-link">
                    <img
                      src={
                        sugg.profilePic?.url ||
                        "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                      }
                      alt={sugg.username}
                      className="vibenet-suggestion-avatar"
                    />
                    <div className="vibenet-suggestion-info">
                      <span className="vibenet-suggestion-username">{sugg.username}</span>
                      <span className="vibenet-suggestion-mutual">
                        {sugg.mutualUsernames?.length > 0
                          ? `Followed by ${sugg.mutualUsernames[0]}${sugg.mutualUsernames.length > 1 ? ` + ${sugg.mutualUsernames.length - 1} more` : ''}`
                          : 'New to vibenet'}
                      </span>
                    </div>
                  </Link>
                  <button
                    className={` bg-blue-500 px-1  text-white ${sugg.isFollowing ? "vibenet-following" : ""}`}
                    onClick={() =>
                      sugg.isFollowing
                        ? handleUnfollow(sugg._id)
                        : handleFollow(sugg._id)
                    }
                  >
                    {sugg.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span>
                  @ 2026 VibeNet
                </span>

                <span className="font-semibold text-gray-500">
                  Made with ❤️ Kiran
                </span>
              </div>
            </>
          )}
        </div>

      </div>}

    </div>
  )
}

export default UsersSuggestions
