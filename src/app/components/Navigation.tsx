import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'motion/react';
import { Compass, MessageCircle, User, Sparkles } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/discover', label: 'discover', icon: Compass },
    { path: '/matches', label: 'matches', icon: MessageCircle },
    { path: '/profile', label: 'profile', icon: User },
  ];

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-black/80 backdrop-blur relative z-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md text-inherit no-underline outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Home"
        >
          <Sparkles className="w-5 h-5 text-zinc-400" />
          <h1 className="font-['Playfair_Display'] text-2xl text-white">
            foundr
          </h1>
        </Link>
      </motion.div>
      <div className="flex items-center gap-8 text-sm">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`transition-colors font-['Inter'] flex items-center gap-2 relative ${
                active ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {active && (
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white/40"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </header>
  );
}