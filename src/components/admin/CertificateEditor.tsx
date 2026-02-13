import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Type, Image, Eye, X, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const BORDER_STYLES = [
  { id: "classic", label: "Classic", border: "border-4 border-double border-primary" },
  { id: "modern", label: "Modern", border: "border-2 border-primary/60" },
  { id: "elegant", label: "Elegant", border: "border border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.15)]" },
  { id: "bold", label: "Bold", border: "border-4 border-primary" },
];

const ACCENT_COLORS = [
  { id: "red", label: "TEDx Red", color: "hsl(var(--primary))" },
  { id: "gold", label: "Gold", color: "#D4A853" },
  { id: "silver", label: "Silver", color: "#A8A8A8" },
  { id: "blue", label: "Royal Blue", color: "#2563EB" },
];

export interface CertificateConfig {
  title: string;
  subtitle: string;
  bodyText: string;
  signerName: string;
  signerTitle: string;
  borderStyle: string;
  accentColor: string;
}

const DEFAULT_CONFIG: CertificateConfig = {
  title: "Certificate of Participation",
  subtitle: "TEDxYouth@Example 2026",
  bodyText: "This is to certify that {name} has successfully participated in TEDxYouth@Example 2026, held on February 15, 2026.",
  signerName: "Dr. Ahmed Hassan",
  signerTitle: "Event Organizer",
  borderStyle: "classic",
  accentColor: "red",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (config: CertificateConfig) => void;
  config?: CertificateConfig;
}

const CertificateEditor = ({ open, onClose, onSave, config: initialConfig }: Props) => {
  const [config, setConfig] = useState<CertificateConfig>(initialConfig || DEFAULT_CONFIG);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof CertificateConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activeBorder = BORDER_STYLES.find((b) => b.id === config.borderStyle) || BORDER_STYLES[0];
  const activeColor = ACCENT_COLORS.find((c) => c.id === config.accentColor) || ACCENT_COLORS[0];

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">Certificate Editor</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreview(!preview)}
                className="gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                {preview ? "Edit" : "Preview"}
              </Button>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {preview ? (
                /* Preview Mode */
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <div
                    className={cn(
                      "w-full max-w-2xl aspect-[1.414/1] bg-white rounded-lg p-8 md:p-12 flex flex-col items-center justify-between text-center",
                      activeBorder.border
                    )}
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">presents</p>
                    </div>
                    <div className="space-y-4 max-w-md">
                      <h3
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: activeColor.color }}
                      >
                        {config.title}
                      </h3>
                      <p className="text-sm text-gray-500">{config.subtitle}</p>
                      <div className="py-2">
                        <p className="text-lg md:text-xl font-semibold text-gray-800">John Doe</p>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                        {config.bodyText.replace("{name}", "John Doe")}
                      </p>
                    </div>
                    <div className="space-y-1 pt-4 border-t border-gray-200 w-40">
                      <p className="text-sm font-semibold text-gray-700">{config.signerName}</p>
                      <p className="text-xs text-gray-500">{config.signerTitle}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Edit Mode */
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" /> Content
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Title</label>
                        <Input
                          value={config.title}
                          onChange={(e) => update("title", e.target.value)}
                          className="bg-secondary"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Subtitle / Event Name</label>
                        <Input
                          value={config.subtitle}
                          onChange={(e) => update("subtitle", e.target.value)}
                          className="bg-secondary"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">
                        Body Text <span className="text-primary">{"{name}"}</span> = participant name
                      </label>
                      <Textarea
                        value={config.bodyText}
                        onChange={(e) => update("bodyText", e.target.value)}
                        rows={3}
                        className="bg-secondary"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Signer Name</label>
                        <Input
                          value={config.signerName}
                          onChange={(e) => update("signerName", e.target.value)}
                          className="bg-secondary"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Signer Title</label>
                        <Input
                          value={config.signerTitle}
                          onChange={(e) => update("signerTitle", e.target.value)}
                          className="bg-secondary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Design */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
                      <Image className="w-4 h-4 text-primary" /> Design
                    </h3>

                    {/* Border Style */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Border Style</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {BORDER_STYLES.map((style) => (
                          <motion.button
                            key={style.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => update("borderStyle", style.id)}
                            className={cn(
                              "h-20 rounded-lg bg-white flex items-center justify-center text-xs font-medium text-gray-600 transition-all",
                              style.border,
                              config.borderStyle === style.id
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                : "opacity-60 hover:opacity-100"
                            )}
                          >
                            {style.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Accent Color</label>
                      <div className="flex gap-3">
                        {ACCENT_COLORS.map((c) => (
                          <motion.button
                            key={c.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => update("accentColor", c.id)}
                            className={cn(
                              "w-10 h-10 rounded-full transition-all",
                              config.accentColor === c.id
                                ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110"
                                : "opacity-60 hover:opacity-100"
                            )}
                            style={{ backgroundColor: c.color }}
                            title={c.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border sticky bottom-0 bg-card rounded-b-2xl">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={handleSave} className="gap-2">
                {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved!" : "Save Template"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CertificateEditor;
