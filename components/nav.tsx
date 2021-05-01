import Link from 'next/link'
import {useUser} from '@auth0/nextjs-auth0'

export const Nav = () => {
    const { user, error, isLoading } = useUser();

    return(
        <ul className="flex grid grid-cols-4">
            <div className="col-span-1 flex justify-start">
                <li className="mr-6">
                    <Link href="/">
                    <div className="inline-flex cursor-pointer">
                        <img className="sm:h-10 h-8 pr-1" src="/logo.png" alt="logo"/>
                        <a className="p-2 texte-center block hover:blue-700 sm:visible invisible" href="">NewsPrism</a>
                    </div>
                    </Link>
                </li>
            </div>
            <div className="col-span-3 flex justify-end">
                {user ? (
                <li className="sm:mr-6">
                    <Link href="/saved-articles">
                    <a className="p-2 text-center block hover:blue-700 text-blue-500" href="">Saved articles </a>
                    </Link>
                </li>
                ) : null}
                <li className="sm:mr-6">
                    <Link href="/bundles">
                    <a className="p-2 text-center block hover:blue-700 text-blue-500" href="">Bundles </a>
                    </Link>
                </li>
                <li className="sm:mr-6">
                    <Link href="/feeds">
                    <a className="p-2 text-center block hover:blue-700 text-blue-500" href="">Feeds </a>
                    </Link>
                </li>
                {user && !isLoading ? (
                    <li className="sm:mr-6">
                    <Link href="/api/logout">
                    <a className="p-2 text-center block hover:blue-700 text-blue-500" href="">Logout </a>
                    </Link>
                    </li>
                ) : (
                    <li className="sm:mr-6">
                    <Link href="/api/login">
                    <a className="p-2 text-center block hover:blue-700 text-blue-500" href="">Login </a>
                    </Link>
                    </li>
                )}
            </div>
        </ul>
    )
}