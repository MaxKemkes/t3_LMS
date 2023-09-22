"use client"
import TodoList from "@/components/TodoList";
import { getServerSession } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";

export default function page(){
    const session = useSession()
    return (
      <>
        <div>Hello</div>
        <p>{JSON.stringify(session.data)}</p>
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={session.data ? () => void signOut() : () => void signIn()}
        >
          {session.data ? "Sign out" : "Sign in"}
        </button>
        <TodoList></TodoList>
      </>
    );
}