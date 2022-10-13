// Modules & External dependencies
import { Document, Types } from "mongoose";
import { FastifyReply } from "fastify";

// Interfaces, services & Models
import { User } from "../../models/user.model";
import { Relation } from "../../models/relation.model";
import { Conversation } from "../../models/conversation.model";
import { Message } from "../../models/message.model";

// Function that allows us to send messages from our socket io instance
import { emitEvent } from "../../loaders/websocketLoader";

/**
 * @async
 * @name conversationCreateService
 * @description Creates a new conversation to send messages into for two users
 * @param {ConversationCreateBody} body - Body of the HTTP request
 * @param {User} user - Author of the request's user profile
 * @returns {Promise<ConversationError | ConversationResponse>}
 */
export async function conversationCreateService(
    body: ConversationCreateBody,
    user: User,
    res: FastifyReply
) : Promise<ConversationError | ConversationResponse> {
    // Check if request author is trying to start conversation with themselves
    if(user._id.equals(body._id)) {
        return res.status(400).send({
            error: "You can't start conversation with yourself!"
        });
    };

    // Check if user that logged user is trying to start conversation with exists
    const recipient : User & Document = await User.findById(body._id);
    if(!recipient ?? recipient.type === 'BANNED') {
        return res.status(400).send({
            error: "The user you're trying to start conversation with does not exist"
        });
    };

    // Find all relations between those two users
    const relationships : Array<Relation & Document> = await Relation.find({
        $or: [
            {
                creator: recipient._id,
                target: user._id
            },
            {
                creator: user._id,
                target: recipient._id
            }
        ]
    });

    // Check if there is some block record in database 
    if(relationships.find(el => el.type === 'BLOCKED')) {
        return res.status(400).send({
            error: "You can't start conversation with this user!"
        });
    };

    // Check if these two users are friends
    const friendRec : number = relationships.filter(el => el.type === 'FRIENDS').length;
    if(friendRec != 2) {
        return res.status(400).send({
            error: "You can't start conversation with someone you're not friends with."
        });
    };

    // Check if user already have a conversation 
    const existingCon : Relation | null = await Conversation.findOne({
        $or: [
            {
                creator: recipient._id,
                recipient: user._id
            },
            {
                creator: user._id,
                recipient: recipient._id
            }
        ]
    });

    if(existingCon) {
        return res.status(400).send({
            error: "You already have a conversation with this user!"
        });
    };

    const newConv = new Conversation({
        creator: user._id,
        recipient: recipient._id
    });

    await newConv.save();

    // Send the new conversation data to both users
    await emitEvent(user._id, 'conversationCreate', newConv);
    await emitEvent(recipient._id, 'conversationCreate', newConv);

    return res.status(200).send({
        success: true
    });
};

/**
 * @async
 * @name conversationChangeTitleService
 * @description Change the conversation title to something else
 * @param {ConversationChangeTitleBody} body - Body of the HTTP request
 * @param {User} user - Request author's user profile
 * @returns {Promise<ConversationError | ConversationResponse>}
 */
export async function conversationChangeTitleService(
    body: ConversationChangeTitleBody,
    user: User,
    res: FastifyReply
) : Promise<ConversationError | ConversationResponse> {
    // Find the conversation provided by user from the request and check if it exists
    const conversation : Conversation & Document = await Conversation.findById(body._id);
    if(!conversation) {
        return res.status(400).send({
            error: "This conversation does not exist!"
        });
    };

    // Check if request author does have rights to edit conversation title (is in the conversation)
    if(!conversation.recipient.equals(user._id) && !conversation.creator.equals(user._id)) {
        return res.status(400).send({
            error: "You don't have permissions to edit title of this conversation"
        });
    };

    // Change title to whatever the user wants to and save
    conversation.title = body.title;
    await conversation.save();

    // Send the new conversation to both of the users
    await emitEvent(user._id, 'conversationChangeTitle', conversation);
    await emitEvent(
        conversation.recipient.equals(user._id) ? conversation.creator : conversation.recipient,
        'conversationChangeTitle', conversation
    );

    return res.status(200).send({
        success: true
    });
};

/**
 * @async
 * @name conversationSendMessage
 * @description Send a message to specific conversation
 * @param {ConversationC} body - Body of the HTTP request
 * @param {User} user - Request author's user profile
 * @returns {Promise<ConversationError | ConversationResponse>}
 */
export async function conversationSendMessage(
    body: ConversationSendMessageBody,
    user: User,
    res: FastifyReply
) : Promise<ConversationError | ConversationResponse> {
    // Find conversation by id provided in the request body and check if it exists
    const conversation : Conversation & Document = await Conversation.findById(body._id);
    if(!conversation) {
        return res.status(400).send({
            error: "This conversation does not exist!"
        });
    };

    // Check if user has rights to post into the conversation (is creator or receiver)
    if(!conversation.creator.equals(user._id) && !conversation.recipient.equals(user._id)) {
        return res.status(400).send({
            error: "You don't have rights to post into this conversation"
        });
    };

    // Create a new message and set it as last in current conversation
    const newMessage = new Message({
        content: body.textContent, 
        conversation: new Types.ObjectId(body._id),
        author: user._id
    });

    await newMessage.save();
    await conversation.updateOne({
        lastMessage: newMessage._id
    });

    let toSendMessage: Message = await newMessage.populate("author", "name");

    // Send the message to the both connected users
    await emitEvent(user._id, 'messageCreate', toSendMessage);
    await emitEvent(
        conversation.recipient.equals(user._id) ? conversation.creator : conversation.recipient,
        'messageCreate', toSendMessage
    );

    return res.status(200).send({
        success: true
    });
};

