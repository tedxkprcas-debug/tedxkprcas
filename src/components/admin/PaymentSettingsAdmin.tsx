import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Upload, QrCode, CreditCard, Loader2, FileSpreadsheet, ExternalLink, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import {
  usePaymentSettings,
  useUpdatePaymentSettings,
  useUploadPaymentQRCode,
  useSiteSetting,
  useUpdateSiteSetting,
} from "@/hooks/use-database";

type Props = {
  showNotification: (type: "success" | "error", message: string) => void;
};

const PaymentSettingsAdmin = ({ showNotification }: Props) => {
  const [upiId, setUpiId] = useState("");
  const [merchantName, setMerchantName] = useState("TEDx KPRCAS");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [useCustomQr, setUseCustomQr] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [showSheetHelp, setShowSheetHelp] = useState(false);

  // Database hooks
  const { data: paymentSettings, isLoading } = usePaymentSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdatePaymentSettings();
  const { mutateAsync: uploadQRCode } = useUploadPaymentQRCode();
  
  // Google Sheet settings
  const { data: savedSheetUrl } = useSiteSetting("google_sheet_webhook_url");
  const { mutate: updateSiteSetting, isPending: isSavingSheet } = useUpdateSiteSetting();

  // Generate UPI payment string for QR code
  const upiPaymentString = useMemo(() => {
    if (!upiId) return "";
    const amount = parseFloat(paymentAmount) || 0;
    // Format amount with 2 decimal places for UPI compatibility
    const formattedAmount = amount.toFixed(2);
    // Clean merchant name - remove special characters and limit length
    const cleanName = (merchantName || "TEDxKPRCAS").replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 20);
    // UPI deep link format - simplified for maximum compatibility
    return `upi://pay?pa=${upiId}&pn=${cleanName}&am=${formattedAmount}&cu=INR`;
  }, [upiId, paymentAmount, merchantName]);

  // Load settings into form
  useEffect(() => {
    if (paymentSettings) {
      setUpiId(paymentSettings.upi_id || "");
      setPaymentAmount(paymentSettings.payment_amount?.toString() || "0");
      setPaymentInstructions(paymentSettings.payment_instructions || "");
      setQrCodeUrl(paymentSettings.qr_code_url || "");
      // If there's a custom QR URL stored, use custom mode
      if (paymentSettings.qr_code_url) {
        setUseCustomQr(true);
      }
    }
  }, [paymentSettings]);

  // Load Google Sheet URL
  useEffect(() => {
    if (savedSheetUrl) {
      setSheetUrl(savedSheetUrl);
    }
  }, [savedSheetUrl]);

  // Save Google Sheet URL
  const handleSaveSheetUrl = () => {
    updateSiteSetting(
      { key: "google_sheet_webhook_url", value: sheetUrl },
      {
        onSuccess: () => showNotification("success", "Google Sheet URL saved"),
        onError: () => showNotification("error", "Failed to save Google Sheet URL"),
      }
    );
  };

  // Handle QR code upload (optional manual override)
  const handleQRCodeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadQRCode(file);
      setQrCodeUrl(url);
      setUseCustomQr(true);
      showNotification("success", "QR code uploaded successfully");
    } catch (error) {
      showNotification("error", "Failed to upload QR code");
    } finally {
      setIsUploading(false);
    }
  };

  // Switch to auto-generated QR
  const handleUseAutoQr = () => {
    setUseCustomQr(false);
    setQrCodeUrl("");
  };

  // Save settings
  const handleSave = () => {
    updateSettings(
      {
        upi_id: upiId,
        payment_amount: parseFloat(paymentAmount) || 0,
        payment_instructions: paymentInstructions,
        qr_code_url: useCustomQr ? qrCodeUrl : "", // Only save URL if using custom QR
      },
      {
        onSuccess: () => showNotification("success", "Payment settings saved"),
        onError: () => showNotification("error", "Failed to save settings"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading payment settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Payment Settings</h3>
        <p className="text-sm text-muted-foreground">
          Enter UPI ID and amount to auto-generate payment QR code
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Settings Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment_amount">Registration Fee (₹)</Label>
            <Input
              id="payment_amount"
              type="number"
              placeholder="500"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upi_id">UPI ID</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="upi_id"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              QR code will be auto-generated from this UPI ID
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant_name">Merchant Name (Optional)</Label>
            <Input
              id="merchant_name"
              placeholder="TEDx KPRCAS"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Name shown in UPI payment apps
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_instructions">Payment Instructions</Label>
            <textarea
              id="payment_instructions"
              placeholder="Enter any additional instructions for users making payment..."
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full bg-primary"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>

        {/* Right Column - QR Code */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Payment QR Code</Label>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                {useCustomQr ? "Custom" : "Auto-Generated"}
              </span>
            </div>
            {useCustomQr && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUseAutoQr}
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Use Auto QR
              </Button>
            )}
          </div>
          
          {/* QR Code Display */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {/* Auto-generated QR Code */}
            {!useCustomQr && upiId ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                  <QRCodeSVG
                    value={upiPaymentString}
                    size={192}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-600">
                    ✓ QR Auto-Generated from UPI ID
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scans to: {upiPaymentString.substring(0, 50)}...
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("qr-upload")?.click()}
                  className="mt-2"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Upload Custom QR Instead
                </Button>
                <input
                  id="qr-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleQRCodeUpload}
                  className="hidden"
                />
              </div>
            ) : useCustomQr && qrCodeUrl ? (
              /* Custom uploaded QR Code */
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Custom QR code uploaded
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("qr-upload2")?.click()}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Change QR Code
                </Button>
                <input
                  id="qr-upload2"
                  type="file"
                  accept="image/*"
                  onChange={handleQRCodeUpload}
                  className="hidden"
                />
              </div>
            ) : (
              /* No UPI ID - show placeholder */
              <div
                className={cn(
                  "cursor-pointer transition-colors",
                  isUploading ? "opacity-50 pointer-events-none" : ""
                )}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="p-4 bg-muted rounded-full">
                      <QrCode className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Enter UPI ID to Generate QR</p>
                      <p className="text-sm text-muted-foreground">
                        Or <button 
                          type="button"
                          onClick={() => document.getElementById("qr-upload3")?.click()}
                          className="text-primary underline"
                        >
                          upload a custom QR code
                        </button>
                      </p>
                    </div>
                    <input
                      id="qr-upload3"
                      type="file"
                      accept="image/*"
                      onChange={handleQRCodeUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Preview</h4>
            <div className="bg-card rounded-lg p-4 space-y-2">
              <p className="text-center text-2xl font-bold text-primary">
                ₹{paymentAmount || "0"}
              </p>
              {upiId && (
                <p className="text-center text-sm text-muted-foreground">
                  UPI: <code className="bg-muted px-2 py-0.5 rounded">{upiId}</code>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Sheet Integration */}
      <div className="border-t pt-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Google Sheet Integration
            </h3>
            <p className="text-sm text-muted-foreground">
              Automatically save registration data to a Google Sheet
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSheetHelp(!showSheetHelp)}
          >
            <Info className="w-4 h-4 mr-1" />
            Setup Guide
          </Button>
        </div>

        {/* Setup Instructions */}
        {showSheetHelp && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4 text-sm space-y-3">
            <h4 className="font-medium text-blue-400">How to set up Google Sheet integration:</h4>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Create a new Google Sheet</li>
              <li>Add headers in Row 1: <code className="bg-muted px-1 rounded text-xs">timestamp, name, email, phone, user_type, registration_code, payment_status, user_upi_id, transaction_id</code></li>
              <li>Go to <strong>Extensions → Apps Script</strong></li>
              <li>Replace the code with:</li>
            </ol>
            <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Get headers from first row
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Build row based on headers
  var row = headers.map(function(header) {
    return data[header] || '';
  });
  
  // Append the row
  sheet.appendRow(row);
  
  return ContentService.createTextOutput('Success');
}`}
            </pre>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground" start={5}>
              <li>Click <strong>Deploy → New deployment</strong></li>
              <li>Select type: <strong>Web app</strong></li>
              <li>Set "Who has access" to <strong>Anyone</strong></li>
              <li>Click <strong>Deploy</strong> and copy the Web app URL</li>
              <li>Paste the URL below</li>
            </ol>
          </div>
        )}

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="https://script.google.com/macros/s/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <Button
            onClick={handleSaveSheetUrl}
            disabled={isSavingSheet}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSavingSheet ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
        
        {savedSheetUrl && (
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Google Sheet connected - registrations will be saved automatically
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSettingsAdmin;
