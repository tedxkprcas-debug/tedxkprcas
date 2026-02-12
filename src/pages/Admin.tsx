import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, User, Mail, Link, Shield, Trash2 } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const inputVariants = {
  rest: { scale: 1, borderColor: "hsl(0 0% 15%)" },
  focus: { scale: 1.01, borderColor: "hsl(0 84% 50%)", transition: { duration: 0.2 } },
};

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [certLink, setCertLink] = useState("");
  const [sent, setSent] = useState<{ name: string; email: string; time: string }[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!email || !name) return;
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1200));
    setSent((prev) => [
      { name, email, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
    setSending(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
    setEmail("");
    setName("");
    setCertLink("");
  };

  const handleDelete = (index: number) => {
    setSent((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-tedx-red/5"
            style={{
              width: 200 + i * 80,
              height: 200 + i * 80,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 12}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -25, 15, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <motion.div
            className="flex items-center gap-3 mb-3"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-tedx-red" />
            </motion.div>
            <h1 className="font-heading text-4xl md:text-5xl font-black">
              <span className="text-tedx-red">TED</span>
              <sup className="text-tedx-red text-2xl">x</sup>{" "}
              <span className="text-foreground">Admin</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Certificate Management Panel
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-[2px] w-32 bg-tedx-red origin-left mt-3"
          />
        </motion.div>

        {/* Send Certificate Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="border border-border rounded-2xl p-8 mb-8 bg-card/60 backdrop-blur-sm relative overflow-hidden group"
        >
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 bg-tedx-red/0 group-hover:bg-tedx-red/[0.02] transition-colors duration-500 rounded-2xl"
          />
          
          <div className="relative z-10">
            <motion.h2
              className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
              whileHover={{ color: "hsl(0 84% 50%)" }}
              transition={{ duration: 0.3 }}
            >
              <Send className="w-5 h-5 text-tedx-red" />
              Send Certificate
            </motion.h2>

            <div className="space-y-5">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Participant Name
                </label>
                <motion.input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variants={inputVariants}
                  initial="rest"
                  whileFocus="focus"
                  className="w-full bg-secondary border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none transition-shadow focus:shadow-[0_0_20px_hsl(0_84%_50%/0.15)]"
                  placeholder="Enter participant name"
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <motion.input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variants={inputVariants}
                  initial="rest"
                  whileFocus="focus"
                  className="w-full bg-secondary border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none transition-shadow focus:shadow-[0_0_20px_hsl(0_84%_50%/0.15)]"
                  placeholder="Enter email address"
                />
              </motion.div>

              {/* Certificate Link Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
                  <Link className="w-3.5 h-3.5" /> Certificate Link (optional)
                </label>
                <motion.input
                  value={certLink}
                  onChange={(e) => setCertLink(e.target.value)}
                  variants={inputVariants}
                  initial="rest"
                  whileFocus="focus"
                  className="w-full bg-secondary border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none transition-shadow focus:shadow-[0_0_20px_hsl(0_84%_50%/0.15)]"
                  placeholder="https://..."
                />
              </motion.div>

              {/* Send Button */}
              <motion.button
                onClick={handleSend}
                disabled={sending || !name || !email}
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(0 84% 50% / 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-tedx-red hover:bg-tedx-dark-red text-foreground font-heading font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {sending ? (
                    <motion.div
                      key="sending"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                      transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                      className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full"
                    />
                  ) : success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {sending ? "Sending..." : success ? "Sent!" : "Send Certificate"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              className="fixed bottom-8 right-8 bg-card border border-tedx-red/30 rounded-xl px-6 py-4 flex items-center gap-3 shadow-[0_0_30px_hsl(0_84%_50%/0.2)] z-50"
            >
              <CheckCircle className="w-5 h-5 text-tedx-red" />
              <span className="text-foreground font-medium">Certificate sent successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sent History */}
        <AnimatePresence>
          {sent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border border-border rounded-2xl p-8 bg-card/60 backdrop-blur-sm"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block w-2 h-2 rounded-full bg-tedx-red"
                />
                Sent History ({sent.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {sent.map((s, i) => (
                    <motion.div
                      key={`${s.email}-${s.time}`}
                      initial={{ opacity: 0, x: -30, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-center justify-between border border-border rounded-lg px-4 py-3 group/item hover:border-tedx-red/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-tedx-red/10 flex items-center justify-center text-tedx-red font-heading font-bold text-sm">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">{s.name}</p>
                          <p className="text-muted-foreground text-xs">{s.email} · {s.time}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(i)}
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-tedx-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPage;
