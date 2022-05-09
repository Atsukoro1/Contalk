import {
    reportServiceAddFriend,
    reportServiceBlock,
    reportServiceDeclineFriendRequest,
    reportServiceUnblock
} from "../services/relationships.service";
import {
    relationshipsValidator,
} from "../validators/relationships.validator";

module.exports = [
    {
        url: '/relationships/block',
        method: 'DELETE',
        schema: relationshipsValidator,
        service: reportServiceUnblock
    }, 
    {
        url: '/relationships/friends',
        method: 'DELETE',
        schema: relationshipsValidator,
        service: reportServiceDeclineFriendRequest
    },
    {
        url: '/relationships/block',
        method: 'POST',
        schema: relationshipsValidator,
        service: reportServiceBlock
    },
    {
        url: '/relationships/friends', 
        method: 'POST',
        schema: relationshipsValidator,
        service: reportServiceAddFriend
    }
];