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
async function getRelationships(receiver : User, user : User) : Promise<Array<Relation>> {
    const relationships : Array<Relation> = await Relation.find({ 
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
    if(body._id.toString() === receiver._id.toString()) {
        return {
            error: "You can't send a friend request to yourself",
            statusCode: 400
        };
    };

    const relationships : Array<Relation> = await getRelationships(receiver, user);

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
            error: "User you're trying to block user that does not exist",
            statusCode: 400
        };
    }
    
    // Check if user is sending friend request to themselves
    if(body._id.toString() === receiver._id.toString()) {
        return {
            error: "You can't block yourself",
            statusCode: 400
        };
    };
    
    const relationships : Array<Relation> = await getRelationships(receiver, user);

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
    await Relation.insertMany([
        {
            type: 'BLOCKED',
            creator: receiver._id,
            target: user._id
        },
        {
            type: 'BLOCKED',
            creator: user._id,
            target: receiver._id
        }
    ]);

    return {
        success: true
    }
};