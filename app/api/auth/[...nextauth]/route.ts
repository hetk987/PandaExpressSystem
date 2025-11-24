import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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

                const res = await fetch(process.env.NEXTAUTH_URL + "/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password: pin }),
                });

                const data = await res.json();
                if (!res.ok) return null;

                return { id: data.name, name: data.name };
            },
        }),
    ],

    secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
