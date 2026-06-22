import React from "react";
import { FiMoreVertical, FiX } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";

function ProfilePosts(
    {
 posts,

 isOwnProfile,

 selectedImage,
 setSelectedImage,

 expandedPostId,
 setExpandedPostId,

 openMenuId,
 toggleMenu,

 handlePostDelete,

 setMpost
}
) {
    return (
        <div className="max-w-7xl mx-auto">

            {posts && posts.length > 0 ? (

                <>
                    {/* POSTS GRID */}
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3">

                        {posts.map((post) => (

                            <div
                                key={post._id}
                                className="group relative cursor-pointer"
                            >

                                {/* IMAGE */}
                                <div
                                    className="aspect-square overflow-hidden rounded-md sm:rounded-2xl bg-gray-200"
                                    onClick={() => setSelectedImage(post)}
                                >

                                    <img
                                        src={post.image}
                                        alt="Post"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                </div>

                                {/* OVERLAY */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 rounded-md sm:rounded-2xl flex items-center justify-center">

                                    <span className="text-white text-sm font-semibold">
                                        View
                                    </span>

                                </div>

                                {/* CAPTION */}
                                <div className="mt-2 px-1">

                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">

                                        {post.text.length > 100 ? (
                                            <>
                                                {expandedPostId === post._id
                                                    ? post.text
                                                    : post.text.slice(0, 20) + "... "}

                                                <span
                                                    onClick={() =>
                                                        setExpandedPostId(
                                                            expandedPostId === post._id
                                                                ? null
                                                                : post._id
                                                        )
                                                    }
                                                    className="text-blue-500 cursor-pointer ml-1 hover:underline"
                                                >
                                                    {expandedPostId === post._id
                                                        ? "less"
                                                        : "more"}
                                                </span>
                                            </>
                                        ) : (
                                            post.text
                                        )}

                                    </p>

                                </div>

                                {/* MENU */}
                                {isOwnProfile && (

                                    <div className="absolute top-2 right-2 z-20">

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMenu(post._id);
                                            }}
                                            aria-label="Toggle menu"
                                            className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition"
                                        >
                                            <FiMoreVertical size={14} />
                                        </button>

                                        {openMenuId === post._id && (

                                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">

                                                <button
                                                    onClick={() =>
                                                        handlePostDelete(post._id)
                                                    }
                                                    className="flex items-center gap-2 w-full px-4 py-3 text-red-500 hover:bg-red-50 transition text-sm"
                                                >
                                                    <RiDeleteBin2Line />
                                                    Delete
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                    {/* IMAGE MODAL */}
                    {selectedImage && (

                        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center px-2 sm:px-4">

                            <div className="relative w-full max-w-5xl">

                                {/* CLOSE BUTTON */}
                                <button
                                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <FiX size={30} />
                                </button>

                                {/* MODAL CONTENT */}
                                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">

                                    {/* IMAGE */}
                                    <div className="flex-1 bg-black flex items-center justify-center">

                                        <img
                                            src={selectedImage.image}
                                            alt="Selected Post"
                                            className="w-full h-full max-h-[75vh] object-contain"
                                        />

                                    </div>

                                    {/* CAPTION */}
                                    <div className="w-full md:w-[350px] p-5 overflow-y-auto">

                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            Caption
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {selectedImage.text}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </>

            ) : (

                /* EMPTY STATE */
                <div className="flex items-center justify-center py-24">

                    <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md w-full border border-gray-100">

                        <div className="text-6xl mb-4">
                            📸
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            No Posts Yet
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Start sharing your moments.
                        </p>

                        {isOwnProfile && (

                            <button
                                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition"
                                onClick={() => setMpost(false)}
                            >
                                Create First Post
                            </button>

                        )}

                    </div>

                </div>

            )}

        </div>
    )
}

export default ProfilePosts
