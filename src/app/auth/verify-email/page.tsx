"use client"

import { Button } from "@/components/ui/button"
import { trpcAPI } from "@/utils/api"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function VerifyEmail(){
    const searchParams = useSearchParams()
    const validationQuery = trpcAPI.auth.verify_email.useMutation()

    useEffect(() => {
        console.log("Sending mutation")
        const token = searchParams.get("token")
        if (token) {
            validationQuery.mutate({token: token})
        }
    }, [])

    useEffect(() => {
        console.log(validationQuery)
    }, [validationQuery])

    return(
        <>
            <div>
                <h1>Validating your Email</h1>

                {validationQuery.data?.success &&
                    (
                        <span>Registration successfull. Click here to <Button onClick={() => signIn()}>log in</Button></span>
                    )
                }
            </div>
        </>
    )
}