/**
 * @async
 * @name conversationDeleteMessage
 * @description Delete message from specific conversation
 * @param {ConversationDeleteMessageBody} body - Body of the HTTP request
 * @param {User} user - Request author's user profile
 * @returns {Promise<ConversationError | ConversationResponse>}
 */
export async function conversationDeleteMessage(
    body: ConversationDeleteMessageBody,
    user: User,
    res: FastifyReply
) : Promise<ConversationError | ConversationResponse> {
    // Find conversation and check if it exists
    const conversation : Conversation & Document | null = await Conversation.findById(body._id);
    if(!conversation) {
        return res.status(400).send({
            error: "This conversation does not exist!"
        });
    };

    // Check if user has rights to make changes in this conversation
    if(!user._id.equals(conversation.creator) && !user._id.equals(conversation.recipient)) {
        return res.status(400).send({
            error: "You don't have permissions to manage things in this conversation!"
        });
    };

    // Find message and check if it exists
    const message : Message & Document | null = await Message.findById(body.messageId);
    if(!message) {
        return res.status(400).send({
            error: "This message does not exist!"
        });
    };

    /*
        We're not deleting the message from database completely in order to make it
        fully tracable when someone reports other user, because of that, it's not possible
        for the user to make a message completely dissapear
    */
    if(message.author.equals(user._id) && !message.deletedFromSender) {
        // Message author is also user that made the request, set the delete from sender property
        message.deletedFromSender = true;
        await message.save();

    } else if (!message.author.equals(user._id) && !message.deletedFromReceiver) {
        // Message author is the receiver of the message, set the delete from receiver property
        message.deletedFromReceiver = true;
        await message.save();
    };

    // Send the edited message to the both connected user
    await emitEvent(user._id, 'messageDelete', message);
    await emitEvent(
        conversation.recipient.equals(user._id) ? conversation.creator : conversation.recipient,
        'messageDelete', message
    );

    return res.status(200).send({
        success: true
    });
};

/**
 * @async
 * @name conversationMessageEditService
 * @description Edit message in specific conversation
 * @param {ConversationEditMessageBody} body - Body of the HTTP request
 * @param {User} user - Request author's user profile
 * @returns {Promise<ConversationError | ConversationResponse>}
 */
export async function conversationMessageEditService(
    body: ConversationEditMessageBody,
    user: User,
    res: FastifyReply
) : Promise<ConversationError | ConversationResponse> {
    // Find conversation and check if it exists
    const conversation : Conversation & Document | null = await Conversation.findById(body._id);
    if(!conversation) {
        return res.status(400).send({
            error: "This conversation does not exist!"
        });
    };

    // Check if user has rights to make changes in this conversation
    if(!user._id.equals(conversation.creator) && !user._id.equals(conversation.recipient)) {
        return res.status(400).send({
            error: "You don't have permissions to manage things in this conversation!"
        });
    };

    // Find message and check if it exists
    const message : Message & Document | null = await Message.findById(body.messageId);
    if(!message) {
        return res.status(400).send({
            error: "This message does not exist!"
        });
    };

    // Check is request author is also the author of the message
    if(!message.author.equals(user._id)) {
        return res.status(400).send({
            error: "You don't have permissions to make changes to this message!"
        });
    };

    // Change content and save the message
    message.content = body.textContent;
    await message.save();

    // Send the edited message to the both connected users
    await emitEvent(user._id, 'messageEdit', message);
    await emitEvent(
        conversation.recipient.equals(user._id) ? conversation.creator : conversation.recipient,
        'messageEdit', message
    );

    return res.status(200).send({
        success: true
    });
};

/**
 * @export
 * @async
 * @name conversationFetchMessages
 * @description Fetch messages from specific conversation
 * @param {ConversationFetchMessagesBody} body 
 * @param {User} user 
 * @param {FastifyReply} res 
 */
export async function conversationFetchMessages(
    body: ConversationFetchMessagesBody,
    user: User,
    res: FastifyReply
) : Promise<ConversationError | ConversationResponse> {
    const conversation : Conversation | null = await Conversation.findById(body._id);
    if(!conversation) {
        return res.status(400).send({
            error: "This conversation does not exist!"
        });
    };

    // Check if user has rights to make changes in this conversation
    if(!user._id.equals(conversation.creator) && !user._id.equals(conversation.recipient)) {
        return res.status(400).send({
            error: "You don't have permissions to manage things in this conversation!"
        });
    };
    
    const messages : Message[] | null = await Message.find({
        conversation: conversation._id
    }).sort({ createdAt: -1 }).exec();

    return res.status(200).send(messages.reverse());
};