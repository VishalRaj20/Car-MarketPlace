import Link from 'next/link';
import Image from 'next/image';
import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { ArrowLeft, CarFront, Heart, Layout } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';

// this will verify it is admin page or not 
const Header = async ({ isAdminPage = false }) => {

    const user = await checkUser();

    const isAdmin = user?.role === "ADMIN";  // this will verify it is admin or not
    return (
        <header className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
            <nav className='mx-auto px-4 py-4 flex items-center justify-between'>
                <Link href={isAdminPage ? "/admin" : "/"} className='flex'>
                    <Image
                        src={"/Car logo.png"}
                        alt="vehicle Logo"
                        width={300}          // Increased width
                        height={150}         // Increased height
                        className='h-13 w-50'  // Updated Tailwind height
                    />
                </Link>
                <div className='flex items-center space-x-4'>
                    {isAdminPage ? (
                        <Link href='/'>
                            <Button variant='outline' className='flex items-center gap-2 cursor-pointer' >
                                <ArrowLeft size={18} />
                                <span className='hidden md:inline'>Back to App</span>
                            </Button>
                        </Link>) : (
                        <SignedIn>
                            <Link href='/saved-cars'>
                                <Button className="cursor-pointer">
                                    <Heart size={18} />
                                    <span className='hidden md:inline'>Saved cars</span>
                                </Button>
                            </Link>
                            {!isAdmin ? (<Link href='/reservation'>
                                <Button variant="outline">
                                    <CarFront size={18} />
                                    <span className='hidden md:inline'>My Reservations</span>
                                </Button>
                            </Link>) : (
                                <Link href='/admin'>
                                    <Button variant="outline" className="cursor-pointer">
                                        <Layout size={18} />
                                        <span className='hidden md:inline'>Admin portal</span>
                                    </Button>
                                </Link>)}
                        </SignedIn>)}
                    <SignedOut>
                        <SignInButton forceRedirectUrl='/'>
                            <Button variant='outline' className="cursor-pointer">Login</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn >
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: 'w-18 h-18',
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </nav>
        </header>
    )
};

export default Header;