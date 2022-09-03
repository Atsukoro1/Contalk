import {
  FunctionComponent,
  SyntheticEvent,
  useEffect
} from "react";
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

interface PropsI {
  setRegisterModOpened: (opened: boolean) => void;
}

const RegisterModal : FunctionComponent<PropsI> = ({
  setRegisterModOpened
  } : PropsI) => {
    let notyf : any;

    if(typeof(window) != 'undefined') {
      notyf = new Notyf();
    }

    async function register(e: SyntheticEvent) : Promise<void> {
      e.preventDefault();

      const target = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
        name: { value: string };
        surname: { value: string };
        username: { value: string };
      };

      axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/auth/register`, {
        name: target.name.value,
        surname: target.surname.value,
        email: target.email.value,
        password: target.password.value,
        username: target.username.value
      })
      // Handle success request
      .then(res => {
        document.cookie = "token=" + res.data.token;
        window.location.href = '/chat';
      })

      // Handle bad request
      .catch(err => {
        return notyf.error({
        message: err.response.data.error,
        dismissible: true,
        background: '#3B82F6'
      });
      })
    };

    return (
      <div className="fixed top-0 h-screen w-screen">
        {/* Black backgroun behind the modal */}
        <div onClick={()=> {
          setRegisterModOpened(false);
          }} 
          className="bg-black h-screen w-screen fixed top-0 opacity-40">
        </div>
        
        {/* The register modal */}
        <div 
          id="authentication-modal" 
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
            <div className="ml-auto mr-auto mt-32 relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative bg-white rounded-lg shadow ">
                
                {/* Closing button in the modal */}
                <button 
                  onClick={()=> {
                    setRegisterModOpened(false);
                  }} 
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900
                  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="authentication-modal">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd" />
                    </svg>
                </button>

                {/* Form to let users fill in their data */}
                <div className="py-6 px-6 lg:px-8">
                  <h3 className="mb-4 text-xl font-medium text-gray-900">Create a new account</h3>
                  <form onSubmit={register} className="space-y-6" action="#">
                    {/* Username form field */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                        Your username
                      </label>
                      <input type="text" name="username" id="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Hatsune" required>
                      </input>
                    </div>

                    {/* Name form field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                        Your name
                      </label>
                      <input type="text" name="name" id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="David" required>
                      </input>
                    </div>

                    {/* Surname form field */}
                    <div>
                      <label htmlFor="surname" className="block text-sm font-medium text-gray-900">
                        Your surname
                      </label>
                      <input type="text" name="surname" id="surname"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="David" required>
                      </input>
                    </div>

                    {/* Email form field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Your email
                      </label>
                      <input type="email" name="email" id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="your@email.cz" required>
                      </input>
                    </div>

                    {/* Password form field */}
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                        Your password
                      </label>
                      <input type="password" name="password" id="password" placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        required>
                      </input>
                    </div>

                    {/* Remember me checkbox */}
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="remember" 
                            type="checkbox" 
                            value=""
                            className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300">
                          </input>
                        </div>
                        <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900">Remember
                          me
                        </label>
                      </div>
                    </div>

                    {/* Button to submit the form with user-filled data */}
                    <button type="submit"
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                      Create a new user
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      };

      export default RegisterModal;