import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false); // [1
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="min-h-screen ">
        <div className="block md:hidden w-full">
          <button onClick={() => setShowNav(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex">
          <Nav show={showNav} />
          <div className="flex-grow p-4">{children}</div>
          <button
            onClick={() => signOut()}
            className=" p-2 fixed left-6 bottom-4 flex space-x-2 items-center text-primary "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="bg-backgroundGray w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => signIn("google")}
          >
            login with google
          </button>
        </div>
      </div>
    );
  }
}
