
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react";

interface ImportedParticipant {
  id: number;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  date: string;
  status: string;
  certSent: boolean;
}

interface ImportDataProps {
  onImport: (participants: ImportedParticipant[]) => void;
  onClose: () => void;
}

const GoogleFormDataImport = ({ onImport, onClose }: ImportDataProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportedParticipant[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const downloadTemplate = () => {
    const csvContent = `Name,Email,Phone,College,Date,Status
John Doe,john@example.com,+91-9876543210,KPR College,2026-02-01,registered
Jane Smith,jane@example.com,+91-9876543211,Anna University,2026-02-01,registered
Ahmed Hassan,ahmed@example.com,+91-9876543212,KPR College,2026-02-03,registered`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "google_form_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): ImportedParticipant[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const participants: ImportedParticipant[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const obj: Record<string, string> = {};

      headers.forEach((header, index) => {
        obj[header] = values[index] || "";
      });

      if (obj.name && obj.email) {
        participants.push({
          id: i,
          name: obj.name,
          email: obj.email,
          phone: obj.phone || "",
          college: obj.college || "",
          date: obj.date || new Date().toISOString().split("T")[0],
          status: obj.status || "registered",
          certSent: false,
        });
      }
    }

    return participants;
  };

  const parseExcel = async (file: File) => {
    try {
      // For CSV files
      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        return parseCSV(text);
      }

      // For Excel files, we'll convert to CSV first
      // In a real app, you'd use a library like xlsx
      alert("For Excel files, please export as CSV first or use the CSV template provided.");
      return [];
    } catch (err) {
      setError("Error parsing file: " + (err instanceof Error ? err.message : "Unknown error"));
      return [];
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setFile(selectedFile);

    const participants = await parseExcel(selectedFile);
    if (participants.length > 0) {
      setPreview(participants);
    } else {
      setError("No valid participants found in file. Check the format.");
    }
  };

  const handleImport = () => {
    if (preview.length === 0) {
      setError("No data to import");
      return;
    }

    setImporting(true);
    setTimeout(() => {
      onImport(preview);
      setSuccess(true);
      setImporting(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Instructions */}
      <motion.div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900/80">
            <p className="mb-2">How to import participant data:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Export your Google Form responses as CSV</li>
              <li>Download our template to check the format</li>
              <li>Upload the CSV file below</li>
              <li>Review the preview</li>
              <li>Click Import to add all participants</li>
            </ol>
          </div>
        </div>
      </motion.div>

      {/* Download Template Button */}
      <button
        onClick={downloadTemplate}
        className="w-full bg-secondary hover:bg-secondary/80 text-foreground px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download CSV Template
      </button>

      {/* File Upload */}
      <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors group">
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
          <p className="text-sm text-muted-foreground">
            Click to upload CSV file or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            CSV files from Google Forms
          </p>
        </div>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Participants imported successfully!
        </motion.div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="mb-3">Preview ({preview.length} participants)</h3>
          <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">College</th>
                  <th className="px-3 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preview.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.email}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.phone}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.college}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleImport}
          disabled={preview.length === 0 || importing}
          className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-2.5 rounded-lg transition-colors"
        >
          {importing ? "Importing..." : `Import (${preview.length})`}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default GoogleFormDataImport;
export type { ImportedParticipant };

