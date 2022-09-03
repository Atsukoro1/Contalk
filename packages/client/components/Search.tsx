import axios from "axios";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import { 
    FunctionComponent,
    SyntheticEvent,
    useState
} from "react";

let notyf : Notyf;

const Search : FunctionComponent = () => {
    if (typeof window !== "undefined") {
        notyf = new Notyf();
    }
    
    const [foundUsers, setFoundUsers] = useState<any>(null);

    /**
     * @name clearFoundUsers
     * @description Set found users to null, function is used to close
     * the modal because it renders based on found users state
     * @returns {void}
    */
    function clearFoundUsers() : void {
        setFoundUsers(null);
    };

    /**
     * @async
     * @name searchUsers
     * @description Search for users by some value
     * @param {SyntheticEvent} e Event like value
     * @returns {Promise<void>} 
     */
    async function searchUsers(e: SyntheticEvent) : Promise<void> {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            searchString: { value: string };
        };

        const data = axios.get(
            `${process.env.NEXT_PUBLIC_BASEURL}/relationships/findUsers?searchString=${target.searchString.value}`,
            {
                withCredentials: true
            }
        )

        // Handle successful response
        .then(res => {
            setFoundUsers(res.data.users);
        })

        // Handle bad request
        .catch(err => {
            notyf.error({
                message: err.response.data.error,
                background: "#2563EB",
                dismissible: true
            });
        });
    }

    async function addUser(_id: string) : Promise<void> {
        const data = axios.post(
            `${process.env.NEXT_PUBLIC_BASEURL}/relationships/friends`,
            {
                _id: _id
            },
            {
                withCredentials: true
            }
        )

        // Handle success response
        .then(res => {
            notyf.error({
                message: "Succefully sent a friend request to the user!",
                background: "#2563EB",
                dismissible: true
            });

            const index = foundUsers.indexOf([...foundUsers].filter(el => {
                return el._id == _id
            }));

            if(foundUsers.length == 1) {
                setFoundUsers(null);
            } else {
                const newArr = [...foundUsers].splice(index, 1);
                setFoundUsers(newArr);
            }
        })

        // Handle bad request
        .catch(err => {
            notyf.error({
                message: err.response.data.error,
                background: "#2563EB",
                dismissible: true
            });
        })
    }
    
    return (
        <div className="my-3 mx-3 ">
            <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg 
                        fill="none" 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24" 
                        className="w-6 h-6 text-gray-500">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </span>

                <form onSubmit={searchUsers}>
                    <input 
                        placeholder="Search for friends"
                        className="py-2 pl-10 block w-full rounded bg-gray-100 outline-none focus:text-gray-700" 
                        type="searchString" 
                        name="searchString" 
                        required>
                    </input>
                </form>
            </div>

            {
                foundUsers ?
                <div className="p-2 z-10 rounded-md drop-shadow-2xl absolute top-20 w-80 max-w-l bg-white">
                    <div className="grid gap-2" style={{ gridTemplateColumns: 'auto auto' }}>
                        <div className="text-left">
                            <h3 className="font-normal mb-2">Found contacts</h3>
                        </div>

                        <div className="text-right">
                            <button 
                                onClick={clearFoundUsers}
                                className="bg-gray-200 pl-2 pr-2 pt-1 pb-1 rounded-lg text-gray-400 font-semibold text-xs">
                                ╳
                            </button>
                        </div>
                    </div>

                    {
                        foundUsers.map((el: any, key: number) => {
                            return (
                                <div className="flex items-center border-t p-2 border-gray-300">
                                    <div className="relative">
                                        <div className='bg-blue-500 text-center text-2xl h-10 w-10 rounded-full text-white'>
                                            {el.name.substring(0,1)}
                                        </div>
                                    </div>

                                    <span className="block ml-2 text-base text-gray-600">
                                        {el.name + " " + el.surname}
                                    </span>

                                    <button 
                                        onClick={() => { addUser(el._id) }}
                                        className="absolute right-3">
                                        <svg 
                                            version="1.1" 
                                            id="Capa_1" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            x="0px" 
                                            y="0px"
	                                        width="25.902px" 
                                            height="25.902px" 
                                            viewBox="0 0 45.902 45.902">
                                            <g>
                                            	<g>
                                            		<path fill="#CBD5E1" d="M43.162,26.681c-1.564-1.578-3.631-2.539-5.825-2.742c1.894-1.704,3.089-4.164,3.089-6.912
                                            			c0-5.141-4.166-9.307-9.308-9.307c-4.911,0-8.932,3.804-9.281,8.625c4.369,1.89,7.435,6.244,7.435,11.299
                                            			c0,1.846-0.42,3.65-1.201,5.287c1.125,0.588,2.162,1.348,3.066,2.26c2.318,2.334,3.635,5.561,3.61,8.851l-0.002,0.067
                                            			l-0.002,0.057l-0.082,1.557h11.149l0.092-12.33C45.921,30.878,44.936,28.466,43.162,26.681z"/>
                                            		<path fill="#CBD5E1" d="M23.184,34.558c1.893-1.703,3.092-4.164,3.092-6.912c0-5.142-4.168-9.309-9.309-9.309c-5.142,0-9.309,4.167-9.309,9.309
                                            			c0,2.743,1.194,5.202,3.084,6.906c-4.84,0.375-8.663,4.383-8.698,9.318l-0.092,1.853h14.153h15.553l0.092-1.714
                                            			c0.018-2.514-0.968-4.926-2.741-6.711C27.443,35.719,25.377,34.761,23.184,34.558z"/>
                                            		<path fill="#CBD5E1" d="M6.004,11.374v3.458c0,1.432,1.164,2.595,2.597,2.595c1.435,0,2.597-1.163,2.597-2.595v-3.458h3.454
                                            			c1.433,0,2.596-1.164,2.596-2.597c0-1.432-1.163-2.596-2.596-2.596h-3.454V2.774c0-1.433-1.162-2.595-2.597-2.595
                                            			c-1.433,0-2.597,1.162-2.597,2.595V6.18H2.596C1.161,6.18,0,7.344,0,8.776c0,1.433,1.161,2.597,2.596,2.597H6.004z"/>
                                            	</g>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
                : ""
            }
        </div>
    )
}

export default Search;