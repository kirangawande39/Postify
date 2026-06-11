import API from "./api";

export const sidebarChatData = (data) => {
    return API.get(`/api/chats/sidebar`)
}


export const getChatMessages = (chatId, pageNumber) => {
    return API.get(
        `/api/messages/${chatId}?page=${pageNumber}&limit=20`,
    );
}
export const messageUnseenCount=()=>{
     return API.get(`/api/messages/unseen-counts`);
}

export const fileChange = (data) => {
    return API.post(`/api/messages/image`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const createOrFetchChat = (data) => {
    return API.post(`/api/chats`,data);
}

export const sendMessage = (data) => {
    return API.post(`/api/messages`,data);
}


export const markSeenChatMessages = (chatId) => {
    return API.put(`/api/messages/seen/${chatId}`, {}).catch(console.error);
}


export const deleteMessage = (msgId)=>{
      return API.delete(`/api/messages/${msgId}`);
}
