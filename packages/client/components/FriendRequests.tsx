import { 
    FunctionComponent,
    useEffect,
    useState
} from "react";
import axios from "axios";
import { Notyf } from 'notyf';

interface PropsI {
    frReqs: object[] | null
}

let notyf : Notyf;

const FriendRequests : FunctionComponent<PropsI> = ({
    frReqs
} : PropsI) => {
    if(typeof(window) !== 'undefined') {
        notyf = new Notyf();
    };

    const [frr, setFrr] = useState<any>([]);

    useEffect(() => {
        if(frReqs == null) {
            setFrr([]);
        } else {
            setFrr(frReqs);
        }
    }, [frReqs]);

    function removeFromFriendRequests(id: string) : void {
        const arrCopy = [...frr];
        arrCopy.splice(arrCopy.indexOf(arrCopy.filter(el => el._id == id)), 1);
        setFrr(arrCopy);
    };
    
    async function declineFriendRequest(id: string) : Promise<any> {
        axios.delete(process.env.NEXT_PUBLIC_BASEURL + '/relationships/friends?_id=' + id, 
        {
            withCredentials: true
        })
        .then(res => {
            removeFromFriendRequests(id);
            notyf.error({
                message: "Succefully declined user friend request !",
                background: "#2563EB",
                dismissible: true
            });
        })
        .catch(err => {
            console.log(err);
            notyf.error({
                message: err.response.data.error,
                background: "#2563EB",
                dismissible: true
            });
        });
    };

    async function acceptFriendRequest(id: string) : Promise<void> {
        axios.post(process.env.NEXT_PUBLIC_BASEURL + '/relationships/friends', 
        {
            _id: id
        },
        {
            withCredentials: true
        })
        .then(res => {
            removeFromFriendRequests(id);
            notyf.error({
                message: "Succefully added user as friend!",
                background: "#2563EB",
                dismissible: true
            });
        })
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
        <div className="mb-5">
            {
                frr.length == 0 ? ""
                : <h2 className="ml-2 mb-2 text-gray-600 text-lg my-2">Incoming friend requests</h2>
            }

            {
                frr.length != 0 ?
                frr.map((el: any, key: number) => {
                    return (
                        <div key={key} className="bg-gray-100 border-b border-gray-300 px-3 py-2 cursor-pointer flex items-center text-sm focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
                            {/* Friend request author's avatar */}
                            <div className="bg-blue-500 text-2xl text-center h-10 w-10 rounded-full text-white">
                                {el.creator.name.substring(0,1)}
                            </div>

                            {/* Friend request author's  */}
                            <span className="block ml-2 text-sm font-bold text-blue-600">
                                { el.creator.name }
                            </span>

                            {/* Buttons to either decline or accept friend request author's request */}
                            <div className="ml-5">
                                <button 
                                    onClick={() => { acceptFriendRequest(el.creator._id) }}
                                    className="mr-2 bg-transparent border-solid focus:ring-2 hover:bg-blue-500 hover:text-white transition-all border-blue-500 border-2 p-1 rounded-md text-blue-500">
                                    Accept
                                </button>

                                <button
                                    onClick={() => { declineFriendRequest(el.creator._id)}} 
                                    className="bg-transparent border-solid focus:ring-2 hover:bg-blue-500 hover:text-white transition-all border-blue-500 border-2 p-1 rounded-md text-blue-500">
                                    Decline
                                </button>
                            </div>
                        </div>
                    )
                })
                : ""
            }
        </div>
    )
};

export default FriendRequests;