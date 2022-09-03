import axios from "axios";
import { Notyf } from "notyf";
import { 
    FunctionComponent,
    useState,
    useEffect,
    SyntheticEvent
} from "react";

let notyf : Notyf;

const MessageInput : FunctionComponent<any> = ({
    selectedConv,
    usr
}) => {
    if(typeof(document) !== 'undefined') {
        notyf = new Notyf();
    }

    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    /*
        We're listening to changes on props and setting it as a local state
    */
    useEffect(() => {
        setSelectedConversation(selectedConv);
        setUser(usr);
    }, [selectedConv, usr]);

    /**
     * @async
     * @name sendMessage
     * @description Send message to our opponent in the current conversation
     * @param {SyntheticEvent} e 
     * @returns {Promise<void>}
     */
    async function sendMessage(e: SyntheticEvent) : Promise<void> {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            textContent: { value: string };
        };

        axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/conversation/message`, {
            textContent: target.textContent.value,
            _id: selectedConversation._id
        }, {
            withCredentials: true
        })
        .then(() => {
            target.textContent.value = "";
        })

        // Handle bad request
        .catch(err => {
            console.log(err);
            notyf.error({
                message: err.response.data.error,
                background: "#2563EB",
                dismissible: true
            });
        });
    };

    return (
        <form 
        onSubmit={sendMessage}
        className="w-full py-3 px-3 flex items-center justify-between border-t border-gray-300">
            {/* Message input */}
            <input 
                placeholder={
                    selectedConversation == null 
                    ? "You don't have a currently selected conversation"
                    : `Send a message to ${selectedConversation.creator._id == user._id 
                    ? selectedConversation.recipient.name
                    : selectedConversation.creator.name}`
                }
                className="py-2 mx-3 pl-5 block w-full rounded-full bg-gray-100 outline-none focus:text-gray-700" 
                type="text" 
                name="textContent" 
                required>
            </input>

            {/* Button to send the message from message input to the server */}
            <button className="outline-none focus:outline-none" type="submit">
                <svg 
                    className="text-gray-400 h-7 w-7 origin-center transform rotate-90" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
            </button>
        </form>
    )
};

export default MessageInput;