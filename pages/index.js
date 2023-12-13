import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <div>home</div>
      <div>
        <Link href='/api/auth/login'>Login</Link>
      </div>
    </div>
  )
}
