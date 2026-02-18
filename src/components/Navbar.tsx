import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Lock } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("https://forms.gle/example");
  const location = useLocation();
  const navigate = useNavigate();

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
      ? "block py-2 text-muted-foreground hover:text-foreground transition-colors"
      : "text-sm text-muted-foreground hover:text-foreground transition-colors font-medium";

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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-baseline gap-0.5">
          <span className="font-heading text-xl font-black text-tedx-red">TED</span>
          <sup className="font-heading text-sm font-black text-tedx-red">x</sup>
          <span className="font-heading text-xl font-bold text-foreground ml-1">KPRCAS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => renderNavLink(item))}
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-tedx-red text-foreground font-heading font-bold text-sm px-5 py-2 rounded hover:bg-tedx-dark-red transition-colors"
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-b border-border px-4 pb-4"
        >
          {navItems.map((item) => renderNavLink(item, true))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="block py-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Link>
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 bg-tedx-red text-foreground font-heading font-bold text-sm px-5 py-2 rounded text-center"
          >
            Register
          </a>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
