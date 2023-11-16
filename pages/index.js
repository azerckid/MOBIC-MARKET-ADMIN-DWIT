import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) return <div>loading...</div>;
  return (
    <Layout>
      <div className="text-blue-600 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.email || "who...are...you?"}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt="avatar"
            className="w-8 h-8"
          ></img>
          <span className="py-1 px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
