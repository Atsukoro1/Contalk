// Modules & External dependencies
import { Document } from "mongoose";

// Interfaces, services & Models
import {
    ConversationError,
    ConversationResponse,
    ConversationCreateBody,
    ConversationChangeTitleBody
} from "../interfaces/conversation.interface"
import { User } from "../../models/user.model";
import { Relation } from "../../models/relation.model";
import { Conversation } from "../../models/conversation.model";

/**
 * Creates a new conversation to send messages into for two users
 * Param {ConversationCreateBody} body 
 * Param {User} user 
 * Returns {Promise<ConversationError | ConversationResponse>}
 */
export async function conversationCreateService(
    body : ConversationCreateBody,
    user : User
) : Promise<ConversationError | ConversationResponse> {
    // Check if user that logged user is trying to start conversation with exists
    const recipient : User & Document = await User.findById(body._id);
    if(!recipient ?? recipient.type === 'BANNED') {
        return {
            error: "The user you're trying to start conversation with does not exist",
            statusCode: 400
        };
    };

    // Check if either logged user or recipient sent a block request
    const blocked : Array<Relation & Document> = await Relation.find({
        $or: [
            {
                type: 'BLOCKED',
                creator: recipient._id,
                target: user._id
            },
            {
                type: 'BLOCKED',
                creator: user._id,
                target: recipient._id
            }
        ]
    });
    if(blocked) {
        return {
            error: "You can't start conversation with this user!",
            statusCode: 400
        };
    };

    await new Conversation({
        creator: user._id,
        recipient: recipient._id
    }).save();

    return {
        success: true
    };
};

/**
 * Change the conversation title to something else
 * Param {ConversationChangeTitleBody} body 
 * Param {User} user 
 * Returns {Promise<ConversationError | ConversationResponse>}
 */
export async function conversationChangeTitleService(
    body : ConversationChangeTitleBody,
    user : User
) : Promise<ConversationError | ConversationResponse> {
    // Find the conversation provided by user from the request and check if it exists
    const conversation : Conversation & Document = await Conversation.findById(body._id);
    if(!conversation) {
        return {
            error: "This conversation does not exist!",
            statusCode: 400
        };
    };

    // Check if request author does have rights to edit conversation title (is in the conversation)
    if(conversation.recipient !== user._id && conversation.creator !== user._id) {
        return {
            error: "You don't have permissions to edit title of this conversation",
            statusCode: 400
        };
    };

    // Change title to whatever the user wants to and save
    conversation.title = body.title;
    await conversation.save();

    return {
        success: true
    }
};