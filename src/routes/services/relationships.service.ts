// Models
import { Types, Document } from "mongoose";

// Services, models & Interfaces
import {
    RelationshipsError,
    RelationshipsRequestBody,
    RelationshipsResponse
} from "../interfaces/relationships.interface";
import { User, UserType } from "../../models/user.model";
import { Relation } from "../../models/relation.model";

/**
 * Get list of relationships from two users
 * Param {User} receiver - user receiving the friend request or new friendship
 * Param {User} user - user sending the request 
 * Returns {Promise<Array<Relation>>}
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
 * Adding user to friends or sending the friend request
 * Param {RelationshipsRequestBody} body 
 * Param {User} user 
 * Returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
export async function reportServiceAddFriend(
    body : RelationshipsRequestBody,
    user: User
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User = await User.findById(body._id);

    if(!receiver ?? receiver.type === 'BANNED') {
        return {
            error: "User you're trying to add user that does not exist",
            statusCode: 400
        };
    }

    // Check if user is sending friend request to themselves
    if(body._id.toString() === user._id.toString()) {
        return {
            error: "You can't send a friend request to yourself",
            statusCode: 400
        };
    };

    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    // Check if request author already sent a friend request to opponent
    if(relationships.find(el => el.type === 'FRIEND_REQUEST' && el.creator == user._id)) return {
        error: "You already sent friend request to this user!",
        statusCode: 400
    };

    // Check if user already have a friendship status with the opponent user
    if(relationships.find(el => el.type === 'FRIENDS')) return {
        error: "You are already friends with this user!",
        statusCode: 400
    };

    // Check if one of the sides sent a block request before
    if(relationships.find(el => el.type === 'BLOCKED')) return {
        error: "Either you blocked the person, or the person you're trying to add blocked you.",
        statusCode: 400
    };

    /* 
        Check if request sender's opponent already sent a friend request
        and accept it if so, if not make a new one.
    */
    if(relationships.find(el => el.type === 'FRIEND_REQUEST' && el.creator == receiver._id)) {
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

        return {
            success: true
        };
    } else {
        const newRelation : Relation & Document = new Relation({
            type: 'FRIEND_REQUEST',
            creator: user._id,
            target: receiver._id
        });

        await newRelation.save();

        return {
            success: true
        };
    }
};

/**
 * Decline friend request sent by another user
 * Param {RelationshipsRequestBody} body 
 * Param {User} user
 * Returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
export async function reportServiceDeclineFriendRequest(
    body : RelationshipsRequestBody,
    user: User
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User = await User.findById(body._id);
    if(!receiver ?? receiver.type === 'BANNED') {
        return {
            error: "User from whom you're trying to decline request does not exists or is banned",
            statusCode: 400
        };
    };

    // Check if user is sending friend request to themselves
    if(body._id.toString() === user._id.toString()) {
        return {
            error: "You can't decline friend request from yourself",
            statusCode: 400
        };
    };

    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    // Check if target user sent friend request to the request author
    if(!relationships.find(el => el.type === 'FRIEND_REQUEST' && el.target == user._id)) {
        return {
            error: "This user didn't send you friend request",
            statusCode: 400
        };
    };

    // Delete the friend request from target user because request was declined
    await relationships.find(el => el.type === 'FRIEND_REQUEST' && el.creator == receiver._id).delete()

    return {
        success: true
    };
};

/**
 * Blocking user
 * Param {RelationshipsRequestBody} body
 * Param {User} user
 * Returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
 export async function reportServiceBlock(
    body : RelationshipsRequestBody,
    user: User
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User = await User.findById(body._id);

    if(!receiver ?? receiver.type === 'BANNED') {
        return {
            error: "User you're trying to block does not exist",
            statusCode: 400
        };
    }
    
    // Check if user is sending friend request to themselves
    if(body._id.toString() === user._id.toString()) {
        return {
            error: "You can't block yourself",
            statusCode: 400
        };
    };
    
    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    // Check if user is trying to block someone they already blocked
    if(relationships.find(el => el.type === 'BLOCKED' && el.creator == user._id)) {
        return {
            error: "You can't blocked someone you already blocked!",
            statusCode: 400
        };
    };

    // Check if request author is already friend with target user and remove the friendship
    if(relationships.find(el => el.type === 'FRIENDS' && el.creator === user._id)) {
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

    // Create the block schemas and insert it
    await new Relation({
        type: 'BLOCKED',
        creator: user._id,
        target: receiver._id
    }).save();

    return {
        success: true
    }
};

/**
 * Unblock blocked user
 * Param {RelationshipsRequestBody} body
 * Param {User} user
 * Returns {Promise<RelationshipsResponse | RelationshipsError>}
 */
 export async function reportServiceUnblock(
    body : RelationshipsRequestBody,
    user: User
) : Promise<RelationshipsResponse | RelationshipsError> {
    // Find user and check if he exists or is not banned
    const receiver : User & Document = await User.findById(body._id);

    if(!receiver ?? receiver.type === 'BANNED') {
        return {
            error: "User you're trying to block does not exist",
            statusCode: 400
        };
    }
    
    // Check if user is removing block from themselves (they cannot)
    if(body._id.toString() === user._id.toString()) {
        return {
            error: "You can't unblock yourself",
            statusCode: 400
        };
    };

    const relationships : Array<Relation & Document> = await getRelationships(receiver, user);

    const authorBlocked = relationships.find(el => el.type === 'BLOCKED' && el.creator == user._id);
    if(!authorBlocked) {
        return {
            error: "You didn't block this user!",
            statusCode: 400
        };
    };

    await authorBlocked.delete();

    return {
        success: true
    };
};