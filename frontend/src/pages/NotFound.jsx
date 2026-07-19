import { Link } from "react-router-dom";
import { FiCompass, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-stadium-surfaceAlt text-stadium-primary">
        <FiCompass size={28} />
      </div>
      <h1 className="text-3xl font-extrabold">404</h1>
      <p className="mt-2 text-slate-400">
        Looks like this page took a wrong turn. Let's get you back to the main concourse.
      </p>
      <Link
        to="/"
        className="mt-6 flex items-center gap-2 rounded-xl bg-stadium-primary px-5 py-2.5 text-sm font-semibold text-stadium-bg transition hover:bg-stadium-primaryDark"
      >
        <FiHome size={16} /> Back to Home
      </Link>
    </div>
  );
}
