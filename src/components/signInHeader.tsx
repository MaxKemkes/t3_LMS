import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function SignInHeader() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div className="">
      <div className="">
        <p
          className={`nojs-show ${
            !session && loading ? "" : ""
          }`}
        >
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={""}
                />
              )}
              <span className={""}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <Link
                href={`/api/auth/signout`}
                className={""}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
