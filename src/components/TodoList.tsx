"use client"

import { api } from "@/utils/api"

export default function TodoList(){
    const getTodos = api.example.hello.useQuery({text: "asdasd"})

    return (
        <>
        {getTodos.isFetched && <div>{getTodos.data?.greeting}</div>}
        {getTodos.isFetching && <div>Loading ...</div>}
        </>
    )
}