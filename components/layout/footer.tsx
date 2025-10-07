import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              Gamerithm
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Algorithm-powered game recommendation platform to help you
              discover your next favorite game.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/recommendations"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Recommendations
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Legal & Social
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.gg/gamerithm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline inline-flex items-center gap-1"
                >
                  Discord
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/gamerithm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline inline-flex items-center gap-1"
                >
                  Twitter
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© 2025 Gamerithm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
