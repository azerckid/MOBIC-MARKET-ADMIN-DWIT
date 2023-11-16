import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = ["azerckid@gmail.com"];
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      console.log({ session, token, user });
      if (user && adminEmails.includes(user.email)) {
        session.user.isAdmin = true;
        return session;
      } else {
        session.user.isAdmin = false;
        return false;
      }
    },
  },
};
export default NextAuth(authOptions);
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (adminEmails.includes(session.user.email)) {
    return true;
  } else {
    throw new Error("Unauthorized");
    return false;
  }
}
