import API from './api'

export const sendFollow = (userIdTofollow) => {
    return API.post(
        `/api/follow/${userIdTofollow}/follow`,
        {},
    );
}

export const sendUnFollow = (userIdTofollow) => {
    return API.post(
        `/api/follow/${userIdTofollow}/unfollow`,
        {},
    );
}

export const removeFollower = (followerId) => {
    return API.put(
        `/api/follow/remove-follower/${followerId}`,
        {},
    );
}


export const followBack = (followbackUserId) => {
    return API.put(`/api/follow/follow-back/${followbackUserId}`,
        {},
    )
}


export const followAccept = (acceptUserId) => {
    return API.put(`/api/follow/follow-request/accept/${acceptUserId}`,
        {},
    );
}
export const followDecline = (declineuserId) => {
    return API.delete(`/api/follow/follow-request/decline/${declineuserId}`)
}

