// Models
import { Types, Document } from "mongoose";
import { FastifyReply } from "fastify";

// Services, models & Interfaces
import { User } from "../../models/user.model";
import { Relation } from "../../models/relation.model";
import { Conversation } from "../../models/conversation.model";

// Function that allows us to send messages from our socket io instance
import { emitEvent } from "../../loaders/websocketLoader";

/**
 * @asyncw
 * @name getRelationships
 * @description Get list of relationships from two users
 * @param {User} receiver - user receiving the friend request or new friendship
 * @param {User} user - user sending the request 
 * @returns {Promise<Array<Relation>>}
 */
async function getRelationships(receiver : User, user : User) : Promise<Array<Relation & Document>> {
    const relationships : Array<Relation & Document> = await Relation.find({ 
        $or: [ 
            { creator: new Types.ObjectId(receiver._id), target: new Types.ObjectId(user._id) }, 
            { creator: new Types.ObjectId(user._id), target: new Types.ObjectId(receiver._id) } 
        ] 
    });

    return relationships;
};

/**
 * @async
 * @name relationshipServiceAddFriend
 * @description Adding user to friends or sending the friend request
 * @param {RelationshipsRequestBody} body - Body of the request
 * @param {User} user - Request user binded to the request from midleware
 * @returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
export async function relationshipServiceAddFriend(
    body: RelationshipsRequestBody,
    user: User,
    res: FastifyReply
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User = await User.findById(body._id);

    if(!receiver ?? receiver.type === 'BANNED') {
        return res.status(400).send({
            error: "User you're trying to add user that does not exist"
        });
    }

    // Check if user is sending friend request to themselves
    if(user._id.equals(body._id)) {
        return res.status(400).send({
            error: "You can't send a friend request to yourself"
        });
    };

    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    // Check if request author already sent a friend request to opponent
    if(relationships.find(el => el.type === 'FRIEND_REQUEST' && el.creator.equals(user._id))) return res.status(400).send({
        error: "You already sent friend request to this user!"
    });

    // Check if user already have a friendship status with the opponent user
    if(relationships.find(el => el.type === 'FRIENDS')) return res.status(400).send({
        error: "You are already friends with this user!"
    });

    // Check if one of the sides sent a block request before
    if(relationships.find(el => el.type === 'BLOCKED')) return res.status(400).send({
        error: "Either you blocked the person, or the person you're trying to add blocked you."
    });

    /* 
        Check if request sender's opponent already sent a friend request
        and accept it if so, if not make a new one.
    */
    if(relationships.find(el => el.type === 'FRIEND_REQUEST' && el.creator.equals(receiver._id))) {
        await Relation.findOneAndDelete(
            { type: 'FRIEND_REQUEST', creator: receiver._id }
        );

        await Relation.insertMany([
            {
                type: 'FRIENDS',
                creator: new Types.ObjectId(user._id),
                target: new Types.ObjectId(receiver._id)
            },
            {
                type: 'FRIENDS',
                creator: new Types.ObjectId(receiver._id),
                target: new Types.ObjectId(user._id)
            }
        ]);

        // Emit the new friend data to both the connected users
        const newConv = new Conversation({
            creator: new Types.ObjectId(user._id),
            recipient: new Types.ObjectId(receiver._id)
        });

        await newConv.save();

        await emitEvent(user._id, 'conversationCreate', newConv);
        await emitEvent(receiver._id, 'conversationCreate', newConv);

        return res.status(200).send({
            success: true
        });
    } else {
        const newRelation : Relation & Document = new Relation({
            type: 'FRIEND_REQUEST',
            creator: user._id,
            target: receiver._id
        });

        await newRelation.save();

        // Emit the new friend data to both the connected users
        receiver['email'] = undefined;
        receiver['password'] = undefined;

        user['email'] = undefined;
        user['password'] = undefined;

        await emitEvent(user._id, 'friendsRequestAdd', { user: receiver });
        await emitEvent(receiver._id, 'friendsRequestAdd', { user: user });

        return res.status(200).send({
            success: true
        });
    }
};

