import React from 'react'

const PrivateProfile = () => {
    return (
        <div className="flex items-center justify-center py-20 px-4">

            <div className="bg-white shadow-xl rounded-3xl border border-gray-100 p-10 text-center max-w-md w-full">

                <div className="text-6xl mb-4">
                    🔒
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Private Account
                </h2>

                <p className="text-gray-500 text-sm">
                    Follow this account to see their posts and updates.
                </p>

            </div>

        </div>
    )
}

export default PrivateProfile
