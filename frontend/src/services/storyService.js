import API from "./api";


export const getStorys = () => {
    return API.get(`/api/stories`);
}

export const storyUpload = (data) => {
    return API.post(`/api/stories`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
} 

export const markSeen = (storyId) => {
    return API.put(
        `/api/stories/${storyId}/seen`,
        {},
    );
}

export const likeStory = (storyId) => {
    return API.put(
        `/api/stories/${storyId}/like`,
        {},
    );
}

export const unLikeStory = (storyId) => {
    return API.put(
        `/api/stories/${storyId}/unlike`,
        {},
    );
}

