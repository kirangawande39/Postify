import React, { useState, useContext, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import LoadingDots from "../components/common/LoadingDots"
import { useParams } from "react-router-dom";
import { handleError } from "../utils/errorHandler";
import { useOnline } from "../context/OnlineStatusContext";
import "../assets/css/Chat.css";
import { toast } from "react-toastify";
import GroupChat from "../components/GroupChat";
import { groupFormData , getGroupData} from "../services/groupService";
import { sidebarChatData } from "../services/chatService";


const Chat = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { allOnlineUsers } = useOnline();

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [messages, setMessages] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [onlineUsers, setOnlineUsers] = useState(allOnlineUsers || []);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const [groupCreateStatus, setGroupCreateStatus] = useState(false);

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupFormData, setGroupFormData] = useState({
    name: "",
    description: "",
    icon: "",
    privacy: "public",
  });

  const [sidebarChats, setSidebarChats] = useState([]);

  const [groupImage, setGroupImage] = useState()

  const [groupsData, setGroupsData] = useState([]);

  const { id } = useParams();

  const CHATBOT_ID = "684f268c7dad0bf1b1dfd4f8";
  // const CHATBOT_ID = "684db4e39d76770c4d55dd7b";

  // console.log("Sidebar data:", sidebarChats)

  // Dummy messages for demo
  const dummyMessages = {
    group1: [
      { id: 1, sender: "Admin", text: "Welcome to the group!" },
      { id: 2, sender: "You", text: "Hello everyone!" },
    ],
  };

  const sortedSidebarChats = useMemo(() => {
    return [...sidebarChats].sort((a, b) => {
      const isAChatBot = a._id === CHATBOT_ID;
      const isBChatBot = b._id === CHATBOT_ID;

      if (isAChatBot) return -1;
      if (isBChatBot) return 1;

      const isAOnline = onlineUsers.includes(a._id);
      const isBOnline = onlineUsers.includes(b._id);

      if (isAOnline && !isBOnline) return -1;
      if (!isAOnline && isBOnline) return 1;

      return new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0);
    });
  }, [sidebarChats, onlineUsers]);



  // Update last message
  const handleLastMessageUpdate = (newMessage) => {
    if (!selectedUser) return;

    setSidebarChats((prev) =>
      prev.map((chat) =>
        chat._id === selectedUser._id
          ? { ...chat, lastMessage: newMessage }
          : chat
      )
    );
  };


  // let chatMap = useMemo(() => {
  //   const map = {};

  //   chats.forEach((chat) => {
  //     map[chat._id] = chat;
  //   })
  //   return map;
  // }, [chats])

  // Window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getGroupData();
        setGroupsData(res.data.groups);
      } catch (err) {
        console.error("Failed fetch groups", err);
      }
    };
    fetchGroups();
  }, []);

  // Fetch user
  // const fetchUserData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await API.get(`/api/users/${id ? id : user.id}`);
  //     setLocalUser(res.data.user);
  //     updateUser(res.data.user);
  //   } catch (err) {
  //     handleError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchSideChatsData = async () => {
    try {
      setLoading(true)
      const res = await sidebarChatData();
      setSidebarChats(res.data)
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false)
    }
  }


  useEffect(() => {

    // fetchUserData();
    fetchSideChatsData();
  }, []);





  // Fetch online status
  // useEffect(() => {
  //   const fetchOnlineStatus = async () => {
  //     try {
  //       const res = await API.get(`/api/online-status`);

  //       // console.log("Online Status::", res.data);
  //       setLastSeen(res.data.lastSeen || {});
  //       setOnlineUsers(res.data.onlineUsers || allOnlineUsers || []);
  //     } catch (err) {
  //       console.error("online status error:", err);
  //     } finally {
  //       setStatusLoading(false);
  //     }
  //   };
  //   fetchOnlineStatus();
  //   const interval = setInterval(fetchOnlineStatus, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleSendMessage = (newMessage) => {
    if (selectedUser) {
      setMessages([...messages, { sender: user.username, text: newMessage }]);
      handleLastMessageUpdate(newMessage);
    }
  };

  const handleUserSelect = (follower) => {
    setSelectedGroup(null);
    setSelectedUser(follower);
    setMessages(dummyMessages[follower.username] || []);
  };

  const handleGroupSelect = (group) => {
    setSelectedUser(null);
    setSelectedGroup(group);
    // setMessages(dummyMessages[group.name] || []);

    // alert("your selected group")
  };

  const handleBack = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const handleChange = (e) => {
    setGroupFormData({ ...groupFormData, [e.target.name]: e.target.value });
  };

  const hanldeGroupImage = async (e) => {
    const groupIcon = e.target.files[0];

    if (groupIcon) {
      // console.log("groupIcon::", groupIcon)
      setGroupImage(groupIcon)

    }

  }

  const handleGroupForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("groupIcon", groupImage);
    formData.append("name", groupFormData.name);
    formData.append("description", groupFormData.description);
    formData.append("privacy", groupFormData.privacy);

    try {
      setGroupCreateStatus(true);
    
      const res = await groupFormData(formData)

      setGroupCreateStatus(false)
      toast.success(res.data.message);

      setGroupFormData({
        name: "",
        description: "",
        icon: "",
        privacy: "public",
      });



    } catch (err) {
      handleError(err);
    }
  };
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Offline";

    const diff = Date.now() - new Date(timestamp).getTime();

    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(months / 12);
    return `${years}y ago`;
  };

  if (loading || statusLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container chat-app mt-4">


      <div className="row gx-0">

        <div className={`col-md-4 border-end ${isMobile && (selectedUser || selectedGroup) ? "d-none" : ""}`} style={{ maxHeight: "90vh", overflowY: "auto" }}>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="px-3 mt-2 text-secondary">Groups</h5>
            <span className="bg-blue-500 text-white p-1 rounded-2xl mr-1 px-2 cursor-pointer" onClick={() => setShowGroupForm(true)}>
              Create Group
            </span>
          </div>
          <div className="list-group list-group-flush">

            {groupsData.length > 0 ? (
              groupsData.map((group, index) => (
                <button
                  key={index}
                  className={`list-group-item list-group-item-action d-flex align-items-center ${selectedGroup && selectedGroup._id === group._id ? "active" : ""}`}
                  onClick={() => handleGroupSelect(group)}
                >
                  <img
                    src={group?.icon.url || "https://cdn-icons-png.flaticon.com/512/615/615075.png"}
                    width={48}
                    height={48}
                    className="rounded-circle me-2"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="ms-1">
                    <strong>{group.name}</strong>
                    <div className="text-muted small">{group.privacy === "public" ? "Public Group" : "Private Group"}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-muted">No Groups Found</div>
            )}

          </div>

          {/* FOLLOWERS LIST */}
          <h5 className="px-3 mt-4 text-secondary">Chats</h5>
          <div className="list-group list-group-flush">
            {sidebarChats?.length > 0 ? (
              sortedSidebarChats.map((chat, index) => {
                const isOnline = onlineUsers.includes(chat._id);

                return (
                  <button
                    key={chat._id || index}
                    onClick={() => handleUserSelect(chat)}
                    className={`w-full px-3 py-2 flex items-center gap-3 rounded-3xl transition-all duration-200 border-0 bg-transparent
    ${selectedUser && chat._id === selectedUser._id
                        ? "bg-blue-100 shadow-sm"
                        : "hover:bg-gray-100"
                      }`}
                  >
                    {/* Profile Pic */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={chat.profilePic?.url || "https://via.placeholder.com/40"}
                        alt={chat.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0 text-start">
                      <div className="flex justify-between items-center">
                        <h6 className="mb-0 fw-bold truncate">
                          {chat.username}
                        </h6>

                        {chat.unreadCount > 0 && (
                          <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-green-500 text-white text-[11px] font-bold">
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="text-muted text-sm truncate">
                        {chat.lastMessage
                          ? chat.lastMessage.length > 35
                            ? chat.lastMessage.slice(0, 35) + "..."
                            : chat.lastMessage
                          : "No messages yet"}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {isOnline ? (
                          <span className="text-success fw-medium">
                            Active now
                          </span>
                        ) : chat.lastSeen ? (
                          formatLastSeen(chat.lastSeen)
                        ) : (
                          "Offline"
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-muted">
                No chats available
              </div>
            )}
          </div>
        </div>

        <div className={`col-md-8 ${isMobile && !selectedUser && !selectedGroup ? "d-none" : ""}`} style={{ maxHeight: "78vh", padding: 0 }}>

          {selectedUser ? (
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              user={user}
              selectedUser={selectedUser}
              localUser={sidebarChats}
              onLastMessageUpdate={handleLastMessageUpdate}
              onBack={handleBack}
              isMobile={isMobile}
            />
          ) : selectedGroup ? (
            <GroupChat selectedGroup={selectedGroup} user={user} onBack={handleBack} sortedSidebarChats={sortedSidebarChats} />
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
              Select a user or group to start chatting
            </div>
          )}

        </div>
      </div>



      {showGroupForm && (
        <div className="fixed inset-0 z-50">

          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowGroupForm(false)} />
          <div className="flex items-center justify-center p-4" style={{ position: "fixed", inset: 0 }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">

              <span className={groupCreateStatus ? 'absolute - left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm animate-pulse whitespace-nowrap' : 'hidden'}>
                Creating Group...
              </span>

              <button onClick={() => setShowGroupForm(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold">
                ×
              </button>



              <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Create Group</h2>



              <form className="space-y-4" onSubmit={handleGroupForm}>
                <div>
                  <label>Group Name</label>
                  <input type="text" name="name" required value={groupFormData.name} onChange={handleChange} className="form-control" />
                </div>

                <div>
                  <label>Description</label>
                  <textarea name="description" value={groupFormData.description} onChange={handleChange} className="form-control" />
                </div>

                <div>
                  <label>Group Icon</label>
                  <input type="file" accept="image/*" id="groupIcon" onChange={hanldeGroupImage} className="form-control" />
                </div>

                <div>
                  <label>Privacy</label>
                  <select name="privacy" value={groupFormData.privacy} onChange={handleChange} className="form-control">
                    <option value="public">Public Group</option>
                    <option value="private">Private Group</option>
                  </select>
                </div>


                <button type="submit" className="btn btn-primary w-100">Create Group</button>

              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
