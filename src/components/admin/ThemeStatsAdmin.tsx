import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Check, Sparkles, Star, Flame, Zap,
  Lightbulb, Mic2, Users, HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  useThemeStats, 
  useCreateThemeStat, 
  useUpdateThemeStat, 
  useDeleteThemeStat 
} from "@/hooks/use-database";

const iconOptions = [
  { label: "Sparkles", value: "sparkles", icon: Sparkles },
  { label: "Star", value: "star", icon: Star },
  { label: "Flame", value: "flame", icon: Flame },
  { label: "Zap", value: "zap", icon: Zap },
  { label: "Lightbulb", value: "lightbulb", icon: Lightbulb },
  { label: "Mic2", value: "mic2", icon: Mic2 },
  { label: "Users", value: "users", icon: Users },
  { label: "HeartHandshake", value: "hearth", icon: HeartHandshake },
];

const iconMap: Record<string, any> = {
  sparkles: Sparkles,
  star: Star,
  flame: Flame,
  zap: Zap,
  lightbulb: Lightbulb,
  mic2: Mic2,
  users: Users,
  hearth: HeartHandshake,
};

interface ThemeStatForm {
  title: string;
  description: string;
  icon: string;
  order: number;
  is_active: boolean;
}

const ThemeStatsAdmin = () => {
  const { data: themeStats, isLoading } = useThemeStats();
  const createMutation = useCreateThemeStat();
  const updateMutation = useUpdateThemeStat();
  const deleteMutation = useDeleteThemeStat();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ThemeStatForm>({
    title: "",
    description: "",
    icon: "sparkles",
    order: 0,
    is_active: true,
  });

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        order: (themeStats?.length || 0) + 1,
      });

      setFormData({
        title: "",
        description: "",
        icon: "sparkles",
        order: 0,
        is_active: true,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating theme stat:", error);
      alert("Failed to create theme stat");
    }
  };

  const handleEdit = async () => {
    if (!editingId || !formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingId,
        data: formData,
      });

      setFormData({
        title: "",
        description: "",
        icon: "sparkles",
        order: 0,
        is_active: true,
      });
      setEditingId(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating theme stat:", error);
      alert("Failed to update theme stat");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this theme stat?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting theme stat:", error);
        alert("Failed to delete theme stat");
      }
    }
  };

  const openEditDialog = (stat: any) => {
    setFormData({
      title: stat.title,
      description: stat.description || "",
      icon: stat.icon || "sparkles",
      order: stat.order || 0,
      is_active: stat.is_active ?? true,
    });
    setEditingId(stat.id);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormData({
      title: "",
      description: "",
      icon: "sparkles",
      order: 0,
      is_active: true,
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      icon: "sparkles",
      order: 0,
      is_active: true,
    });
  };

  const IconComponent = iconMap[formData.icon] || Sparkles;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin">
          <Sparkles className="w-6 h-6 text-tedx-red" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-foreground">Theme Stats</h3>
        <Button
          onClick={openCreateDialog}
          className="gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Theme Stat
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {(!themeStats || themeStats.length === 0) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground"
            >
              No theme stats yet. Create one to get started!
            </motion.div>
          ) : (
            themeStats.map((stat: any) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start justify-between p-4 border border-white/10 rounded-lg hover:border-tedx-red/30 transition-colors group"
              >
                <div className="flex-1 flex items-start gap-4">
                  <div className="mt-1">
                    {(() => {
                      const Icon = iconMap[stat.icon] || Sparkles;
                      return <Icon className="w-5 h-5 text-tedx-red flex-shrink-0" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-foreground break-words">
                      {stat.title}
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      {stat.description}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">
                        Order: {stat.order}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${
                        stat.is_active
                          ? "bg-green-500/10 border-green-500/30 text-green-600"
                          : "bg-gray-500/10 border-gray-500/30 text-gray-600"
                      }`}>
                        {stat.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => openEditDialog(stat)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 className="w-4 h-4 text-tedx-red" />
                  </button>
                  <button
                    onClick={() => handleDelete(stat.id)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Theme Stat" : "Create Theme Stat"}
            </DialogTitle>
            <DialogDescription>
              {editingId 
                ? "Update the theme stat details below."
                : "Add a new theme stat to showcase your event theme."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-heading text-foreground block mb-2">
                Title *
              </label>
              <Input
                placeholder="e.g., Innovation & Creativity"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-heading text-foreground block mb-2">
                Description
              </label>
              <textarea
                placeholder="Brief description of this theme aspect"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black text-foreground text-sm focus:outline-none focus:border-tedx-red/50 resize-none"
                rows={3}
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="text-sm font-heading text-foreground block mb-2">
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, icon: option.value })}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                      formData.icon === option.value
                        ? "border-tedx-red bg-tedx-red/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <option.icon className="w-5 h-5 text-tedx-red" />
                  </button>
                ))}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`w-10 h-6 rounded-full transition-colors flex items-center justify-center ${
                  formData.is_active ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {formData.is_active ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <X className="w-4 h-4 text-white" />
                )}
              </button>
              <label className="text-sm text-foreground">
                {formData.is_active ? "Active" : "Inactive"}
              </label>
            </div>

            {/* Preview */}
            <div className="p-4 border border-white/10 rounded-lg bg-black/50">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-tedx-red/10 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-tedx-red" />
                </div>
                <div className="flex-1">
                  <p className="font-heading text-foreground text-sm">{formData.title || "Title"}</p>
                  <p className="text-xs text-muted-foreground">{formData.description || "Description"}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                onClick={editingId ? handleEdit : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? "Saving..." 
                  : editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThemeStatsAdmin;
