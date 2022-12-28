import { signIn, useSession } from 'next-auth/react'

const AccessDenied = () => {
  const { status } = useSession()
  return (
    <>
      <h1>Access Denied</h1>
      {status === 'authenticated' && <p>You do not have permission to view this page.</p>}
      {status === 'unauthenticated' && (
        <div>
          <p>You must be signed in to view this page.</p>
          <a
            className="btn-primary btn-block btn text-blue-500"
            href="/api/auth/signin"
            onClick={(e) => {
              e.preventDefault()
              signIn()
            }}
          >
            Sign in
          </a>
        </div>
      )}
    </>
  )
}

export default AccessDenied
