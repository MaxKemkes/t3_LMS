import Image from "next/image";

import logo from "public/logos/logo-light.png"

export default function Page(){
    return(
        <Image src={logo.src} alt="Logo" fill className="hidden" />
    )
}