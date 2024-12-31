import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";
import type { Profile, Session } from "next-auth"

interface GitHubProfile extends Profile {
    id: string;
    login: string;
    bio: string | null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!profile) return false;
            const { id, login, bio } = profile as GitHubProfile;
            const { name, email, image } = user;
            console.log("id: ", id);

            const existingUser = await client
                .withConfig({ useCdn: false })
                .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                    id,
                });

            if (!existingUser) {
                await writeClient.create({
                    _type: "author",
                    id,
                    name,
                    username: login,
                    email,
                    image,
                    bio: bio || "",
                });
            }

            return true;
        },
        async jwt({ token, account, profile }) {
            if (profile) {
                console.log("profile: ", profile.id);
                const user = await client
                    .withConfig({ useCdn: false })
                    .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                        id: profile?.id,
                    });
                console.log("user: ", user);

                token.id = user._id;
            }
            return token;
        },
        async session({ session, token }): Promise<Session & { user: { id: string } }> {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string
                }
            }
        }
    },
});

