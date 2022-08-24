import { 
  FunctionComponent, 
  SyntheticEvent 
} from "react";
import axios from 'axios';
import { Notyf } from 'notyf';

interface PropsI {
    setLoginModOpened: (opened: boolean) => void;
}

const LoginModal : FunctionComponent<PropsI> = ({
    setLoginModOpened
} : PropsI) => {
  let notyf : any;

  if (typeof window !== "undefined") {
    notyf = new Notyf();
  }

  async function login(e: SyntheticEvent) : Promise<void> {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/auth/login`, {
      email: target.email.value,
      password: target.password.value
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
        {/* Black background behind modal */}
        <div 
          onClick={()=> { 
            setLoginModOpened(false); 
          }} 
          className="bg-black h-screen w-screen fixed top-0 opacity-40">
        </div>
        
        {/* Modal content */}
        <div 
          id="authentication-modal" 
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
          <div className="ml-auto mr-auto mt-32 relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow ">

              {/* Modal closing button */}
              <button 
                onClick={()=> {
                  setLoginModOpened(false);
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

              {/* An actual form to let user input data */}
              <div className="py-6 px-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900">Login to an existing account</h3>
                <form 
                  onSubmit={login} 
                  className="space-y-6" 
                  action="#">

                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">Your
                    email
                  </label>
                  <input type="email" name="email" id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="your@email.cz" required>
                  </input>
                </div>

                {/* Password input */}
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                    Your password
                  </label>
                  <input type="password" name="password" id="password" placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    required>
                  </input>
                </div>

                {/* Checkbox that will handle how long will the cookie last */}
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" type="checkbox" value=""
                        className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300">
                      </input>
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900">
                      Remember me
                    </label>
                  </div>
                </div>

                {/* Submit button that will submit the filled form */}
                <button 
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                    Login to an existing account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal;