import API from './api'

export const getPostsData = (page) => {
  return API.get(`/api/posts?page=${page}&limit=5`);
}

export const getPersonalPosts = (id) => {
  return API.get(`/api/posts/${id}`);
}

export const getExplorePosts = (explorePage) => {

  return API.get(`/api/posts?page=${explorePage}&limit=5`);

}

export const sendLike = (postId) => {
  return API.post(
    `/api/likes/${postId}/like`,
    {},
  );
}

export const sendUnlike = (postId) => {
  return API.post(
    `/api/likes/${postId}/unlike`,
    {},
  );
}

export const sendUnfollow = (userId) => {
  return API.post(
    `/api/follow/${userId}/follow`,
    {},
  );
}

export const sendFollow = (userId) => {
  return API.post(
    `/api/follow/${userId}/unfollow`,
    {},
  );
}

export const createPost = (userId, data) => {
  API.post(`/api/posts/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const postDelete = (postId) => {
  return API.delete(
    `/api/posts/${postId}`,
  );
}





