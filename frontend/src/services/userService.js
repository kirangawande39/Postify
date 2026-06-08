import API from "./api";

export const getSuggestion = () => {
    return API.get(`/api/users/suggestions`);
}

export const getProfileData = (id) => {
    return API.get(`/api/users/${id}`);
}
export const searchUsers = (query) => {
    return API.get(`/api/users/search?query=${query}`);
}

export const updateBioAndName = (userId, data) => {
    return API.put(`/api/users/${userId}`,
        data,
    );
}

export const uploadProfilePic = (userId, data) => {
    return API.put(`/api/users/${userId}/uploadProfilePic`, data);
}

export const userPrivacy = (data) => {

    return API.put(`/api/users/privacy`,data);
}