import React from 'react'
import { useNavigate } from 'react-router-dom'

function VibeBoat({setChatBoat}) {

    const navigate = useNavigate()
    return (
        <div className=" fixed bottom-10 right-5 
         rounded-full 
        p-3 cursor-pointer 
        z-50">
            <span className="ml-10 font-extrabold text-2xl" onClick={() => setChatBoat(false)}>×</span>
            <img
                onClick={() => navigate(`/chats`)}
                src="https://cdn3d.iconscout.com/3d/premium/thumb/chatbot-11798649-9666248.png"   
                className="w-20 h-20"
                alt="Chat Logo"
            />

        </div>
    )
}

export default VibeBoat
