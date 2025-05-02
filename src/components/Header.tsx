import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import {useAuth} from "@clerk/clerk-react";
const Header = () => {
    const{userId}= useAuth();
    console.log("Found",userId);
    return (
        
                <div className="flex gap-3">
                 
                    <SignedOut>
                        <SignInButton mode="modal" afterSignInUrl="/dashboard">
                            <a href="/signin">
                                <button className="px-4 py-1.5 border-[1.5px] border-black/50 text-black/70 rounded-full hover:bg-white/10 transition">
                                    Login
                                </button>
                            </a>
                        </SignInButton>
                        <a href="/signup">
                            <button className="px-4 py-1.5 border-[1.5px] border-black/20 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition">
                                Sign Up
                            </button>
                        </a>
                    </SignedOut>
                    <SignedIn>
                        
                        <UserButton afterSignOutUrl="/" />
                        
                    </SignedIn>

                </div>
    );
};

export default Header;
