import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const NotFound = (): JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(async () => {
      await router.push('/')
    }, 4500)
  })

  return (
    <div>
      <h1>404</h1>
      <h2>Ooops! That page can not be found :(</h2>
      <p>
        Redirecting to <Link href="/">home</Link>...
      </p>
    </div>
  )
}

export default NotFound
