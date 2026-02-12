import { useState } from "react";

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [certLink, setCertLink] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  const handleSend = () => {
    if (email && name) {
      setSent((prev) => [...prev, `${name} (${email})`]);
      setEmail("");
      setName("");
      alert(`Certificate link would be sent to ${email}. Connect backend to enable this feature.`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading text-4xl font-black mb-2">
          <span className="text-tedx-red">TED</span><sup className="text-tedx-red">x</sup> KPRCAS Admin
        </h1>
        <p className="text-muted-foreground mb-8">Certificate Management Panel</p>

        <div className="border border-border rounded-xl p-6 space-y-4 mb-8">
          <h2 className="font-heading text-xl font-bold text-foreground">Send Certificate</h2>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Participant Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-tedx-red"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-tedx-red"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Certificate Link (optional)</label>
            <input
              value={certLink}
              onChange={(e) => setCertLink(e.target.value)}
              className="w-full bg-secondary border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-tedx-red"
              placeholder="https://..."
            />
          </div>

          <button
            onClick={handleSend}
            className="bg-tedx-red hover:bg-tedx-dark-red text-foreground font-heading font-bold px-6 py-2 rounded transition-colors"
          >
            Send Certificate
          </button>
        </div>

        {sent.length > 0 && (
          <div className="border border-border rounded-xl p-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Sent History</h3>
            <ul className="space-y-2">
              {sent.map((s, i) => (
                <li key={i} className="text-muted-foreground text-sm border-b border-border pb-2">{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
