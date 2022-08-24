// Libraries
import { NextPage } from "next";
import axios from "axios";
import { useState, useEffect, useSyncExternalStore } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

// Components
import Conversation from "../components/Conversation";
import Message from "../components/Message";
import ActualContact from "../components/ActualContact";
import Search from "../components/Search";
import MessageInput from "../components/MessageInput";
import FriendRequests from "../components/FriendRequests";

function getToken(cookieString: string) : string | null {
    if(cookieString.length == 0) return null;

    const cookie : any = cookieString.split(';').map(el => {
        const key : string = el.split('=')[0];
        const value : string = el.split('=')[1];
        
        if(key == 'token') {
            return value;
        };
    });

    return !cookie ? null : cookie[0];
}


const Chat : NextPage = () => {
    const [conversations, setConversations] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any>(null);
    const [friendRequests, setFriendRequests] = useState<any>(null);
    const [socket, setSocket] = useState<any>(null);

    function fetchMess() : Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/conversation/messages?_id=${selectedConversation._id}`,
            {
                withCredentials: true
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
        });
    };

    async function connectAndListenWebsocket() : Promise<void> {
        if(socket) await socket.disconnect();

        const newSocket = io(`${process.env.NEXT_PUBLIC_BASEURL}?token=${getToken(document.cookie)}`);
        await newSocket.connect();
        setSocket(newSocket);
        newSocket.on('messageCreate', (obj: any) => {
            if(selectedConversation?._id == obj.conversation) {
                const f = [...messages];
                f.push(obj);
                setMessages(f);

                const doc = document.getElementById('chat');
                if(doc) {
                    setTimeout(() => {
                        doc.scrollTop = doc.scrollHeight;
                    }, 100)
                }
            }
        });

        newSocket.on('messageDelete', (obj: any) => {
            if(selectedConversation?._id == obj.conversation) {
                const f = [...messages];
                f[f.indexOf(f.filter(el => el._id == obj._id)[0])] = obj;
                setMessages(f);
            }
        });
    };

    async function loadEssentials() : Promise<void> {
        try {
            if(typeof(getToken(document.cookie)) != 'string') {
                window.location.href = '/';
            }
    
            const data = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/@me`, {
                withCredentials: true
            });

            setUser(data.data.user);
            setConversations(data.data.conversations);
            setFriendRequests(data.data.friendRequests);
        } catch(err) {
            window.location.href = '/';
        }
    }

    useEffect(() => {
        connectAndListenWebsocket();
    }, [messages]);

    /*
        This hook will run when selected conversation changes and it will
        fetch messages from there. 
        Also set the time from the last message to fetchMessagesFrom state
        because we need that variable to fetch other messages over it
    */
    useEffect(() => {
        if(selectedConversation == null) return;

        setMessages(null);

        fetchMess()

        .then(fetchedMessages => {
            setMessages(fetchedMessages.data);
        })
    }, [selectedConversation]);

    /*
        This hook will run when the conversations array changes
        Will always pick the first conversation and set it as selected
        essential on component render 
    */
    useEffect(() => {
        if(conversations != null) {
            setSelectedConversation(conversations[0]);
        };
    }, [conversations]);

    /*
        Will run on the page render 
        this hook is running all functions essential to get 
        the correct data we need
    */
    useEffect(() : void => {
        (async function() {
            await loadEssentials();
        }());
    }, []);

    return (
        <div className="w-screen">
            <div 
                className="grid grid-cols-3 min-w-full w-screen h-screen border rounded" 
                style={{ minHeight: '80vh' }}>
                <div className="col-span-1 bg-white border-r border-gray-300">

                {/* Search for friends input */}
                <Search/>

                {/* Display user's friend requests */}
                <FriendRequests frReqs={friendRequests}/>

                {/* List of conversations opened by user */}
                <ul 
                    className="overflow-auto" 
                    style={{ height: '500px' }}>
                    <h2 className="ml-2 mb-2 text-gray-600 text-lg my-2">Chats</h2>
                    <li>
                        {/* Display conversations with other users */}
                        {
                            !conversations ? ""
                            : conversations.map((el: any, key: number) => {
                                return <div onClick={() => {
                                    setSelectedConversation(el);
                                }}>
                                    <Conversation 
                                        // User that is logged in
                                        user={
                                            user
                                        }
                                        // Creator of the conversation
                                        creator={
                                            el.creator
                                        }
                                        // User who received the conversation from opponent
                                        recipient={
                                            el.recipient
                                        }
                                        // Conversation creation date
                                        createdAt={
                                            el.createdAt
                                        }       
                                        // Recipient's name
                                        name={
                                            el.creator._id == user._id ? el.recipient.name
                                            : el.creator.name
                                        }
                                        // Recipient's surname
                                        surname={
                                            el.creator._id == user._id ? el.recipient.surname
                                            : el.creator.surname
                                        }
                                        // If recipient is active
                                        isActive={
                                            el.creator._id == user._id ? el.recipient.isActive 
                                            : el.creator.isActive
                                        }
                                        // Last message sent in the coversation with the recipient
                                        lastMessage={
                                            el.lastMessage == null ? null
                                            : el.lastMessage.content
                                        } 
                                        // Creation date of the last message sent with the recipient
                                        lastMessageCreationDate={
                                            el.lastMessage == null ? new Date()
                                            : el.lastMessage.createdAt
                                        }
                                        key={key}/>
                                </div> 
                            })
                        }
                    </li>
                </ul>
            </div>

            <div className="col-span-2 bg-white">
                <div className="w-full">
                    {/* Contact that is selected to chat with */}
                    {
                        selectedConversation == null ? ""
                        : <ActualContact 
                            isActive={
                                selectedConversation.creator._id == user._id ? selectedConversation.recipient.isActive
                                : selectedConversation.creator.isActive
                            } 
                            name={
                                selectedConversation.creator._id == user._id ? selectedConversation.recipient.name
                                : selectedConversation.creator.name
                            }/>
                    }

                    {/* Chat div containing messages */}
                    <div
                        id="chat" 
                        className="w-full overflow-y-auto p-10 relative" 
                        style={{ height: '700px' }}>
                        <ul>
                            <li className="clearfix2">
                                {
                                    !messages ? "" :
                                    messages.map((el: any, key: number) => {
                                        return <motion.div
                                        key={key}
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: {
                                              y: 0,
                                              opacity: 1
                                            }
                                        }}
                                        initial='hidden'
                                        animate='visible'
                                        >
                                            <Message 
                                            deletedFromReceiver={el.deletedFromReceiver}
                                            deletedFromSender={el.deletedFromSender}
                                            conversation={el.conversation}
                                            _id={el._id}
                                            createdAt={el.createdAt} 
                                            content={el.content}
                                            creator={el.author}
                                            user={user}
                                            />
                                        </motion.div>
                                    })
                                }
                            </li>
                        </ul>
                    </div>

                    <MessageInput 
                        selectedConv={selectedConversation} 
                        usr={user}>
                    </MessageInput>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Chat;