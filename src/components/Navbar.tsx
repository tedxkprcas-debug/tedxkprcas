import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  // { label: "Gallery", href: "#gallery" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle hash link clicks – if not on home page, navigate to "/" first then scroll
  useEffect(() => {
    const onScroll = () => {
      if (open) setOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Handle hash link clicks – if not on home page, navigate to "/" first then scroll
  const handleHashClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      setOpen(false);
      const sectionId = href.replace("#", "");

      if (location.pathname !== "/") {
        // Navigate to home, then scroll after render
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [location.pathname, navigate]
  );

  const renderNavLink = (item: { label: string; href: string }, mobile = false) => {
    const className = mobile
      ? "block text-sm sm:text-base text-foreground hover:text-white transition-colors"
      : "text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors lg:text-base";

    if (item.href.startsWith("/")) {
      return (
        <Link
          key={item.label}
          to={item.href}
          onClick={() => setOpen(false)}
          className={className}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <a
        key={item.label}
        href={item.href}
        onClick={(e) => handleHashClick(e, item.href)}
        className={className}
      >
        {item.label}
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full flex items-center justify-between h-12 sm:h-14 md:h-16 px-2 sm:px-3 md:px-4 max-w-full">
        <Link to="/" className="flex items-center flex-shrink-0 gap-1">
          <img src="/logo.png" alt="TEDx" className="h-5 sm:h-6 md:h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-6">
          {navItems.map((item) => renderNavLink(item))}
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <Link
            to="/register"
            className="bg-tedx-red text-white font-heading text-xs px-3 md:px-4 py-1.5 md:py-2 rounded hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            REGISTER
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground p-1 flex-shrink-0" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-background border-b border-border"
            onClick={() => setOpen(false)}
          >
            <div
              className="px-2 sm:px-3 py-2 flex flex-col gap-0.5 divide-y divide-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item) => (
                <div key={item.label} className="py-2">
                  {renderNavLink(item, true)}
                </div>
              ))}
              <div className="pt-2">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block w-full bg-tedx-red text-white text-center font-heading text-xs px-3 py-2 rounded hover:bg-red-700"
                >
                  REGISTER
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
