import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useAllRegistrationFormFields,
  useCreateRegistrationFormField,
  useUpdateRegistrationFormField,
  useDeleteRegistrationFormField,
} from "@/hooks/use-database";
import type { RegistrationFormField } from "@/lib/supabase";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "textarea", label: "Text Area" },
  { value: "checkbox", label: "Checkbox" },
];

const USER_CATEGORIES = [
  { value: "all", label: "All Users" },
  { value: "student", label: "Student" },
  { value: "company", label: "Company/Organization" },
  { value: "other", label: "Other" },
];

type FormFieldFormData = {
  field_name: string;
  field_label: string;
  field_type: RegistrationFormField["field_type"];
  placeholder: string;
  options: string;
  is_required: boolean;
  is_active: boolean;
  show_for_category: string[];
};

const initialFormData: FormFieldFormData = {
  field_name: "",
  field_label: "",
  field_type: "text",
  placeholder: "",
  options: "",
  is_required: false,
  is_active: true,
  show_for_category: ["all"],
};

type Props = {
  showNotification: (type: "success" | "error", message: string) => void;
};

const RegistrationFormFieldsAdmin = ({ showNotification }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState<RegistrationFormField | null>(null);
  const [formData, setFormData] = useState<FormFieldFormData>(initialFormData);

  // Database hooks
  const { data: formFields = [], isLoading } = useAllRegistrationFormFields();
  const { mutate: createField, isPending: isCreating } = useCreateRegistrationFormField();
  const { mutate: updateField, isPending: isUpdating } = useUpdateRegistrationFormField();
  const { mutate: deleteField } = useDeleteRegistrationFormField();

  // Open form for new field
  const handleAddField = () => {
    setEditingField(null);
    setFormData(initialFormData);
    setShowForm(true);
  };

  // Open form to edit existing field
  const handleEditField = (field: RegistrationFormField) => {
    setEditingField(field);
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      placeholder: field.placeholder || "",
      options: field.options?.join(", ") || "",
      is_required: field.is_required,
      is_active: field.is_active,
      show_for_category: field.show_for_category || ["all"],
    });
    setShowForm(true);
  };

  // Save field
  const handleSaveField = () => {
    if (!formData.field_name || !formData.field_label) {
      showNotification("error", "Field name and label are required");
      return;
    }

    const fieldData = {
      field_name: formData.field_name.toLowerCase().replace(/\s+/g, "_"),
      field_label: formData.field_label,
      field_type: formData.field_type,
      placeholder: formData.placeholder || undefined,
      options: formData.field_type === "select" && formData.options
        ? formData.options.split(",").map((o) => o.trim()).filter(Boolean)
        : undefined,
      is_required: formData.is_required,
      is_active: formData.is_active,
      show_for_category: formData.show_for_category.length > 0 ? formData.show_for_category : ["all"],
      order: editingField ? editingField.order : formFields.length,
    };

    if (editingField?.id) {
      updateField(
        { id: editingField.id, data: fieldData },
        {
          onSuccess: () => {
            showNotification("success", "Field updated successfully");
            setShowForm(false);
          },
          onError: () => showNotification("error", "Failed to update field"),
        }
      );
    } else {
      createField(fieldData as any, {
        onSuccess: () => {
          showNotification("success", "Field created successfully");
          setShowForm(false);
        },
        onError: () => showNotification("error", "Failed to create field"),
      });
    }
  };

  // Delete field
  const handleDeleteField = (id: string) => {
    if (!confirm("Are you sure you want to delete this field?")) return;
    deleteField(id, {
      onSuccess: () => showNotification("success", "Field deleted successfully"),
      onError: () => showNotification("error", "Failed to delete field"),
    });
  };

  // Toggle field visibility
  const handleToggleActive = (field: RegistrationFormField) => {
    updateField(
      { id: field.id!, data: { is_active: !field.is_active } },
      {
        onSuccess: () => showNotification("success", `Field ${field.is_active ? "hidden" : "shown"}`),
        onError: () => showNotification("error", "Failed to update field"),
      }
    );
  };

  // Move field up/down
  const handleMoveField = (field: RegistrationFormField, direction: "up" | "down") => {
    const currentIndex = formFields.findIndex((f) => f.id === field.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= formFields.length) return;

    const otherField = formFields[newIndex];

    // Swap orders
    updateField(
      { id: field.id!, data: { order: otherField.order } },
      {
        onSuccess: () => {
          updateField(
            { id: otherField.id!, data: { order: field.order } },
            {
              onSuccess: () => showNotification("success", "Field order updated"),
              onError: () => showNotification("error", "Failed to update order"),
            }
          );
        },
        onError: () => showNotification("error", "Failed to update order"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading form fields...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Registration Form Fields</h3>
          <p className="text-sm text-muted-foreground">
            Configure the fields that users will fill when registering
          </p>
        </div>
        <Button onClick={handleAddField} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        {formFields.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No form fields configured</p>
            <Button onClick={handleAddField} className="mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add your first field
            </Button>
          </div>
        ) : (
          formFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center gap-4 p-4 bg-card rounded-lg border transition-colors",
                field.is_active ? "border-border" : "border-border/50 opacity-60"
              )}
            >
              {/* Drag Handle */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveField(field, "up")}
                  disabled={index === 0}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveField(field, "down")}
                  disabled={index === formFields.length - 1}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Field Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{field.field_label}</span>
                  {field.is_required && (
                    <span className="text-xs text-red-500">Required</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span className="bg-muted px-2 py-0.5 rounded text-xs">
                    {FIELD_TYPES.find((t) => t.value === field.field_type)?.label || field.field_type}
                  </span>
                  <span className="truncate">{field.field_name}</span>
                  {/* Show category badges */}
                  {field.show_for_category && !field.show_for_category.includes("all") && (
                    <div className="flex gap-1 flex-wrap">
                      {field.show_for_category.map((cat) => (
                        <span key={cat} className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs">
                          {USER_CATEGORIES.find(c => c.value === cat)?.label || cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(field)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title={field.is_active ? "Hide field" : "Show field"}
                >
                  {field.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleEditField(field)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteField(field.id!)}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Field Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingField ? "Edit Form Field" : "Add Form Field"}
            </DialogTitle>
            <DialogDescription>
              Configure the field properties for the registration form
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field_label">Field Label *</Label>
              <Input
                id="field_label"
                placeholder="e.g., Full Name"
                value={formData.field_label}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    field_label: e.target.value,
                    field_name: prev.field_name || e.target.value.toLowerCase().replace(/\s+/g, "_"),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_name">Field Name (ID) *</Label>
              <Input
                id="field_name"
                placeholder="e.g., full_name"
                value={formData.field_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, field_name: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Used internally. Use lowercase with underscores.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_type">Field Type</Label>
              <Select
                value={formData.field_type}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, field_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                placeholder="e.g., Enter your full name"
                value={formData.placeholder}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, placeholder: e.target.value }))
                }
              />
            </div>

            {formData.field_type === "select" && (
              <div className="space-y-2">
                <Label htmlFor="options">Options (comma-separated)</Label>
                <Input
                  id="options"
                  placeholder="Option 1, Option 2, Option 3"
                  value={formData.options}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, options: e.target.value }))
                  }
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_required: checked === true }))
                  }
                />
                <Label htmlFor="is_required" className="cursor-pointer">
                  Required
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked === true }))
                  }
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3 pt-2 border-t border-border">
              <Label>Show for User Type</Label>
              <p className="text-xs text-muted-foreground">
                Select which user types should see this field. "All Users" shows for everyone.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {USER_CATEGORIES.map((category) => (
                  <div key={category.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`category_${category.value}`}
                      checked={formData.show_for_category.includes(category.value)}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => {
                          let newCategories = [...prev.show_for_category];
                          if (category.value === "all") {
                            // If "All" is selected, clear others
                            newCategories = checked ? ["all"] : [];
                          } else {
                            if (checked) {
                              // Remove "all" if selecting specific category
                              newCategories = newCategories.filter(c => c !== "all");
                              newCategories.push(category.value);
                            } else {
                              newCategories = newCategories.filter(c => c !== category.value);
                            }
                          }
                          return { ...prev, show_for_category: newCategories };
                        });
                      }}
                    />
                    <Label htmlFor={`category_${category.value}`} className="cursor-pointer text-sm">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveField}
              disabled={isCreating || isUpdating}
              className="bg-primary"
            >
              {isCreating || isUpdating ? "Saving..." : "Save Field"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationFormFieldsAdmin;