/**
 * @async
 * @name relationshipServiceDeclineFriendRequest
 * @description Decline friend request sent by another user
 * @param {RelationshipsRequestBody} body - Body of the request
 * @param {User} user - Request user binded by the authentication middleware
 * @returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
export async function relationshipServiceDeclineFriendRequest(
    body: RelationshipsRequestBody,
    user: User,
    res: FastifyReply
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User = await User.findById(body._id);
    if(!receiver ?? receiver.type === 'BANNED') {
        return res.status(400).send({
            error: "User from whom you're trying to decline request does not exists or is banned"
        });
    };

    // Check if user is sending friend request to themselves
    if(user._id.equals(body._id)) {
        return res.status(400).send({
            error: "You can't decline friend request from yourself"
        });
    };

    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    // Check if target user sent friend request to the request author
    if(!relationships.find(el => el.type === 'FRIEND_REQUEST' && el.target.equals(user._id))) {
        return res.status(400).send({
            error: "This user didn't send you friend request"
        });
    };

    // Delete the friend request from target user because request was declined
    await relationships.find(el => el.type === 'FRIEND_REQUEST' && el.creator.equals(receiver._id)).delete()

    return res.status(200).send({
        success: true
    });
};

/**
 * @async
 * @name relationshipServiceBlock
 * @description Blocking user route
 * @param {RelationshipsRequestBody} body - Request body
 * @param {User} user - User binded by the authentication middleware
 * @returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
 export async function relationshipServiceBlock(
    body: RelationshipsRequestBody,
    user: User,
    res: FastifyReply
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User = await User.findById(body._id);

    if(!receiver ?? receiver.type === 'BANNED') {
        return res.status(400).send({
            error: "User you're trying to block does not exist"
        });
    }
    
    // Check if user is sending friend request to themselves
    if(user._id.equals(body._id)) {
        return res.status(400).send({
            error: "You can't block yourself"
        });
    };
    
    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    // Check if user is trying to block someone they already blocked
    if(relationships.find(el => el.type === 'BLOCKED' && el.creator.equals(user._id))) {
        return res.status(400).send({
            error: "You can't blocked someone you already blocked!"
        });
    };

    // Check if request author is already friend with target user and remove the friendship
    if(relationships.find(el => el.type === 'FRIENDS' && el.creator.equals(user._id))) {
        await Relation.deleteMany({ $or: 
            [
                {
                    type: 'FRIENDS',
                    creator: user._id,
                    target: receiver._id
                },
                {
                    type: 'FRIENDS',
                    creator: receiver._id,
                    target: user._id
                }
            ] 
        });
    };

    /* 
        Check if one of the users created a friend request with the opponent
        and remove all the friend request from database
    */
    if(relationships.find(el => el.type === 'FRIEND_REQUEST')) {
        await Relation.deleteMany({
            $or: [
                {
                    type: 'FRIEND_REQUEST',
                    creator: user._id,
                    target: receiver._id
                },
                {
                    type: 'FRIEND_REQUEST',
                    creator: receiver._id,
                    target: user._id
                }
            ]
        });
    };

    await Conversation.deleteMany({
        $or: [
            {
                creator: user._id,
                recipient: receiver._id
            },
            {
                creator: receiver._id,
                recipient: user._id
            }
        ]
    });

    // Create the block schemas and insert it
    await new Relation({
        type: 'BLOCKED',
        creator: user._id,
        target: receiver._id
    }).save();

    return res.status(200).send({
        success: true
    });
};

/**
 * @async
 * @name relationshipServiceUnblock
 * @description Unblock blocked user
 * @param {RelationshipsRequestBody} body - Request of the body
 * @param {User} user - User binded by the authentication middleware
 * @returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
 export async function relationshipServiceUnblock(
    body: RelationshipsRequestBody,
    user: User,
    res: FastifyReply
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User & Document = await User.findById(body._id);

    if(!receiver ?? receiver.type === 'BANNED') {
        return res.status(400).send({
            error: "User you're trying to block does not exist"
        });
    }
    
    // Check if user is removing block from themselves (they cannot)
    if(user._id.equals(body._id)) {
        return res.status(400).send({
            error: "You can't unblock yourself"
        });
    };

    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    // Check if author of the request blocked the target user
    const authorBlocked = relationships.find(el => el.type === 'BLOCKED' && user._id.equals(el.creator));
    if(!authorBlocked) {
        return res.status(400).send({
            error: "You didn't block this user!"
        });
    };

    // Delete the block and respond
    await authorBlocked.delete();
    return res.status(200).send({
        success: true
    });
};

/**
 * @exports
 * @async
 * @name relationshipsServiceFindUsers
 * @description Find some users by their full name
 * @param {RelationshipsFindUsersRequestBody} body Body of the HTTP request
 * @param {User} user Request author's user profile
 * @param {FastifyReply} res Fastify reply object to send the HTTP response back
 * @returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
export async function relationshipsServiceFindUsers(
    body: RelationshipsFindUsersRequestBody,
    user: User,
    res: FastifyReply
) : Promise<RelationshipsResponse | RelationshipsError> {
    const users : User[] | null = await User.find({
        $or: [
            {
                name: { '$regex' : body.searchString, '$options' : 'i' }
            },
            {
                surname: { '$regex' : body.searchString, '$options' : 'i' }
            }
        ],
        _id: { $ne: user._id }
    }, '_id name surname').limit(10);

    /*
        We need to find all relations and then filter user's existing friends from
        the final array
    */
    const relations : Relation[] | null = await Relation.find({
        $or: [
            {
                creator: new Types.ObjectId(user._id),
                $or: [
                    {
                        type: 'FRIENDS'
                    },
                    {
                        type: 'FRIEND_REQUEST'
                    }
                ],
                target: { 
                    $in: !users ? [] : [...users].map((el: User) : Types.ObjectId => {
                        return new Types.ObjectId(el._id)
                    }) 
                }
            },
            {
                target: new Types.ObjectId(user._id),
                $or: [
                    {
                        type: 'FRIENDS'
                    },
                    {
                        type: 'FRIEND_REQUEST'
                    }
                ],
                creator: { 
                    $in: !users ? [] : [...users].map((el: User) : Types.ObjectId => {
                        return new Types.ObjectId(el._id)
                    }) 
                }
            }
        ]
    });

    /*
        Loop through each contact and remove it from array if it contains 
        user id from the relations array because the opponent user is already
        request author's friend or he already sent a friend request
    */
    relations.forEach(el => {
        users.filter(usr => {
            if(el.creator._id.equals(usr._id) || el.target._id.equals(usr._id)) {
                const inArr : User[] | null = [...users].filter(us => {
                    return us._id.equals(el.creator) || us._id.equals(el.target)
                });

                for(const toBeRemoved of inArr) {
                    users.splice(users.indexOf(toBeRemoved), 1);
                }
            }
        })
    });

    if(users.length === 0) {
        return res.status(400).send({
            error: "No users were found!"
        });
    };

    return res.status(200).send({
        users: users
    });
};