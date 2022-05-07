// Modules & External dependencies
import { Document } from "mongoose";

// Interfaces, services & Models
import {
    ConversationError,
    ConversationResponse,
    ConversationCreateBody
} from "../interfaces/conversation.interface"
import { User } from "../../models/user.model";
import { Relation } from "../../models/relation.model";
import { Conversation } from "../../models/conversation.model";

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
            error: "You can't add this user!",
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