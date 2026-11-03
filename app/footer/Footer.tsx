export default function Footer() {
  return (
    <footer className="shell footer">
      <p>© {new Date().getFullYear()} Muhammad Khizr</p>
      <div>
        <a
          href="https://github.com/yamas-developers"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
        <a
          href="https://www.linkedin.com/in/muhamad-khizr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn ↗
        </a>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
