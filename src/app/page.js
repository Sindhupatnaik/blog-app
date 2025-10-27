import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <header>
        <nav>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Login</Link>
          </div>
        </nav>
      </header>
      <main>
        <h1>Welcome to the Blog App</h1>
        <p>Please sign up or login to continue.</p>
      </main>
    </div>
  );
}