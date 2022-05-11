import {
    relationshipServiceAddFriend,
    relationshipServiceBlock,
    relationshipServiceDeclineFriendRequest,
    relationshipServiceUnblock
} from "../services/relationships.service";
import {
    relationshipsValidator,
} from "../validators/relationships.validator";

module.exports = [
    {
        url: '/relationships/block',
        method: 'DELETE',
        schema: relationshipsValidator,
        service: relationshipServiceUnblock
    }, 
    {
        url: '/relationships/friends',
        method: 'DELETE',
        schema: relationshipsValidator,
        service: relationshipServiceDeclineFriendRequest
    },
    {
        url: '/relationships/block',
        method: 'POST',
        schema: relationshipsValidator,
        service: relationshipServiceBlock
    },
    {
        url: '/relationships/friends', 
        method: 'POST',
        schema: relationshipsValidator,
        service: relationshipServiceAddFriend
    }
];