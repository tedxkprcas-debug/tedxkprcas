import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Lock } from "lucide-react";

const GOOGLE_FORM_LINK = "#"; // Replace with actual Google Form link

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/admin"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Link>
          <a
            href={GOOGLE_FORM_LINK}
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
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="block py-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Link>
          <a
            href={GOOGLE_FORM_LINK}
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
