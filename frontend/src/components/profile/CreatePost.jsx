import React from 'react'
import LoadingDots from '../../components/common/LoadingDots';

const CreatePost = (
    {
 postImage,
 setPostImage,

 captionText,
 setCaptionText,

 imageSelected,
 setImageSelected,

 validated,

 handlePostImage,

 validateAndPost,

 setMpost,

 createPostStatus
}
) => {
    return (
        <div className="max-w-2xl mx-auto">

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                {/* HEADER */}
                <div className="p-6 border-b bg-gradient-to-r from-pink-500 to-purple-500 text-white">

                    <h2 className="text-2xl font-bold">
                        Create New Post
                    </h2>

                    <p className="text-sm opacity-90 mt-1">
                        Share photos with your friends
                    </p>

                </div>

                <div className="p-6">

                    {/* IMAGE UPLOAD */}
                    <div className="mb-6">

                        <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all
                  ${!validated && !imageSelected
                                ? "border-red-400 bg-red-50"
                                : "border-gray-300 hover:border-pink-400"
                            }`}>

                            <i className="bi bi-images text-5xl text-gray-400"></i>

                            <p className="mt-4 text-gray-600 font-medium">
                                Drag photo here
                            </p>

                            <label
                                htmlFor="postImage"
                                className="inline-block mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-xl cursor-pointer hover:scale-105 transition"
                            >
                                Select from device
                            </label>

                            <input
                                type="file"
                                id="postImage"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    handlePostImage(e);
                                    setImageSelected(true);
                                }}
                            />

                            {/* PREVIEW */}
                            {postImage && (

                                <div className="relative mt-6">

                                    <img
                                        src={URL.createObjectURL(postImage)}
                                        alt="Preview"
                                        className="w-full max-h-[450px] object-cover rounded-2xl shadow-md"
                                    />

                                    <button
                                        className="absolute top-3 right-3 bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-black"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPostImage(null);
                                            setImageSelected(false);
                                        }}
                                    >
                                        ✕
                                    </button>

                                </div>

                            )}

                        </div>

                        {!validated && !imageSelected && (

                            <p className="text-red-500 text-sm mt-2">
                                Please select an image to continue
                            </p>

                        )}

                    </div>

                    {/* CAPTION */}
                    <div className="mb-6">

                        <textarea
                            rows="5"
                            placeholder="Write a caption..."
                            value={captionText}
                            onChange={(e) => {
                                setPostText(e.target.value);
                                setCaptionText(e.target.value);
                            }}
                            className={`w-full rounded-2xl border p-4 outline-none resize-none transition
                    ${!validated &&
                                    captionText.trim() === ""
                                    ? "border-red-400"
                                    : "border-gray-300 focus:border-pink-500"
                                }`}
                        />

                        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">

                            <span>✨ Express yourself</span>

                            <span>
                                {captionText.length}/2200
                            </span>

                        </div>

                        {!validated &&
                            captionText.trim() === "" && (

                                <p className="text-red-500 text-sm mt-2">
                                    Caption is required
                                </p>

                            )}

                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-3">

                        <button
                            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                            onClick={() => setMpost(true)}
                        >
                            Cancel
                        </button>

                        <button
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50"
                            onClick={validateAndPost}
                            disabled={
                                !imageSelected ||
                                captionText.trim() === ""
                            }
                        >
                            {createPostStatus ? (<LoadingDots text="Sharing Post" />) : 'Share Post'}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CreatePost
