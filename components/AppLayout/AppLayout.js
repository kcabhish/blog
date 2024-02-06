import { useUser } from "@auth0/nextjs-auth0/client";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image"
import Link from "next/link"
import { Logo } from "../Logo";

export const AppLayout = ({children, availableTokens, posts, postId}) => {
    const { user } = useUser();
    return (
        <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
            <div className="flex flex-col text-white overflow-hidden">
                <div className="bg-slate-800 px-2">
                    <Logo />
                    <Link href="/post/new" className="btn">New Post</Link>
                    <Link href="/token-topup" className="block mt-2 text-center">
                        <FontAwesomeIcon icon={faCoins} className="text-yellow-500"/>
                        <span className="pl-1">{availableTokens} Tokens Available</span>
                    </Link>
                </div>    
                <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
                    {
                        posts.map(post => {
                            return <Link className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${postId === post._id ? 'bg-white/20 border-white' :''}`}
                                key={post._id}
                                href={`/post/${post._id}`}>{post.topic}</Link>
                        })
                    }
                </div>
                <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
                {
                    !!user ? (
                        <>
                        <div className="min-w-[50px]">
                            <Image className="rounded-full" src={user.picture} alt={user.name} height={50} width={50}/>
                        </div>
                        <div>
                            <div className="font-bold">
                                {user.email}
                            </div>
                            <Link className='text-sm' href="/api/auth/logout">Logout</Link>
                        </div>
                        </>
                    ) : <Link href='/api/auth/login'>Login</Link>
                }
                </div>
            </div>
            {children}
        </div>
    )
}