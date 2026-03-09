import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface SpeakerFormProps {
  initialData?: {
    name: string;
    role: string;
    image: string;
    bio?: string;
  };
  onSave: (data: { name: string; role: string; image: string; bio: string }) => void;
  onCancel: () => void;
}

const SpeakerFormWithImage = ({ initialData, onSave, onCancel }: SpeakerFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    image: initialData?.image || "",
    bio: initialData?.bio || "",
  });
  const [preview, setPreview] = useState<string>(initialData?.image || "");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.role) {
      alert("Please fill in name and role");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-2">Speaker Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5"
          placeholder="Enter speaker name"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Role/Title</label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5"
          placeholder="Enter role (e.g., Industry Expert)"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Description/Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 resize-none"
          placeholder="Enter speaker description or bio (e.g., achievements, expertise, etc.)"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm mb-3">Speaker Image</label>

        {preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <img
              src={preview}
              alt="Speaker preview"
              className="w-full h-48 object-cover rounded-lg border border-border"
            />
            <button
              onClick={() => {
                setPreview("");
                setFormData({ ...formData, image: "" });
              }}
              className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <label className="flex items-center justify-center w-full h-48 px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors group">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm text-muted-foreground">
                Click to upload image or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WebP (Max 2MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg transition-colors"
        >
          Save Speaker
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SpeakerFormWithImage;

