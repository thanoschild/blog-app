import { auth, signIn, signOut } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgePlus, LogIn, LogOut } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from "@/components/ui/button";

const Navbar = async () => {
    const session = await auth();
    return (
        <header className="px-5 py-4 bg-white shadow-sm font-work-sans">
            <nav className="flex justify-between items-center">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={25} height={25} />
                </Link>

                <div className="flex items-center gap-4 text-black">
                    {
                        session && session?.user ? (
                            <>
                                <Link href="/startup/create">
                                    <Button 
                                        variant="outline" 
                                        className="flex items-center gap-2 rounded-lg hover:bg-pink-50"
                                    >
                                        <BadgePlus className="size-5" />
                                        <span className="hidden sm:inline">Create Startup</span>
                                    </Button>
                                </Link>

                                <form action={async () => {
                                    "use server";
                                    await signOut();
                                }}>
                                    <Button 
                                        type="submit"
                                        variant="outline" 
                                        className="flex items-center gap-2 rounded-lg hover:bg-red-50"
                                    >
                                        <LogOut className="size-5" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </Button>
                                </form>

                                <Link href={`/user/${session?.user?.id}`}>
                                    <Avatar className="size-10">
                                        <AvatarImage
                                            src={session?.user?.image || ""}
                                            alt={session?.user?.name || ""}
                                        />
                                        <AvatarFallback>AV</AvatarFallback>
                                    </Avatar>
                                </Link>
                            </>
                        ) : (
                            <form action={async () => {
                                "use server";
                                await signIn("github");
                            }}>
                                <Button 
                                    type="submit"
                                    variant="outline" 
                                    className="flex items-center gap-2 rounded-lg hover:bg-pink-50"
                                >
                                    <LogIn className="size-5" />
                                    <span className="hidden sm:inline">Login</span>
                                </Button>
                            </form>

                        )
                    }
                </div>
            </nav>

        </header>
    )
}

export default Navbar