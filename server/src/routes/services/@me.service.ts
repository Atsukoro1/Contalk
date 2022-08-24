import { User } from "../../models/user.model";
import { Relation } from "../../models/relation.model";
import { Conversation } from "../../models/conversation.model";
import { FastifyReply } from "fastify";

/**
 * @export 
 * @async
 * @name fetchHomepage
 * @description Fetch data that will be displayed on user chat homepage like conversations
 * and user's / request author's profile
 * @param {undefined} query 
 * @param {User} user 
 * @param {FastifyReply} res 
 * @returns {MeResponse | MeError}
 */
export async function fetchHomepage(
    query: undefined,
    user: User,
    res: FastifyReply
): Promise <MeResponse | MeError> {
    const friendRequests : Relation[] | null = await Relation.find({
        target: user._id,
        type: 'FRIEND_REQUEST'
    })
    .populate("creator", "_id name surname isActive");

    const conversations : Conversation[] | null = await Conversation.find({
        $or: [
            {
                creator: user._id
            },
            {
                recipient: user._id
            }
        ]
    })
    .populate("lastMessage")
    .populate("recipient", "_id name surname isActive")
    .populate("creator", "_id name surname isActive");

    return res.status(200).send({
        user: user,
        conversations: conversations,
        friendRequests: friendRequests
    });
};