import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Lock } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("https://forms.gle/example");
  const location = useLocation();
  const navigate = useNavigate();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const savedContact = localStorage.getItem("tedx_contact");
    if (savedContact) {
      try {
        const contactData = JSON.parse(savedContact);
        setRegistrationLink(contactData.registrationLink || "https://forms.gle/example");
      } catch (e) {
        console.error("Error parsing contact data:", e);
      }
    }
  }, []);

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
      ? "block py-3.5 text-lg text-muted-foreground hover:text-foreground transition-colors active:text-foreground"
      : "text-sm text-muted-foreground hover:text-foreground transition-colors lg:text-base";

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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
      <div className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="TEDx KPRCAS" className="h-8 sm:h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => renderNavLink(item))}
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-tedx-red text-foreground font-heading text-sm px-4 lg:px-5 py-2 rounded hover:bg-tedx-dark-red transition-colors whitespace-nowrap"
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground p-2 -mr-1 active:opacity-70" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-4 py-2 pb-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto safe-area-bottom"
        >
          {navItems.map((item) => renderNavLink(item, true))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 py-3 text-muted-foreground hover:text-primary transition-colors active:text-primary"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Link>
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 bg-tedx-red text-foreground font-heading text-base px-5 py-3.5 rounded text-center active:bg-tedx-dark-red"
          >
            Register
          </a>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
