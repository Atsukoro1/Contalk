import {
    relationshipServiceAddFriend,
    relationshipServiceBlock,
    relationshipServiceDeclineFriendRequest,
    relationshipServiceUnblock,
    relationshipsServiceFindUsers
} from "../services/relationships.service";
import {
    relationshipsValidator,
    RelationshipsFindUsersValidator
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
    },
    {
        url: '/relationships/findUsers',
        method: 'GET',
        schema: RelationshipsFindUsersValidator,
        service: relationshipsServiceFindUsers
    }
];