"use client"

import { BuiltInProviderType } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react/types";
import  Image  from "next/image"
import logoGoogle from "public/logos/google.svg"
import logoMicrosoft from "public/logos/microsoft.svg"
import { zodResolver } from "@hookform/resolvers/zod";


export default function Login() {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<Exclude<BuiltInProviderType, "credentials">, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const providers = await getProviders()
      if (providers) {
        const {credentials, ...displayProviders} = providers
        setProviders(displayProviders)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div className="relative flex w-full max-w-sm flex-col self-center rounded-xl border bg-white px-4 py-8">
        <h1 className="border-b pb-2 text-center font-display text-3xl font-semibold">
          Login
        </h1>
        <CredentialsLogin/>
          {providers &&
        <>
          <hr className='relative top-0 my-2 bg-inherit after:absolute after:left-[50%] after:-translate-x-1/2 after:-translate-y-1/2 after:bg-inherit after:px-2 after:content-["or"]' />
          <div className="mt-3 flex max-w-sm flex-col justify-center gap-y-4 justify-self-center font-display">
            {Object.values(providers).map((provider, idx) =>
              ProviderButton(provider, idx),
            )}
          
        </div>
          </>
          }

      </div>
    </>
  );
}

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import Link from "next/link";
import { useEffect, useState } from "react";

const Z_EmailLogin = z.object({
  email: z.string().email(),
  password: z.string()
})

type T_EmailLogin = z.infer<typeof Z_EmailLogin>

function CredentialsLogin(){
  const { control, register, setValue, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<T_EmailLogin>({resolver: zodResolver(Z_EmailLogin)});
  const onSubmit: SubmitHandler<T_EmailLogin> = async (data:T_EmailLogin) => {
    signIn("credentials", {callbackUrl:"/", redirect: true, username: data.email, password: data.password})
  } 
  return (
    <>
      <form
        // method="post"
        // action="/api/auth/callback/credentials"
        className="mt-6 flex max-w-sm flex-col justify-center rounded-lg py-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* register your input into the hook by invoking the "register" function */}
        <div className="flex flex-col text-lg">
          <Label htmlFor="email" className="text-lg">
            Email
          </Label>
          <Input
            // defaultValue="test"
            {...register("email", { required: true })}
            name="email"
            id="email"
            type="ema"
            placeholder="john@smith.com"
            className="mb-1 rounded-md border font-body text-lg outline-1"
          />
          {errors.email && (
            <Alert variant={"destructive"} className="bg-red-200 py-1">
              <AlertDescription>{errors.email.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* include validation with required or other standard HTML validation rules */}
        <div className="mt-2 flex flex-col text-lg">
          <Label htmlFor="email" className="text-lg">
            Password
          </Label>
          <Input
            // defaultValue="test"
            {...register("password", { required: true })}
            name="password"
            id="password"
            placeholder="***"
            type="password"
            className="mb-1 rounded-md border font-body text-lg"
          />
          {errors.password && (
            <Alert variant={"destructive"} className="bg-red-200 py-1">
              {Array.isArray(errors.password.message)
                ? errors.password.message.map((item, idx) => (
                  <AlertDescription key={idx}>{item as string}</AlertDescription>
                  ))
                :  <div>
                    <AlertDescription>{errors.password.message}</AlertDescription>
                </div>
              }
              
            </Alert>
          )}
        </div>
        {/* errors will return when field validation fails  */}
        <p className="text-sm mt-1">No Account yet? <Link href="/auth/register" className="text-amber-500 font-semibold hover:underline">Register here</Link></p>
        <Button
          type="submit"
          className="mx-auto mt-4 w-full justify-self-center text-lg"
          disabled={isSubmitting}
        >
          Sign in
        </Button>
      </form>
    </>
  );
}

function ProviderButton(provider: ClientSafeProvider, idx: number){
  const name = provider.name.match(/Azure/g) ? "Microsoft" : provider.name;
  return (
      <button
        onClick={() => signIn(provider.id)}
        key={idx}
        className="duration inline-flex max-h-8 flex-1 border items-center justify-left gap-6 overflow-hidden rounded-2xl px-6 py-8 text-lg font-semibold shadow-md transition-transform active:scale-95"
      >
        <div className="relative my-1 aspect-square h-6">
          <Image
            src={returnPicture(provider.name)}
            alt={
              "Login with " +
              (provider.name === "Azure Active Directory B2C"
                ? "Microsoft"
                : provider.name)
            }
            objectFit="contain"
            objectPosition="left"
            fill
            className="block"
          />
        </div>
        <span className="block text-center w-full break-inside-auto">
          Sign in with{" "}
          {provider.name === "Azure Active Directory B2C"
            ? "Microsoft"
            : provider.name}
        </span>
      </button>
  );
};

function returnPicture(provider: ClientSafeProvider["name"]){
    if (provider === "Google") return logoGoogle
    if (provider = "Azure Active Directory B2C") return logoMicrosoft
    
    return "";
}