import { Menu, Item, useContextMenu } from 'react-contexify';
import { FunctionComponent } from "react";
import { motion } from 'framer-motion';
import { Notyf } from "notyf";
import axios from "axios";
import 'react-contexify/dist/ReactContexify.css';
import 'notyf/notyf.min.css';

// Interface of all props
interface IProps {
    name: string;
    creator: any;
    user: any;
    recipient: any;
    surname: string;
    createdAt: Date;
    lastMessage: string | null;
    lastMessageCreationDate: Date;
    isActive: boolean;
}

// Framer motion animations
const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
};

/**
 * @name parseMessageDatetime
 * @description This function is essential in order to correctly display
 * the creation date of last message.
 * 
 * These are conditions of how is this function returning time:
 * Message was sent under 60 seconds / one minute -> seconds
 * Message was sent under 24 hours / 1 day -> hours
 * Message was sent under 60 minutes / one hour -> minutes
 * Message was sent in more than one day -> days
 * @param {object | string} date 
 * @returns {string}
 */
function parseMessageDatetime(date: object | string) : string {
    if(typeof(date) === 'string') {
        const timeCreation = new Date(date);
        const timeNow = new Date();

        const dif : number = timeCreation.getTime() - timeNow.getTime();

        const seconds = Math.floor(Math.abs(Number(dif / 1000)));
        const minutes = Math.floor(Math.abs(Number(seconds / 60)));
        const hours = Math.floor(Math.abs(Number(minutes / 60)));
        const days = Math.floor(Math.abs(Number(hours / 24)));

        if(days > 1) {
            return `Before ${days} ${days == 1 ? "day" : "days"}`;
        }

        if(hours > 1) {
            return `Before ${hours} ${hours == 1 ? "hour" : "hours"}`;
        }

        if(minutes > 1) {
            return `Before ${minutes} minutes`;
        }

        return `Before ${seconds} ${seconds == 1 ? "second" : "seconds"}`;
    } else {
        return "";
    }
}

let notyf : Notyf;

const Conversation : FunctionComponent<IProps> = ({
    name,
    createdAt,
    surname,
    creator,
    user,
    recipient,
    lastMessage,
    lastMessageCreationDate,
    isActive
} : IProps) => {
    if(typeof(window) != 'undefined') {
        notyf = new Notyf();
    }

    // Create useContextMenu hook to conversation with always unique ID using date
    const { show } = useContextMenu({
        id: `CONVERSATION_${new Date(createdAt).getTime()}`
    });

    function handleContextMenu(event: any) {
        event.preventDefault();
        show(event)
    }

    async function blockUser() : Promise<void> {
        axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/relationships/block`, {
            _id: user._id == creator._id ? recipient._id : creator._id
        }, {
            withCredentials: true
        })
        // Handle success response
        .then(res => {
            return notyf.error({
                message: 'Succefully blocked user!',
                dismissible: true,
                background: '#3B82F6'
            });
        })
        // Handle bad request
        .catch(err => {
            return notyf.error({
                message: err.response.data.error,
                dismissible: true,
                background: '#3B82F6'
            });
        });
    }
 
    return (
        <motion.a 
        variants={container}
        whileTap={{
            scale: 0.94,
            borderRadius: "20px",
            speed: '0.02s'
        }}
        initial='hidden'
        animate='visible'
        onContextMenu={handleContextMenu} 
        className="m-4 hover:bg-gray-200 bg-gray-50 border-b rounded-lg border-gray-300 px-3 py-2 cursor-pointer flex items-center text-sm focus:outline-none focus:bg-gray-400 transition duration-150 ease-in-out">
            <div 
            className="relative">
                    {/* User avatar will render background with random color and first letter
                        of user's name instead of profile picture*/}
                    <div className='bg-blue-500 text-2xl text-center h-10 w-10 rounded-full text-white'>
                        <p>{name.substring(0, 1)}</p>
                    </div>
                    
                {/* Contact status bar */}
                <span className={
                    isActive ?
                    "top-0 left-7 absolute w-4 h-4 bg-green-400 border-2 border-white rounded-full"
                    : "top-0 left-7 absolute w-4 h-4 bg-gray-400 border-2 border-white rounded-full"
                }></span>
            </div>

            <div className="w-full pb-2 ml-3">
                <div className="flex justify-between">
                    {/* Main contact info and last message creation date */}
                    <span className="block ml-2 font-semibold text-base text-blue-600 ">{name} {surname}</span>
                    <span className="block ml-2 text-sm text-gray-600">{parseMessageDatetime(lastMessageCreationDate)}</span>
                </div>

                {/* Last message that was sent in this conversation */}
                {
                    !lastMessage ?
                    <span className="block ml-2 text-sm text-gray-400">
                        There is no message with this user
                    </span> :
                    <span className="block ml-2 text-sm text-gray-600">
                        {lastMessage}
                    </span>
                }
            </div>

            <Menu id={`CONVERSATION_${new Date(createdAt).getTime()}`}>
                <Item
                onClick={blockUser}>
                    Block user
                </Item>
            </Menu>
        </motion.a>
    )
}

export default Conversation;