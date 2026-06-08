import API from "./api";

export const getGroupData = (data) => {
    return API.get(`/api/groups`);
}

export const getGroupMessages = (groupId) => {
    return API.get(`/api/groups/messages/${groupId}`);
}

export const groupFormData = (data) => {
    return API.post(
        `/api/groups`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
}

export const sendGroupMessages = (data) => {
    return API.post(`/api/groups/message`, data);
}

export const addGroupMembers = (data) => {

    return API.post(`/api/groups/add-members`, data)

}

export const deleteGroupMembers = (groupId) => {
    return API.delete(`/api/groups/delete-group/${groupId}`)
}