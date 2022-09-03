import { FunctionComponent } from "react";

interface PropsI {
    isActive: boolean;
    name: string;
}

const ActualContact : FunctionComponent<PropsI> = ({
    isActive,
    name
} : PropsI) => {
    return (
        <div className="flex items-center border-b border-gray-300 pl-3 py-3">
            {/* Contact profile picture and status */}
            <div className="relative">
                {/* User avatar will render background with random color and first letter
                    of user's name instead of profile picture*/}
                <div className='bg-blue-500 text-2xl text-center h-10 w-10 rounded-full text-white'>
                    {name.substring(0, 1)}
                </div>

                {/* Render offline/online status based on user activity */}
                <span className={
                    isActive ? "animate-ping top-0 left-7 absolute  w-4 h-4 bg-green-400 border-2 border-white rounded-full"
                    : "top-0 left-7 absolute  w-4 h-4 bg-gray-400 border-2 border-white rounded-full"
                }/>
                <span className={
                    isActive ? "top-0 left-7 absolute  w-4 h-4 bg-green-400 border-2 border-white rounded-full"
                    : "top-0 left-7 absolute  w-4 h-4 bg-gray-400 border-2 border-white rounded-full"
                }/>
            </div>

            {/* Contact name */}
            <span className="block ml-2 font-bold text-base text-gray-600">
                { name }
            </span>
        </div>
    )
}

export default ActualContact;