import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyGoogleEmail, verifyLoginPassword } from "@/app/services/authService";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: { password: { label: "PIN", type: "password" } },
            async authorize(credentials) {
                const pin = credentials?.password;
                if (!pin) return null;

                const user = await verifyLoginPassword(pin);
                if (!user) return null;

                return { id: user.id, name: user.name, roleId: user.roleId };
            },
        }),
    ],

    pages: {
        signIn: "/login",
        error: "/login",
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const email = user.email;

                const employee = await verifyGoogleEmail(email);

                if (!employee) {
                    console.warn("Google login rejected — not an employee:", email);
                    return false;
                }

                user.id = employee.id;
                user.name = employee.name;
                user.roleId = employee.roleId;
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = Number(user.id);
                token.name = user.name;
                token.roleId = user.roleId;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.roleId = token.roleId;
            return session;
        }
    },


    secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
