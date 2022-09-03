import axios from "axios";
import { FunctionComponent } from "react";
import { Notyf } from "notyf";
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import 'notyf/notyf.min.css';

interface IMessage {
    deletedFromSender: boolean;
    deletedFromReceiver: boolean;
    conversation: string;
    _id: string;
    content: string;
    createdAt: Date;
    creator: boolean;
    user: any;
}

let notyf: Notyf;

function formatTime(date: any): string {
    const dated: Date = new Date(date);
    let hours, minutes;

    hours = dated.getHours() >= 10 
    ? dated.getHours() 
    : `0${dated.getHours()}`

    minutes = dated.getMinutes() >= 10 
    ? dated.getHours()
    : `0${dated.getMinutes()}`

    return `${hours}:${minutes}`;
}

const Message : FunctionComponent<IMessage> = ({
    deletedFromSender,
    deletedFromReceiver,
    conversation,
    _id,
    content,
    createdAt,
    creator,
    user
} : IMessage) => {
    if(typeof(window) != 'undefined') {
        notyf = new Notyf();
    }

    // Create useContextMenu hook to message with always unique ID using date
    const { show } = useContextMenu({
        id: `MESSAGE_${new Date(createdAt).getTime()}`
    });

    function handleContextMenu(event: any) {
        event.preventDefault();
        show(event)
    }

    async function deleteMessage(): Promise<void> {
        axios.delete(`${process.env.NEXT_PUBLIC_BASEURL}/conversation/message?messageId=${_id}&_id=${conversation}`,
        {
            withCredentials: true
        })
        .catch(err => {
            notyf.error({
                message: err.response.data.error,
                background: "#2563EB",
                dismissible: true
            });
        })
    }

    return (
        <div className={
            creator == user._id ? "w-full flex justify-end"
            : "w-full flex justify-start"
        }>
            {/* Render message on position based on if client is message author */}
            <div 
            onContextMenu={handleContextMenu}
            className={
                creator == user._id
                ? "bg-blue-500 rounded-2xl px-5 py-2 my-2 text-white relative max-w-xl"
                : "bg-gray-400 rounded-2xl px-5 py-2 my-2 text-white relative max-w-xl"
            }>
                {/* Message content */}
                <span className="block">
                    {
                        creator == user._id
                        ? deletedFromSender
                            ? <p className="opacity-40">Message was deleted</p>
                            : <p>{content}</p>
                        : deletedFromReceiver
                            ? <p className="opacity-40">Message was deleted</p>
                            : <p>{content}</p>
                    }
                </span>

                {/* Message creation date */}
                <span className="block text-xs text-left opacity-60">
                    { formatTime(createdAt) }
                </span>
            </div>

            <Menu id={`MESSAGE_${new Date(createdAt).getTime()}`}>
                <Item
                onClick={deleteMessage}>
                    Delete
                </Item>
            </Menu>
        </div>
    )
}

export default Message;