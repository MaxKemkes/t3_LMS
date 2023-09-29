"use client"

import { signIn } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import  Image  from "next/image"
import logoGoogle from "public/logos/google.svg"
import logoMicrosoft from "public/logos/microsoft.svg"
import { zodResolver } from "@hookform/resolvers/zod";


export default function Register({}) {
  return (
    <>
    <div className="relative self-center border max-w-sm flex w-fit flex-col rounded-xl px-4 py-8 bg-white">
      <h1 className="text-center font-display text-3xl font-semibold border-b pb-2">Create your account</h1>
      <RegisterSecetion  />
    </div>
    </>
  );
}

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import Link from "next/link";
import { Z_EmailRegister } from "@/server/api/routers/authRouter/zod";
import { trpcAPI } from "@/utils/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";



type T_EmailRegister = z.infer<typeof Z_EmailRegister>

function RegisterSecetion({}){
  const { control, register, setValue, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm<T_EmailRegister>({resolver: zodResolver(Z_EmailRegister)});
  const addUser = trpcAPI.auth.register.useMutation();
  const [ openErrorDialog, setOpenErrorDialog ] = useState(false)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const onSubmit: SubmitHandler<T_EmailRegister> = async (data:T_EmailRegister) => {
    try{
      const res = await addUser.mutateAsync(data)
      setOpenSuccessDialog(true)
      console.log(res)
    } catch (err){
      setOpenErrorDialog(true);
      console.error(err)
    }
  }

  useEffect(() => {
    if (addUser.error){
      
      if (addUser.error.data?.code === "BAD_REQUEST"){
        setError("email", {
          type: "server",
          message: "User with this mail already exists"
      })
      }
    }
  }, [addUser])

  return (
    <>
      <RenderDialog
        open={openErrorDialog}
        setOpen={setOpenErrorDialog}
        message={addUser.error?.message}
        variant={"destructive"}
      />
      <RenderDialog
        open={openSuccessDialog}
        setOpen={setOpenSuccessDialog}
        message={
          "Congratulations. Your registration was successfull. We send you an email to verify your account. Please verify your account to start using our service."
        }
      />
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
          <RenderErrorAlert error={errors.email} key="error-email" />
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
          <RenderErrorAlert error={errors.password} key="error-password" />
        </div>
        <div className="mt-2 flex flex-col text-lg">
          <Label htmlFor="email" className="text-lg">
            Confirm Password
          </Label>
          <Input
            // defaultValue="test"
            {...register("confirmPassword", { required: true })}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="***"
            type="password"
            className="mb-1 rounded-md border font-body text-lg"
          />
          <RenderErrorAlert error={errors.confirmPassword} key="error-confirmPassword" />
        </div>
        {/* errors will return when field validation fails  */}
        <p className="mt-1 text-sm">
          I have read the{" "}
          <Link
            href="/register"
            className="font-semibold text-amber-500 hover:underline"
          >
            terms and conditions
          </Link>
        </p>
        <Button
          type="submit"
          className="mx-auto mt-4 w-full justify-self-center text-lg"
          disabled={isSubmitting}
        >
          Register
        </Button>
      </form>
    </>
  );
}

const dialogVariants = cva("", {
  variants: {
    variant: {
      default: "",
      destructive: "bg-red-300 text-red-950",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});


function RenderErrorAlert({error}:{error: FieldError | undefined}) {
  return (
    error && (
    <Alert variant={"destructive"} className="rounded-sm bg-red-200 py-1">
      {Array.isArray(error.message) ? (
        error.message.map((item, idx) => (
          <AlertDescription key={idx}>{item as string}</AlertDescription>
        ))
      ) : (
        <div>
          <AlertDescription>{error.message}</AlertDescription>
        </div>
      )}
    </Alert>
    )
  )
}

function RenderDialog({ open, setOpen, message, variant }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; message?: string; variant?: VariantProps<typeof dialogVariants>["variant"] }){
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "text-neutral-950 sm:max-w-[425px]",
          dialogVariants({ variant }),
        )}
      >
        <DialogHeader className={cn("pb-2 border-b",  variant === "destructive" ? "border-b-red-950" : "")}>
          <DialogTitle className="w-full text-xl font-semibold text-neutral-950 ">
            {variant === "destructive" ? "Error" : "Success"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-base text-neutral-950">
          {message}
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            className={cn("text-white active:scale-95", variant === "destructive" ? "bg-white hover:bg-white/80 text-black" :"")}
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
