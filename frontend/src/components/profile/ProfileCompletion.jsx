import React from 'react'
import { FaUserCircle, FaInfoCircle, FaEdit } from "react-icons/fa";

function ProfileCompletion({isOwnProfile,handleEdit}) {
    return (
        <div>
            {isOwnProfile && (
                <div className="suggestion-section mt-5 px-3">
                    <h4 className="mb-4 fw-bold text-center">Complete your profile</h4>
                    <div className="row justify-content-center g-3">

                        {/* Upload profile picture */}
                        <div className="col-md-4 col-sm-6">
                            <div className="suggestion-box text-center p-4 rounded-4 shadow-sm border">
                                <div className="icon-wrapper mb-3">
                                    <FaUserCircle size={48} className="text-primary" />
                                </div>
                                <h6 className="fw-semibold mb-3">Upload Profile Picture</h6>
                                <button
                                    className="btn btn-sm btn-outline-primary rounded-pill px-4"
                                    onClick={handleEdit}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>

                        {/* Add Bio */}
                        <div className="col-md-4 col-sm-6">
                            <div className="suggestion-box text-center p-4 rounded-4 shadow-sm border">
                                <div className="icon-wrapper mb-3">
                                    <FaInfoCircle size={48} className="text-info" />
                                </div>
                                <h6 className="fw-semibold mb-3">Add a Bio</h6>
                                <button
                                    className="btn btn-sm btn-outline-info rounded-pill px-4"
                                    onClick={handleEdit}
                                >
                                    Add Bio
                                </button>
                            </div>
                        </div>


                        {/* Edit Profile */}
                        <div className="col-md-4 col-sm-6">
                            <div className="suggestion-box text-center p-4 rounded-4 shadow-sm border">
                                <div className="icon-wrapper mb-3">
                                    <FaEdit size={48} className="text-success" />
                                </div>
                                <h6 className="fw-semibold mb-3">Edit Profile</h6>
                                <button
                                    className="btn btn-sm btn-outline-success rounded-pill px-4"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileCompletion
