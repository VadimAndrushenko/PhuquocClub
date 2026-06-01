import Link from "next/link";
import Image from "next/image";

export default function Logo({smallLogo = false} : {smallLogo?: boolean}) {
    return (
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image unoptimized={process.env.NODE_ENV === 'development'} src="/logo-small.png" alt="Phuquoc.Club" width={40} height={40} />
            <span className={`${smallLogo ? "max-sm:hidden" : ""} sm:text-xl text-bold leading-[1.4]`}>Phuquoc.<span className="text-accent">Club</span></span>
        </Link>
    )
}