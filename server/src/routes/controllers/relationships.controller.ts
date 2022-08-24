import {
    relationshipServiceAddFriend,
    relationshipServiceBlock,
    relationshipServiceDeclineFriendRequest,
    relationshipServiceUnblock,
    relationshipsServiceFindUsers
} from "../services/relationships.service";
import {
    relationshipsValidator,
    RelationshipsFindUsersValidator,
    relationshipsQueryValidator
} from "../validators/relationships.validator";

module.exports = [
    {
        url: '/relationships/block',
        method: 'DELETE',
        schema: relationshipsQueryValidator,
        service: relationshipServiceUnblock
    }, 
    {
        url: '/relationships/friends',
        method: 'DELETE',
        schema: relationshipsQueryValidator,
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