import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell not-found-page">
      <p className="eyebrow">404 · Page not found</p>
      <h1>This page doesn’t exist.</h1>
      <p className="hero-description">
        The link you followed may have moved or been consolidated into the
        homepage.
      </p>
      <div className="hero-actions">
        <Link href="/" className="button primary">
          Back to homepage <span aria-hidden="true">↗</span>
        </Link>
        <Link href="/#work" className="button secondary">
          View selected work <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
