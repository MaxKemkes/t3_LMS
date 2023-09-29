"use client"
import TodoList from "@/components/TodoList";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";

export default function page(){
    const session = useSession()
    return (
      <>
        {/* <div>Hello</div> */}
        <p>{JSON.stringify(session.data)}</p>
        <TodoList></TodoList>
      </>
    );
}