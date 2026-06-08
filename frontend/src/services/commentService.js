import API from "./api"


export const getAllComents = (postId) => {

    return API.get(`/api/comments/${postId}`);
}

export const sendComment = (postId, data) => {
    return API.post(`/api/comments/${postId}`,data);

}


export const deleteComment = (commentId) => {
    return API.delete(`/api/comments/${commentId}`);
}
