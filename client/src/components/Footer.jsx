import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t-2 border-cyan-500 text-gray-400 py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        <span className="text-sm">© 2025 <Link to="/" className="hover:text-cyan-400 transition">Beeps SteamHelper</Link>. Всі права захищені.</span>

        <ul className="flex flex-wrap mt-3 md:mt-0 space-x-4">
          <li><Link to="/" className="hover:text-cyan-400 transition">Про застосунок</Link></li>
          <li><a href="https://discord.gg/JPtD6eDN" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Discord</a></li>
          <li><a href="https://t.me/adoremyvibe" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Telegram</a></li>
          <li><a href="https://github.com/beepstephan" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Github</a></li>
        </ul>

      </div>
    </footer>
  ) 
}
