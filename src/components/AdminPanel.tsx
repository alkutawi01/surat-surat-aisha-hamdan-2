import { useState, useEffect } from "react";
import { BetaReader, WebsiteStyles, CustomBlock, LandingTexts } from "../types";
import { X, Trash2, Download, Search, Users, Database, Palette, Check, RotateCcw, Sliders, Sparkles, Plus, Layers, LayoutGrid, Trash, Image, FileText, Music, RefreshCw } from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  styles: WebsiteStyles;
  onStylesChange: (updated: WebsiteStyles) => void;
  onResetStyles: () => void;
  customBlocks: CustomBlock[];
  onCustomBlocksChange: (blocks: CustomBlock[]) => void;
  isBetaPopupOpen?: boolean;
  setIsBetaPopupOpen?: (val: boolean) => void;
  landingTexts?: LandingTexts;
}

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  styles, 
  onStylesChange, 
  onResetStyles,
  customBlocks,
  onCustomBlocksChange,
  isBetaPopupOpen = false,
  setIsBetaPopupOpen,
  landingTexts
}: AdminPanelProps) {
  const [readers, setReaders] = useState<BetaReader[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"readers" | "design" | "blocks">("readers");

  // Custom alerts & confirms states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  // Load readers from localStorage
  const loadReaders = () => {
    try {
      const dataStr = localStorage.getItem("beta_readers");
      if (dataStr) {
        setReaders(JSON.parse(dataStr));
      } else {
        setReaders([]);
      }
    } catch (err) {
      console.error("Failed to load beta readers", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadReaders();
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Padam Pembaca Beta",
      message: "Adakah anda pasti mahu memadam pendaftar ini? Tindakan ini tidak boleh dikembalikan.",
      onConfirm: () => {
        try {
          const updated = readers.filter((r) => r.id !== id);
          localStorage.setItem("beta_readers", JSON.stringify(updated));
          setReaders(updated);
        } catch (err) {
          console.error(err);
        }
        setConfirmDialog(null);
      }
    });
  };

  const handleClearAll = () => {
    setConfirmDialog({
      isOpen: true,
      title: "AMARAN: Padam Semua Rekod",
      message: "Ini akan memadamkan SEMUA rekod pendaftar pembaca beta. Adakah anda benar-benar pasti?",
      onConfirm: () => {
        try {
          localStorage.removeItem("beta_readers");
          setReaders([]);
        } catch (err) {
          console.error(err);
        }
        setConfirmDialog(null);
      }
    });
  };

  const handleExportCSV = () => {
    if (readers.length === 0) {
      setAlertDialog({
        isOpen: true,
        title: "Tiada Data",
        message: "Tiada data pendaftar pembaca beta untuk dieksport."
      });
      return;
    }

    try {
      const headers = [
        "ID", 
        landingTexts?.formNameLabel || "Nama Penuh", 
        landingTexts?.formEmailLabel || "Alamat E-mel", 
        landingTexts?.formPhoneLabel || "No. Telefon", 
        landingTexts?.formReasonLabel || "Sebab Ingin Membaca", 
        "Tarikh Daftar"
      ];
      const rows = readers.map((r) => [
        r.id,
        r.name,
        r.email,
        r.phone || "-",
        `"${r.reason.replace(/"/g, '""')}"`,
        new Date(r.createdAt).toLocaleString("ms-MY"),
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Senarai_Pembaca_Beta_Novel.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setAlertDialog({
        isOpen: true,
        title: "Eksport Gagal",
        message: "Gagal mengeksport data pendaftar ke fail CSV."
      });
    }
  };

  const handleStyleFieldChange = (key: keyof WebsiteStyles, value: any) => {
    onStylesChange({
      ...styles,
      [key]: value
    });
  };

  const fontOptions = [
    { label: "EB Garamond (Klasik & Sastera)", value: "EB Garamond" },
    { label: "Playfair Display (Moden & Bold)", value: "Playfair Display" },
    { label: "Cinzel (Kemegahan Tradisional)", value: "Cinzel" },
    { label: "Montserrat (Bersih & Geometrik)", value: "Montserrat" },
    { label: "Space Grotesk (Teknikal & Estetik)", value: "Space Grotesk" },
    { label: "Georgia (Penerbitan Buku)", value: "Georgia" },
    { label: "Inter (Sederhana & Legible)", value: "Inter" }
  ];

  const allAvailableFonts = [
    { label: "EB Garamond (Sastera)", value: "EB Garamond" },
    { label: "Playfair Display (Tajuk)", value: "Playfair Display" },
    { label: "Cinzel (Kemegahan)", value: "Cinzel" },
    { label: "Allison (Cursive Halus)", value: "Allison" },
    { label: "Dancing Script (Cursive Cantik)", value: "Dancing Script" },
    { label: "Great Vibes (Sutera)", value: "Great Vibes" },
    { label: "Pinyon Script (Eksklusif)", value: "Pinyon Script" },
    { label: "Inter (Moden & Jelas)", value: "Inter" },
    { label: "Montserrat (Geometrik)", value: "Montserrat" },
    { label: "Space Grotesk (Estetik)", value: "Space Grotesk" },
    { label: "JetBrains Mono (Teknikal)", value: "JetBrains Mono" },
    { label: "Georgia (Buku Tradisional)", value: "Georgia" }
  ];

  const bodyFontOptions = [
    { label: "Inter (Sangat Jelas & Kemas)", value: "Inter" },
    { label: "EB Garamond (Kesusasteraan)", value: "EB Garamond" },
    { label: "Georgia (Kertas Klasik)", value: "Georgia" },
    { label: "Montserrat (Moden)", value: "Montserrat" },
    { label: "Space Grotesk (Futuristik)", value: "Space Grotesk" }
  ];

  const quoteSizeOptions = [
    { label: "Kecil (Sesuai skrin padat)", value: "text-lg" },
    { label: "Sederhana (Standard Aliran)", value: "text-xl sm:text-2xl lg:text-3xl" },
    { label: "Besar (Berani & Dominan)", value: "text-2xl sm:text-3xl lg:text-4xl" }
  ];

  const hookSizeOptions = [
    { label: "Kecil", value: "text-xl sm:text-2xl" },
    { label: "Sederhana", value: "text-2xl sm:text-3xl" },
    { label: "Besar", value: "text-3xl sm:text-4xl lg:text-5xl" }
  ];

  const borderThicknessOptions = [
    { label: "Tiada Bingkai (0px)", value: "0px" },
    { label: "Nipis (8px)", value: "8px" },
    { label: "Sederhana (12px)", value: "12px" },
    { label: "Kandungan Buku (18px)", value: "18px" },
    { label: "Tebal Klasik (24px)", value: "24px" }
  ];

  const colorPresets = [
    {
      name: "Darah Satria (Asal)",
      bg: "#430400",
      text: "#ffffff",
      accent: "#d7b9b9",
      formBg: "#5a0600"
    },
    {
      name: "Misteri Obsidian",
      bg: "#111111",
      text: "#f5f5f5",
      accent: "#c5a059",
      formBg: "#1f1f1f"
    },
    {
      name: "Rimba Syita' (Emerald)",
      bg: "#0b2111",
      text: "#ecfdf5",
      accent: "#a7f3d0",
      formBg: "#143a1e"
    },
    {
      name: "Laut Dalam (Navy)",
      bg: "#051622",
      text: "#f0f8ff",
      accent: "#1ba098",
      formBg: "#0f2d4a"
    },
    {
      name: "Lembah Pasir (Warm)",
      bg: "#1f1810",
      text: "#fcf6e8",
      accent: "#e0a96d",
      formBg: "#322518"
    },
    {
      name: "Kertas Klasik (Cerah)",
      bg: "#fbf9f4",
      text: "#1a1a1a",
      accent: "#8c3b32",
      formBg: "#f2ede2"
    }
  ];

  const filteredReaders = readers.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      (r.phone && r.phone.includes(query)) ||
      r.reason.toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fade-in" id="admin-modal-overlay">
      <div className="bg-[#1c0200] w-full max-w-4xl rounded-xl border border-[#d7b9b9]/25 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" id="admin-modal">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#d7b9b9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d7b9b9]/10 rounded text-[#d7b9b9]">
              <Database size={20} />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg text-white font-medium tracking-wide">Peti & Kawalan Pentadbir {styles.logoText || "Naskhah"}</h2>
              <p className="font-serif text-xs text-[#d7b9b9]/75">Urus pendaftar pembaca beta dan ubah suai penampilan {styles.logoText || "web"} secara dinamik</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-1.5 hover:bg-white/5 rounded-full text-[#d7b9b9] hover:text-white transition-colors cursor-pointer"
            title="Tutup Panel"
            id="admin-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#d7b9b9]/10 bg-black/15 px-4 sm:px-5">
          <button
            onClick={() => setActiveTab("readers")}
            className={`py-3 px-4 text-xs font-serif uppercase tracking-wider font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "readers"
                ? "border-[#d7b9b9] text-[#d7b9b9] bg-white/5"
                : "border-transparent text-[#d7b9b9]/60 hover:text-white hover:bg-white/2"
            }`}
          >
            <Users size={14} />
            Peti Pembaca ({readers.length})
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`py-3 px-4 text-xs font-serif uppercase tracking-wider font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "design"
                ? "border-[#d7b9b9] text-[#d7b9b9] bg-white/5"
                : "border-transparent text-[#d7b9b9]/60 hover:text-white hover:bg-white/2"
            }`}
          >
            <Palette size={14} />
            Rekabentuk & Gaya Laman
          </button>
          <button
            onClick={() => setActiveTab("blocks")}
            className={`py-3 px-4 text-xs font-serif uppercase tracking-wider font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "blocks"
                ? "border-[#d7b9b9] text-[#d7b9b9] bg-white/5"
                : "border-transparent text-[#d7b9b9]/60 hover:text-white hover:bg-white/2"
            }`}
          >
            <Layers size={14} />
            Elemen Tambahan ({customBlocks.length})
          </button>
        </div>

        {/* Tab 1: Readers Database */}
        {activeTab === "readers" && (
          <>
            {/* Google Sheets Webhook Integration Section */}
            <div className="m-4 bg-[#1c0200]/50 p-4 rounded-xl border border-[#d7b9b9]/25 space-y-3.5 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d7b9b9]/10 pb-2">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-[#d7b9b9]" />
                  <h3 className="text-xs uppercase tracking-[0.15em] font-bold text-white">
                    Penyepaduan Google Sheets (Automatik)
                  </h3>
                </div>
                <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-semibold ${styles.googleSheetsWebhookUrl ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' : 'bg-white/5 text-white/40'}`}>
                  {styles.googleSheetsWebhookUrl ? "● Terhubung" : "○ Belum Dipautkan"}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/70 block font-semibold">Pautan Web App Google Apps Script</label>
                <input
                  type="text"
                  value={styles.googleSheetsWebhookUrl || ""}
                  onChange={(e) => handleStyleFieldChange("googleSheetsWebhookUrl", e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-black/40 border border-[#d7b9b9]/20 rounded px-2.5 py-1.5 font-mono text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#d7b9b9]/50"
                />
                <p className="text-[10px] text-[#d7b9b9]/60 font-serif leading-snug">
                  Bila pendaftar mendaftar di borang, maklumat mereka akan dihantar terus ke Google Spreadsheet anda secara automatik.
                </p>
              </div>

              {/* Collapsible Step-by-Step Instructions */}
              <details className="group border border-[#d7b9b9]/15 rounded-lg bg-black/25 overflow-hidden transition-all">
                <summary className="list-none flex items-center justify-between p-2.5 cursor-pointer hover:bg-white/5 select-none">
                  <span className="text-[10px] font-semibold text-[#d7b9b9]/95 font-serif flex items-center gap-1">
                    <Sparkles size={11} /> Panduan Langkah Demi Langkah Menggunakan Google Sheets
                  </span>
                  <span className="text-[10px] text-[#d7b9b9]/50 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                
                <div className="p-3 text-[11px] text-[#d7b9b9]/85 font-serif space-y-3 border-t border-[#d7b9b9]/10 leading-relaxed bg-[#5a0600]/10 text-left">
                  <p className="font-semibold text-white border-b border-[#d7b9b9]/10 pb-1">Ikuti 5 langkah mudah ini:</p>
                  
                  <ol className="list-decimal pl-4 space-y-2.5">
                    <li>
                      <strong>Cipta Google Sheet Baru:</strong>
                      <p className="text-[#d7b9b9]/75 text-[10.5px]">Sediakan 5 lajur pertama dengan nama berikut: <code className="font-mono text-white bg-black/30 px-1 py-0.5 rounded">Tarikh</code>, <code className="font-mono text-white bg-black/30 px-1 py-0.5 rounded">Nama</code>, <code className="font-mono text-white bg-black/30 px-1 py-0.5 rounded">E-mel</code>, <code className="font-mono text-white bg-black/30 px-1 py-0.5 rounded">Telefon</code>, dan <code className="font-mono text-white bg-black/30 px-1 py-0.5 rounded">Sebab</code>.</p>
                    </li>
                    <li>
                      <strong>Buka Apps Script:</strong>
                      <p className="text-[#d7b9b9]/75 text-[10.5px]">Di dalam Google Sheet anda, klik menu <strong className="text-white">Extensions</strong> &gt; <strong className="text-white">Apps Script</strong>.</p>
                    </li>
                    <li>
                      <strong>Tampal Kod Apps Script:</strong>
                      <p className="text-[#d7b9b9]/75 text-[10.5px]">Padamkan semua kod dalam editor, gantikan dengan kod di bawah:</p>
                      <pre className="w-full overflow-x-auto bg-black/50 border border-white/5 p-2 rounded font-mono text-[9.5px] text-emerald-300 leading-normal max-h-40">{`function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name,
      data.email,
      data.phone,
      data.reason
    ]);
    return ContentService.createTextOutput(JSON.stringify({result: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}</pre>
                    </li>
                    <li>
                      <strong>Deploy Web App:</strong>
                      <p className="text-[#d7b9b9]/75 text-[10.5px]">Klik butang <strong className="text-white">Deploy</strong> &gt; <strong className="text-white">New deployment</strong>. Pilih jenis (select type) <strong className="text-white">Web app</strong>. Konfigurasikan:</p>
                      <ul className="list-disc pl-4 mt-1 text-[10px] space-y-0.5 text-[#d7b9b9]/70">
                        <li>Description: <span className="italic">Peti Masuk Pembaca Beta</span></li>
                        <li>Execute as: <strong className="text-white">Me (e-mel anda)</strong></li>
                        <li>Who has access: <strong className="text-white">Anyone</strong> (PENTING!)</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Salin & Tampal URL:</strong>
                      <p className="text-[#d7b9b9]/75 text-[10.5px]">Klik <strong className="text-white">Deploy</strong> (luluskan kebenaran Google jika diminta). Salin <strong className="text-white">Web app URL</strong> yang dihasilkan dan tampalkan ke dalam ruangan input di atas!</p>
                    </li>
                  </ol>
                  
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg text-emerald-200 text-[10.5px]">
                    💡 <strong>Tips Keselamatan:</strong> Sebaik sahaja anda menampalkan URL di atas, borang pendaftaran akan secara senyap menghantar salinan data pembaca ke Google Sheets anda dalam masa nyata!
                  </div>
                </div>
              </details>
            </div>

            {/* Search and Action Bar */}
            <div className="p-4 bg-black/20 border-b border-[#d7b9b9]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#d7b9b9]/40">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Cari pembaca beta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full font-serif text-xs pl-10 pr-4 py-2 bg-[#430400]/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none focus:border-[#d7b9b9]/50 placeholder:text-[#d7b9b9]/30 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleExportCSV}
                  disabled={readers.length === 0}
                  className="font-serif text-[10px] sm:text-[11px] uppercase tracking-wider font-medium px-3 py-2 border border-[#d7b9b9]/40 hover:border-[#d7b9b9] text-[#d7b9b9] rounded hover:bg-white/5 transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Muat Turun Senarai (CSV)"
                >
                  <Download size={13} />
                  <span>Eksport CSV</span>
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={readers.length === 0}
                  className="font-serif text-[10px] sm:text-[11px] uppercase tracking-wider font-medium px-3 py-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 rounded hover:bg-red-500/5 transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Padam Semua Data"
                >
                  <Trash2 size={13} />
                  <span>Padam Semua</span>
                </button>
              </div>
            </div>

            {/* Readers Table Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredReaders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-[#d7b9b9]/5 rounded-full text-[#d7b9b9]/30 mb-4">
                    <Users size={36} strokeWidth={1} />
                  </div>
                  <h3 className="font-serif text-sm text-white/90">Tiada Data Ditemui</h3>
                  <p className="font-serif text-xs text-[#d7b9b9]/60 max-w-xs mt-1">
                    {readers.length === 0
                      ? "Belum ada pembaca yang mendaftar nama mereka buat masa ini."
                      : "Tiada rekod pendaftar yang memadani carian anda."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded border border-[#d7b9b9]/15">
                  <table className="w-full text-left border-collapse text-xs font-serif">
                    <thead>
                      <tr className="bg-black/45 text-[#d7b9b9]/80 uppercase tracking-widest text-[9px] border-b border-[#d7b9b9]/15">
                        <th className="p-3 font-medium">No.</th>
                        <th className="p-3 font-medium">{landingTexts?.formNameLabel || "Pembaca Beta"}</th>
                        <th className="p-3 font-medium">Hubungan</th>
                        <th className="p-3 font-medium w-1/3">{landingTexts?.formReasonLabel || "Sebab Ingin Membaca"}</th>
                        <th className="p-3 font-medium">Tarikh Daftar</th>
                        <th className="p-3 font-medium text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d7b9b9]/10 text-white/95">
                      {filteredReaders.map((reader, index) => (
                        <tr key={reader.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-[#d7b9b9]/50">{index + 1}</td>
                          <td className="p-3">
                            <div className="font-medium text-white">{reader.name}</div>
                            <div className="text-[9px] text-[#d7b9b9]/55 mt-0.5 select-text">{reader.id}</div>
                          </td>
                          <td className="p-3 select-text">
                            <div className="font-medium">{reader.email}</div>
                            {reader.phone && (
                              <div className="text-[9px] text-[#d7b9b9]/55 mt-0.5">{reader.phone}</div>
                            )}
                          </td>
                          <td className="p-3 text-[#d7b9b9]/85 italic leading-relaxed select-text font-light">
                            “{reader.reason}”
                          </td>
                          <td className="p-3 text-[#d7b9b9]/75 text-[10px]">
                            {new Date(reader.createdAt).toLocaleDateString("ms-MY", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDelete(reader.id)}
                              className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-[#d7b9b9]/50 rounded transition-colors cursor-pointer"
                              title="Padam Pendaftar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab 2: Design Styles Settings */}
        {activeTab === "design" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Pindahan Reka Bentuk & Konfigurasi Laman */}
            <div className="bg-[#5a0600]/30 p-4 rounded-xl border border-[#d7b9b9]/25 space-y-3 text-left">
              <div className="flex items-center gap-2 border-b border-[#d7b9b9]/15 pb-2">
                <RefreshCw size={16} className="text-[#d7b9b9] animate-spin-slow" />
                <h4 className="text-sm font-serif font-medium text-white">
                  Pindahkan Reka Bentuk ke Firebase Hosting (Domain Berbeza)
                </h4>
              </div>
              <p className="text-xs text-[#d7b9b9]/80 font-serif leading-relaxed">
                Reka bentuk, petikan novel, dan semua teks yang anda sunting disimpan secara tempatan di dalam pelayar (<em>localStorage</em>) anda.
                Sebab itulah apabila anda membuka domain baharu di Firebase Hosting, ia kembali menjadi versi asal (default).
                Gunakan butang eksport di bawah untuk menyalin reka bentuk anda dari AI Studio, dan tampalkannya di laman web langsung anda!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const config = {
                        custom_landing_texts: localStorage.getItem("custom_landing_texts") || "{}",
                        custom_novel_quotes: localStorage.getItem("custom_novel_quotes") || "[]",
                        custom_website_styles: localStorage.getItem("custom_website_styles") || "{}",
                        custom_website_blocks: localStorage.getItem("custom_website_blocks") || "[]",
                      };
                      const configStr = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
                      navigator.clipboard.writeText(configStr);
                      alert("✅ Kod konfigurasi reka bentuk berjaya disalin! \n\nSila buka Admin Panel di laman Firebase Hosting anda, tampalkan kod tersebut di bahagian Import, dan klik 'Import & Terapkan'.");
                    } catch (err) {
                      alert("Gagal mengeksport konfigurasi: " + err);
                    }
                  }}
                  className="px-4 py-2 bg-[#d7b9b9] hover:bg-[#c5a7a7] text-[#1c0200] font-serif text-[11px] uppercase tracking-wider font-semibold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Salin Kod Reka Bentuk</span>
                </button>
              </div>

              {/* Import Area */}
              <div className="space-y-2 pt-3 border-t border-[#d7b9b9]/10 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/70 block font-semibold">Tampal Kod Reka Bentuk di Laman Web Firebase Anda</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="import-config-input"
                    placeholder="Tampal kod konfigurasi yang disalin di sini..."
                    className="flex-1 bg-black/40 border border-[#d7b9b9]/20 rounded px-2.5 py-1.5 font-mono text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#d7b9b9]/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inputEl = document.getElementById("import-config-input") as HTMLInputElement;
                      const val = inputEl?.value?.trim();
                      if (!val) {
                        alert("Sila tampalkan kod konfigurasi terlebih dahulu.");
                        return;
                      }
                      try {
                        const decodedStr = decodeURIComponent(escape(atob(val)));
                        const parsed = JSON.parse(decodedStr);
                        
                        if (parsed.custom_landing_texts) localStorage.setItem("custom_landing_texts", parsed.custom_landing_texts);
                        if (parsed.custom_novel_quotes) localStorage.setItem("custom_novel_quotes", parsed.custom_novel_quotes);
                        if (parsed.custom_website_styles) localStorage.setItem("custom_website_styles", parsed.custom_website_styles);
                        if (parsed.custom_website_blocks) localStorage.setItem("custom_website_blocks", parsed.custom_website_blocks);
                        
                        alert("🎉 Reka bentuk berjaya diimport! Halaman akan memuatkan semula gaya baharu.");
                        window.location.reload();
                      } catch (err) {
                        alert("Gagal mengimport. Pastikan kod yang disalin diletakkan dengan betul.");
                      }
                    }}
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-serif text-[11px] uppercase tracking-wider font-semibold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check size={13} />
                    <span>Import & Terapkan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Registration Form Toggle / Editor Assist */}
            {setIsBetaPopupOpen && (
              <div className="bg-[#5a0600]/30 p-4 rounded-xl border border-[#d7b9b9]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-serif font-medium text-white flex items-center gap-1.5 justify-center sm:justify-start">
                    <FileText size={16} className="text-[#d7b9b9]" />
                    Papar & Sunting Borang Pendaftaran
                  </h4>
                  <p className="text-xs text-[#d7b9b9]/80 font-serif">
                    Buka modal pendaftaran pembaca beta sekarang untuk membolehkan suntingan teks secara langsung (Live Edit) pada borang.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBetaPopupOpen(!isBetaPopupOpen)}
                  className={`w-full sm:w-auto px-4 py-2 font-serif text-xs uppercase tracking-wider font-semibold rounded-lg shadow transition-all cursor-pointer select-none whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    isBetaPopupOpen 
                      ? "bg-red-700/80 hover:bg-red-700 text-white border border-red-500/20" 
                      : "bg-[#d7b9b9] hover:bg-[#c5a7a7] text-[#1c0200]"
                  }`}
                >
                  <Sparkles size={13} />
                  <span>{isBetaPopupOpen ? "Tutup Borang" : "Buka Borang"}</span>
                </button>
              </div>
            )}

            {/* Quick Color Presets */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#d7b9b9] mb-3 flex items-center gap-1.5">
                <Sliders size={12} /> Pilihan Palet Warna (Pantas)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {colorPresets.map((preset, idx) => {
                  const isCurrent = styles.bgColor.toLowerCase() === preset.bg.toLowerCase();
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onStylesChange({
                          ...styles,
                          bgColor: preset.bg,
                          textColor: preset.text,
                          accentColor: preset.accent,
                          formBgColor: preset.formBg
                        });
                      }}
                      className={`p-3 rounded-lg text-left border transition-all hover:bg-white/5 cursor-pointer relative ${
                        isCurrent ? "border-[#d7b9b9] bg-white/5" : "border-[#d7b9b9]/15"
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-white mb-2">{preset.name}</div>
                      <div className="flex gap-1.5">
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.bg }} title="Latar belakang" />
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.text }} title="Teks" />
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }} title="Aksen" />
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.formBg }} title="Borang" />
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 text-[#d7b9b9]">
                          <Check size={11} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Left Column: Fonts and Sizes */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d7b9b9]/80 border-b border-[#d7b9b9]/10 pb-1.5">Tipografi & Saiz</h4>
                
                {/* Serif Font */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Jenis Font Utama (Tajuk / Warkah)</label>
                  <select
                    value={styles.serifFont}
                    onChange={(e) => handleStyleFieldChange("serifFont", e.target.value)}
                    className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none focus:border-[#d7b9b9]"
                  >
                    {fontOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#1c0200] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Body Font */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Jenis Font Pembacaan (Borang / Penerangan)</label>
                  <select
                    value={styles.bodyFont}
                    onChange={(e) => handleStyleFieldChange("bodyFont", e.target.value)}
                    className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none focus:border-[#d7b9b9]"
                  >
                    {bodyFontOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#1c0200] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quote Text Size */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Saiz Petikan Warkah Novel</label>
                  <select
                    value={styles.quoteSize}
                    onChange={(e) => handleStyleFieldChange("quoteSize", e.target.value)}
                    className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none focus:border-[#d7b9b9]"
                  >
                    {quoteSizeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#1c0200] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Main Hook Size */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Saiz Wacana Utama</label>
                  <select
                    value={styles.hookSize}
                    onChange={(e) => handleStyleFieldChange("hookSize", e.target.value)}
                    className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none focus:border-[#d7b9b9]"
                  >
                    {hookSizeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#1c0200] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Penjajaran Utama (Global Alignment) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Penjajaran Kandungan Laman (Alignment)</label>
                  <select
                    value={styles.globalAlignment || "center"}
                    onChange={(e) => handleStyleFieldChange("globalAlignment", e.target.value)}
                    className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none focus:border-[#d7b9b9]"
                  >
                    <option value="left" className="bg-[#1c0200] text-white">Rata Kiri (Left Alignment)</option>
                    <option value="center" className="bg-[#1c0200] text-white">Tengah (Center Alignment - Asal)</option>
                    <option value="right" className="bg-[#1c0200] text-white">Rata Kanan (Right Alignment)</option>
                  </select>
                </div>
              </div>

              {/* Right Column: Custom Colors & Element Toggles */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d7b9b9]/80 border-b border-[#d7b9b9]/10 pb-1.5">Warna Tersuai & Elemen</h4>

                {/* Custom Colors Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75">Latar Belakang</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={styles.bgColor}
                        onChange={(e) => handleStyleFieldChange("bgColor", e.target.value)}
                        className="w-7 h-7 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.bgColor}
                        onChange={(e) => handleStyleFieldChange("bgColor", e.target.value)}
                        className="flex-1 font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75">Warna Tulisan</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={styles.textColor}
                        onChange={(e) => handleStyleFieldChange("textColor", e.target.value)}
                        className="w-7 h-7 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.textColor}
                        onChange={(e) => handleStyleFieldChange("textColor", e.target.value)}
                        className="flex-1 font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75">Warna Aksen (Bunga)</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={styles.accentColor}
                        onChange={(e) => handleStyleFieldChange("accentColor", e.target.value)}
                        className="w-7 h-7 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.accentColor}
                        onChange={(e) => handleStyleFieldChange("accentColor", e.target.value)}
                        className="flex-1 font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75">Latar Kad Borang</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={styles.formBgColor}
                        onChange={(e) => handleStyleFieldChange("formBgColor", e.target.value)}
                        className="w-7 h-7 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.formBgColor}
                        onChange={(e) => handleStyleFieldChange("formBgColor", e.target.value)}
                        className="flex-1 font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75">Warna Tab Header / Navigasi Atas</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={styles.headerBgColor || styles.bgColor}
                        onChange={(e) => handleStyleFieldChange("headerBgColor", e.target.value)}
                        className="w-7 h-7 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={styles.headerBgColor || ""}
                        onChange={(e) => handleStyleFieldChange("headerBgColor", e.target.value)}
                        placeholder={styles.bgColor}
                        className="flex-1 font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none placeholder:text-white/40"
                      />
                    </div>
                  </div>
                </div>

                {/* Border Frame Thickness */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Ketebalan Bingkai Sempadan Halaman</label>
                  <select
                    value={styles.borderThickness}
                    onChange={(e) => handleStyleFieldChange("borderThickness", e.target.value)}
                    className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none focus:border-[#d7b9b9]"
                  >
                    {borderThicknessOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#1c0200] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jarak Antara Elemen (Spacing) */}
                <div className="bg-black/25 border border-[#d7b9b9]/15 rounded-lg p-3 space-y-3 my-2">
                  <h5 className="text-[11px] font-bold text-[#d7b9b9] uppercase tracking-wider font-serif">Sela Jarak Antara Elemen (Margin)</h5>
                  
                  <div className="space-y-3">
                    {/* Above Logo Spacing */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-[#d7b9b9]/70 font-serif">
                        <span>Jarak Atas Logo</span>
                        <span className="font-mono text-white/80">{styles.spacingAboveLogo || "24px"}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={parseInt(styles.spacingAboveLogo || "24") || 0}
                        onChange={(e) => handleStyleFieldChange("spacingAboveLogo", `${e.target.value}px`)}
                        className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Logo Spacing */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-[#d7b9b9]/70 font-serif">
                        <span>Jarak Bawah Logo</span>
                        <span className="font-mono text-white/80">{styles.spacingLogo || "48px"}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={parseInt(styles.spacingLogo || "48") || 0}
                        onChange={(e) => handleStyleFieldChange("spacingLogo", `${e.target.value}px`)}
                        className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Below Logo Spacing */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-[#d7b9b9]/70 font-serif">
                        <span>Jarak Elemen Tengah</span>
                        <span className="font-mono text-white/80">{styles.spacingBelowLogo || "24px"}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={parseInt(styles.spacingBelowLogo || "24") || 0}
                        onChange={(e) => handleStyleFieldChange("spacingBelowLogo", `${e.target.value}px`)}
                        className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Quotes Spacing */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-[#d7b9b9]/70 font-serif">
                        <span>Jarak Petikan Novel</span>
                        <span className="font-mono text-white/80">{styles.spacingQuotes || "24px"}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={parseInt(styles.spacingQuotes || "24") || 0}
                        onChange={(e) => handleStyleFieldChange("spacingQuotes", `${e.target.value}px`)}
                        className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Cursive Spacing */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-[#d7b9b9]/70 font-serif">
                        <span>Jarak Jiwa Puitis</span>
                        <span className="font-mono text-white/80">{styles.spacingCursive || "24px"}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={parseInt(styles.spacingCursive || "24") || 0}
                        onChange={(e) => handleStyleFieldChange("spacingCursive", `${e.target.value}px`)}
                        className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Blocks Spacing */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-[#d7b9b9]/70 font-serif">
                        <span>Jarak Blok Elemen Tambahan</span>
                        <span className="font-mono text-white/80">{styles.spacingBlocks || "32px"}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={parseInt(styles.spacingBlocks || "32") || 0}
                        onChange={(e) => handleStyleFieldChange("spacingBlocks", `${e.target.value}px`)}
                        className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Switch Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70 block">Paparan Elemen Halaman</label>
                  
                  <label className="flex items-center gap-3.5 cursor-pointer text-xs font-serif text-white/90 bg-black/20 p-2 rounded.sm hover:bg-black/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={styles.showCountdown}
                      onChange={(e) => handleStyleFieldChange("showCountdown", e.target.checked)}
                      className="accent-[#d7b9b9] h-4 w-4 rounded"
                    />
                    <div>
                      <div>Pamerkan Jam Unduran Pelancaran</div>
                      <div className="text-[10px] text-[#d7b9b9]/65">Mengira hari baki menuju 1 Januari 2027</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 cursor-pointer text-xs font-serif text-white/90 bg-black/20 p-2 rounded.sm hover:bg-black/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={styles.showBorderFrame}
                      onChange={(e) => handleStyleFieldChange("showBorderFrame", e.target.checked)}
                      className="accent-[#d7b9b9] h-4 w-4 rounded"
                    />
                    <div>
                      <div>Aktifkan Bingkai Estetik Sastera</div>
                      <div className="text-[10px] text-[#d7b9b9]/65">Membingkai halaman luar bagai kulit novel premium</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 cursor-pointer text-xs font-serif text-white/90 bg-black/20 p-2 rounded.sm hover:bg-black/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={styles.showCursiveVibe}
                      onChange={(e) => handleStyleFieldChange("showCursiveVibe", e.target.checked)}
                      className="accent-[#d7b9b9] h-4 w-4 rounded"
                    />
                    <div>
                      <div>Pamerkan Teks Jiwa Puitis (Allison)</div>
                      <div className="text-[10px] text-[#d7b9b9]/65">Papar tulisan puitis 'Iman. Cinta. Sastera.' bertulisan tangan</div>
                    </div>
                  </label>
                </div>

              </div>

            </div>

            {/* Logo Customization section inside Admin Panel */}
            <div className="bg-black/25 border border-[#d7b9b9]/15 rounded-xl p-4 sm:p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d7b9b9] border-b border-[#d7b9b9]/10 pb-1.5 flex items-center gap-1.5 font-serif">
                <Sliders size={12} /> Konfigurasi Logo Penerbit
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Jenis Logo</label>
                    <select
                      value={styles.logoType}
                      onChange={(e) => handleStyleFieldChange("logoType", e.target.value)}
                      className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none"
                    >
                      <option value="text" className="bg-[#1c0200]">Teks</option>
                      <option value="image" className="bg-[#1c0200]">Imej</option>
                    </select>
                  </div>

                  {styles.logoType === 'text' ? (
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Teks Logo</label>
                      <input
                        type="text"
                        value={styles.logoText}
                        onChange={(e) => handleStyleFieldChange("logoText", e.target.value)}
                        className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">URL Imej Logo</label>
                      <input
                        type="text"
                        value={styles.logoImageUrl || ""}
                        onChange={(e) => handleStyleFieldChange("logoImageUrl", e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full font-mono text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Saiz Logo ({styles.logoSize})</label>
                    <input
                      type="range"
                      min={styles.logoType === 'image' ? "20" : "14"}
                      max={styles.logoType === 'image' ? "200" : "80"}
                      value={parseInt(styles.logoSize) || 36}
                      onChange={(e) => handleStyleFieldChange("logoSize", `${e.target.value}px`)}
                      className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer my-2"
                    />
                  </div>

                  {styles.logoType === 'text' && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Ketebalan</label>
                        <select
                          value={styles.logoWeight}
                          onChange={(e) => handleStyleFieldChange("logoWeight", e.target.value)}
                          className="w-full font-serif text-xs px-2 py-1.5 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none"
                        >
                          <option value="normal" className="bg-[#1c0200]">Regular</option>
                          <option value="medium" className="bg-[#1c0200]">Medium</option>
                          <option value="semibold" className="bg-[#1c0200]">Semibold</option>
                          <option value="bold" className="bg-[#1c0200]">Bold</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/70">Condong</label>
                        <select
                          value={styles.logoStyle}
                          onChange={(e) => handleStyleFieldChange("logoStyle", e.target.value)}
                          className="w-full font-serif text-xs px-2 py-1.5 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none"
                        >
                          <option value="normal" className="bg-[#1c0200]">Regular</option>
                          <option value="italic" className="bg-[#1c0200]">Italic</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Granular Text Customizer Section inside Admin Panel */}
            <div className="bg-black/25 border border-[#d7b9b9]/15 rounded-xl p-4 sm:p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d7b9b9] border-b border-[#d7b9b9]/10 pb-1.5 flex items-center gap-1.5 font-serif">
                <Sparkles size={12} /> Reka Gaya & Saiz Teks Terperinci
              </h4>
              <p className="text-[11px] text-white/60 leading-relaxed font-serif">
                Ubah suai jenis tulisan, saiz, dan warna bagi setiap elemen teks secara berasingan. Ini memberi anda 100% kawalan kreatif terhadap persembahan sastera halaman ini.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* 1. Teks Atas ("Bakal Terbit") */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Teks Atas ("Bakal Terbit")</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.upperTagFont || "EB Garamond"}
                        onChange={(e) => handleStyleFieldChange("upperTagFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz (cth: 11px)</span>
                        <input
                          type="text"
                          value={styles.upperTagSize || "11px"}
                          onChange={(e) => handleStyleFieldChange("upperTagSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.upperTagColor || "#d7b9b9"}
                            onChange={(e) => handleStyleFieldChange("upperTagColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.upperTagColor || "#d7b9b9"}
                            onChange={(e) => handleStyleFieldChange("upperTagColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Kiraan Detik (Countdown) */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Kiraan Detik (Countdown)</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.countdownFont || "EB Garamond"}
                        onChange={(e) => handleStyleFieldChange("countdownFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz Angka</span>
                        <input
                          type="text"
                          value={styles.countdownSize || "24px"}
                          onChange={(e) => handleStyleFieldChange("countdownSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.countdownColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("countdownColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.countdownColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("countdownColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Logo Penerbit */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Logo Penerbit (Jika Teks)</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.logoFont || "EB Garamond"}
                        onChange={(e) => handleStyleFieldChange("logoFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz Logo</span>
                        <input
                          type="text"
                          value={styles.logoSize || "36px"}
                          onChange={(e) => handleStyleFieldChange("logoSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.logoColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("logoColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.logoColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("logoColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Warkah Petikan (Quotes) */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Warkah Petikan (Novel Quotes)</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.quoteFont || "EB Garamond"}
                        onChange={(e) => handleStyleFieldChange("quoteFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz Font (cth: 22px)</span>
                        <input
                          type="text"
                          value={styles.quoteSize || "22px"}
                          onChange={(e) => handleStyleFieldChange("quoteSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.quoteColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("quoteColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.quoteColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("quoteColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Jiwa Puitis (Cursive Text) */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Teks Jiwa Puitis (Cursive Vibe)</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.cursiveFont || "Allison"}
                        onChange={(e) => handleStyleFieldChange("cursiveFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz Font (cth: 36px)</span>
                        <input
                          type="text"
                          value={styles.cursiveSize || "36px"}
                          onChange={(e) => handleStyleFieldChange("cursiveSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.cursiveColor || "#d7b9b9"}
                            onChange={(e) => handleStyleFieldChange("cursiveColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.cursiveColor || "#d7b9b9"}
                            onChange={(e) => handleStyleFieldChange("cursiveColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Tajuk Borang */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Tajuk Borang Pendaftaran</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.formTitleFont || "EB Garamond"}
                        onChange={(e) => handleStyleFieldChange("formTitleFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz Font (cth: 24px)</span>
                        <input
                          type="text"
                          value={styles.formTitleSize || "24px"}
                          onChange={(e) => handleStyleFieldChange("formTitleSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.formTitleColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("formTitleColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.formTitleColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("formTitleColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Penerangan Borang */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Huraian Borang Pendaftaran</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.formDescFont || "Inter"}
                        onChange={(e) => handleStyleFieldChange("formDescFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz Font (cth: 14px)</span>
                        <input
                          type="text"
                          value={styles.formDescSize || "14px"}
                          onChange={(e) => handleStyleFieldChange("formDescSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.formDescColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("formDescColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.formDescColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("formDescColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Teks Kaki (Footer) */}
                <div className="bg-[#120101]/40 p-3 rounded border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#d7b9b9] font-serif uppercase tracking-wider">Teks Kaki (Footer & Jenama)</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white/50 font-serif">Jenis Font</span>
                      <select
                        value={styles.footerFont || "EB Garamond"}
                        onChange={(e) => handleStyleFieldChange("footerFont", e.target.value)}
                        className="w-full font-serif text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                      >
                        {allAvailableFonts.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#1c0200]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Saiz Font (cth: 12px)</span>
                        <input
                          type="text"
                          value={styles.footerSize || "12px"}
                          onChange={(e) => handleStyleFieldChange("footerSize", e.target.value)}
                          className="w-full font-mono text-[11px] px-2 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-serif">Warna</span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="color"
                            value={styles.footerColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("footerColor", e.target.value)}
                            className="w-6 h-6 rounded border border-[#d7b9b9]/20 bg-transparent p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={styles.footerColor || "#ffffff"}
                            onChange={(e) => handleStyleFieldChange("footerColor", e.target.value)}
                            className="w-full font-mono text-[9px] px-1 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Ambient Background Music Customizer */}
            <div className="bg-[#1c0200]/40 p-4 sm:p-5 rounded-xl border border-[#d7b9b9]/15 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#d7b9b9] flex items-center gap-2 border-b border-[#d7b9b9]/10 pb-2.5">
                <Music size={13} className="text-[#d7b9b9]" /> Muzik Latar & Suasana (Ambient Audio)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/75 font-semibold">Aktifkan Muzik Latar</label>
                    <button
                      type="button"
                      onClick={() => handleStyleFieldChange("audioEnabled", !styles.audioEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        styles.audioEnabled ? "bg-[#d7b9b9]" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#430400] shadow ring-0 transition duration-200 ease-in-out ${
                          styles.audioEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#d7b9b9]/60 font-serif leading-snug">
                    Papar widget pemain muzik kecil di sudut kiri bawah halaman untuk pengunjung memainkan lagu.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75 block">Tajuk Lagu / Alunan</label>
                  <input
                    type="text"
                    value={styles.audioTitle || ""}
                    onChange={(e) => handleStyleFieldChange("audioTitle", e.target.value)}
                    placeholder="Contoh: Alunan Piano Syahdu"
                    className="w-full bg-black/40 border border-[#d7b9b9]/15 rounded px-2.5 py-1.5 font-serif text-xs text-white focus:outline-none focus:border-[#d7b9b9]/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75 block">Pautan Audio (.mp3) atau Preset</label>
                <input
                  type="text"
                  value={styles.audioUrl || ""}
                  onChange={(e) => handleStyleFieldChange("audioUrl", e.target.value)}
                  placeholder="Masukkan pautan URL MP3 terus"
                  className="w-full bg-black/40 border border-[#d7b9b9]/15 rounded px-2.5 py-1.5 font-mono text-xs text-white/90 focus:outline-none focus:border-[#d7b9b9]/40"
                />
              </div>

              {/* Quick presets for calm audio */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/65 block font-semibold">Pilihan Preset Suasana Cepat:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onStylesChange({
                        ...styles,
                        audioUrl: "",
                        audioTitle: "Tiada Muzik",
                        audioEnabled: false
                      });
                    }}
                    className={`px-2 py-1.5 rounded text-[10px] text-center border font-serif cursor-pointer transition-all ${
                      !styles.audioUrl ? "bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]" : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    Tiada
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onStylesChange({
                        ...styles,
                        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        audioTitle: "Gitar Akustik Damai",
                        audioEnabled: true
                      });
                    }}
                    className={`px-2 py-1.5 rounded text-[10px] text-center border font-serif cursor-pointer transition-all ${
                      styles.audioUrl === "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" ? "bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]" : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    🎸 Gitar Akustik
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onStylesChange({
                        ...styles,
                        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        audioTitle: "Piano Syahdu",
                        audioEnabled: true
                      });
                    }}
                    className={`px-2 py-1.5 rounded text-[10px] text-center border font-serif cursor-pointer transition-all ${
                      styles.audioUrl === "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" ? "bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]" : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    🎹 Piano Klasik
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onStylesChange({
                        ...styles,
                        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        audioTitle: "Seruling Kedamaian",
                        audioEnabled: true
                      });
                    }}
                    className={`px-2 py-1.5 rounded text-[10px] text-center border font-serif cursor-pointer transition-all ${
                      styles.audioUrl === "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" ? "bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]" : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    🍃 Seruling Damai
                  </button>
                </div>
              </div>
            </div>

            {/* Iframe Embed Customizer */}
            <div className="bg-[#1c0200]/40 p-4 sm:p-5 rounded-xl border border-[#d7b9b9]/15 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#d7b9b9] flex items-center gap-2 border-b border-[#d7b9b9]/10 pb-2.5">
                <FileText size={13} className="text-[#d7b9b9]" /> Pratonton Dokumen & Kandungan Terbenam (Iframe)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider text-[#d7b9b9]/75 font-semibold">Aktifkan Iframe Embed</label>
                    <button
                      type="button"
                      onClick={() => handleStyleFieldChange("embedIframeEnabled", !styles.embedIframeEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        styles.embedIframeEnabled ? "bg-[#d7b9b9]" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#430400] shadow ring-0 transition duration-200 ease-in-out ${
                          styles.embedIframeEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#d7b9b9]/60 font-serif leading-snug">
                    Papar ruangan khas (seperti PDF preview, borang luar atau audio/video) terus pada halaman.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75 block">Tajuk Bahagian</label>
                  <input
                    type="text"
                    value={styles.embedIframeTitle || ""}
                    onChange={(e) => handleStyleFieldChange("embedIframeTitle", e.target.value)}
                    placeholder="Contoh: Pratonton Novel Terbitan"
                    className="w-full bg-black/40 border border-[#d7b9b9]/15 rounded px-2.5 py-1.5 font-serif text-xs text-white focus:outline-none focus:border-[#d7b9b9]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75 block">Kelebaran (Width)</label>
                  <select
                    value={styles.embedIframeWidth || "max-w-2xl"}
                    onChange={(e) => handleStyleFieldChange("embedIframeWidth", e.target.value)}
                    className="w-full bg-black/40 border border-[#d7b9b9]/15 rounded px-2 py-1.5 font-serif text-xs text-white focus:outline-none focus:border-[#d7b9b9]/40"
                  >
                    <option value="max-w-sm" className="bg-[#1c0200]">Kecil / Compact (max-w-sm)</option>
                    <option value="max-w-md" className="bg-[#1c0200]">Sederhana Kecil (max-w-md)</option>
                    <option value="max-w-lg" className="bg-[#1c0200]">Sederhana (max-w-lg)</option>
                    <option value="max-w-xl" className="bg-[#1c0200]">Sederhana Luas (max-w-xl)</option>
                    <option value="max-w-2xl" className="bg-[#1c0200]">Lalai Seimbang (max-w-2xl)</option>
                    <option value="max-w-3xl" className="bg-[#1c0200]">Lebar (max-w-3xl)</option>
                    <option value="max-w-5xl" className="bg-[#1c0200]">Sangat Lebar (max-w-5xl)</option>
                    <option value="max-w-full" className="bg-[#1c0200]">Lebar Penuh (max-w-full)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75 block">Ketinggian (Height)</label>
                  <input
                    type="text"
                    value={styles.embedIframeHeight || "480px"}
                    onChange={(e) => handleStyleFieldChange("embedIframeHeight", e.target.value)}
                    placeholder="Contoh: 480px atau 600px"
                    className="w-full bg-black/40 border border-[#d7b9b9]/15 rounded px-2.5 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-[#d7b9b9]/40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="embedIframePlayOnly"
                  checked={styles.embedIframePlayOnly || false}
                  onChange={(e) => handleStyleFieldChange("embedIframePlayOnly", e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-black/40 border border-[#d7b9b9]/30 text-[#d7b9b9] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="embedIframePlayOnly" className="text-xs text-white/90 cursor-pointer select-none font-serif">
                  Kecilkan pemain (Hanya tunjukkan butang PLAY bulat)
                </label>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/75 block">Kod Iframe (Embed Code) atau Pautan Terus</label>
                <textarea
                  value={styles.embedIframeCode || ""}
                  onChange={(e) => handleStyleFieldChange("embedIframeCode", e.target.value)}
                  placeholder='Contoh: <iframe src="https://drive.google.com/file/d/.../preview" width="640" height="480"></iframe>'
                  rows={3}
                  className="w-full bg-black/40 border border-[#d7b9b9]/15 rounded px-2.5 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-[#d7b9b9]/40 resize-none leading-normal"
                />
              </div>

              {/* Quick Preset buttons */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/65 block font-semibold">Contoh / Preset Cepat:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onStylesChange({
                        ...styles,
                        embedIframeCode: '<iframe src="https://drive.google.com/file/d/17YVkud6uAqE8cwNiNY5O2vQ6jP3qqRYf/preview" width="640" height="480"></iframe>',
                        embedIframeTitle: "Pratonton Karya",
                        embedIframeEnabled: true
                      });
                    }}
                    className={`px-2.5 py-1.5 rounded text-[10px] border font-serif cursor-pointer transition-all ${
                      styles.embedIframeCode?.includes("17YVkud6uAqE8cwNiNY5O2vQ6jP3qqRYf") ? "bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]" : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    📄 Buku Google Drive (Alkutawi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onStylesChange({
                        ...styles,
                        embedIframeCode: "",
                        embedIframeEnabled: false
                      });
                    }}
                    className="px-2.5 py-1.5 rounded text-[10px] border border-white/10 text-white/70 hover:bg-white/5 font-serif cursor-pointer"
                  >
                    Tiada
                  </button>
                </div>
              </div>
            </div>

            {/* Default Reset Section */}
            <div className="pt-4 border-t border-[#d7b9b9]/15 flex items-center justify-between">
              <span className="text-[11px] font-serif text-[#d7b9b9]/60">Kembalikan semua gaya di atas kepada penampilan rupa reka asal</span>
              <button
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: "Set Semula Gaya Asal",
                    message: "Adakah anda pasti mahu menetapkan semula gaya rekabentuk halaman kepada tetapan asal?",
                    onConfirm: () => {
                      onResetStyles();
                      setConfirmDialog(null);
                    }
                  });
                }}
                className="font-serif text-[11px] uppercase tracking-wider font-semibold px-3.5 py-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 rounded hover:bg-red-500/5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={12} />
                Set Semula Gaya Asal
              </button>
            </div>

          </div>
        )}

        {/* Tab 3: Additional Elements (Kotak Tulisan / Imej) */}
        {activeTab === "blocks" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d7b9b9]/15 pb-4 gap-4">
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#d7b9b9] flex items-center gap-1.5">
                  <Layers size={14} /> Pengurusan Kotak & Elemen Tambahan
                </h3>
                <p className="text-[11px] text-white/50 font-serif mt-1">
                  Tambah blok kandungan khas (kotak tulisan sastera, galeri foto, atau ulasan tambahan) ke dalam laman web anda.
                </p>
              </div>
              <button
                onClick={() => {
                  const newBlock: CustomBlock = {
                    id: Date.now().toString(),
                    title: "Kotak Kandungan Baru",
                    content: "Tuliskan perenggan indah atau penerangan novel di sini...",
                    type: "text",
                    bgColor: "#5a0600",
                    textColor: "#ffffff",
                    borderColor: "#d7b9b9",
                    borderThickness: "1px",
                    borderRadius: "md",
                    padding: "p-6",
                    alignment: "center",
                  };
                  onCustomBlocksChange([...customBlocks, newBlock]);
                }}
                className="font-serif text-[11px] uppercase tracking-wider font-semibold px-4 py-2 bg-[#d7b9b9] text-[#430400] hover:bg-[#cbb0b0] rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-lg self-start sm:self-auto"
              >
                <Plus size={13} />
                Tambah Kotak Baru
              </button>
            </div>

            {customBlocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-[#d7b9b9]/5 rounded-full text-[#d7b9b9]/30 mb-4">
                  <LayoutGrid size={36} strokeWidth={1} />
                </div>
                <h3 className="font-serif text-sm text-white/90">Tiada Elemen Tambahan</h3>
                <p className="font-serif text-xs text-[#d7b9b9]/60 max-w-xs mt-1">
                  Halaman anda hanya memaparkan elemen standard (Teaser, Sastera, dan Borang). Klik "Tambah Kotak Baru" di atas untuk menambah kandungan dinamik.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {customBlocks.map((block, idx) => (
                  <div key={block.id} className="bg-black/30 border border-[#d7b9b9]/15 rounded-xl p-4 sm:p-5 space-y-4 relative">
                    {/* Block Title and Index */}
                    <div className="flex items-center justify-between border-b border-[#d7b9b9]/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#d7b9b9]/10 text-[#d7b9b9] text-[10px] font-mono flex items-center justify-center">{idx + 1}</span>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => {
                            const updated = customBlocks.map(b => b.id === block.id ? { ...b, title: e.target.value } : b);
                            onCustomBlocksChange(updated);
                          }}
                          placeholder="Tajuk Kotak..."
                          className="font-serif text-xs font-semibold text-white bg-transparent border-b border-transparent hover:border-[#d7b9b9]/30 focus:border-[#d7b9b9] px-1 py-0.5 focus:outline-none min-w-[200px]"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: "Padam Elemen Kotak",
                            message: `Adakah anda pasti mahu memadam kotak "${block.title || 'ini'}"? Tindakan ini tidak boleh dikembalikan.`,
                            onConfirm: () => {
                              const updated = customBlocks.filter(b => b.id !== block.id);
                              onCustomBlocksChange(updated);
                              setConfirmDialog(null);
                            }
                          });
                        }}
                        className="p-1.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded transition-colors cursor-pointer"
                        title="Padam Kotak Ini"
                      >
                        <Trash size={13} />
                      </button>
                    </div>

                    {/* Block Type selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/70 font-semibold">Jenis Elemen Kandungan</label>
                          <div className="flex gap-2">
                            {(['text', 'image', 'both'] as const).map(t => (
                              <button
                                key={t}
                                onClick={() => {
                                  const updated = customBlocks.map(b => b.id === block.id ? { ...b, type: t } : b);
                                  onCustomBlocksChange(updated);
                                }}
                                className={`flex-1 py-1 rounded text-[10px] font-serif uppercase tracking-wider border transition-all cursor-pointer ${block.type === t ? 'bg-[#d7b9b9] text-[#430400] border-[#d7b9b9] font-medium' : 'border-white/10 text-white/70 hover:bg-white/5'}`}
                              >
                                {t === 'text' ? 'Tulisan' : t === 'image' ? 'Gambar' : 'Gabungan'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Content textarea */}
                        {block.type !== 'image' && (
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/70 font-semibold">Kandungan Tulisan</label>
                            <textarea
                              rows={3}
                              value={block.content}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              placeholder="Masukkan kandungan sastera atau teks..."
                              className="w-full font-serif text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none"
                            />
                          </div>
                        )}

                        {/* Image URL input */}
                        {block.type !== 'text' && (
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase tracking-wider text-[#d7b9b9]/70 font-semibold">Pautan Gambar (Image URL)</label>
                            <input
                              type="text"
                              value={block.imageUrl || ""}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, imageUrl: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full font-mono text-xs px-3 py-2 bg-black/40 border border-[#d7b9b9]/25 rounded text-white focus:outline-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Right column: Design settings of the block */}
                      <div className="grid grid-cols-2 gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                        {/* Background Color */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/60">Latar Belakang</label>
                          <div className="flex gap-1 items-center">
                            <input
                              type="color"
                              value={block.bgColor || "#5a0600"}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, bgColor: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              className="w-5 h-5 rounded border border-[#d7b9b9]/10 bg-transparent p-0 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={block.bgColor || ""}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, bgColor: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              placeholder="#5a0600"
                              className="w-full font-mono text-[9px] px-1 py-0.5 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Text Color */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/60">Warna Tulisan</label>
                          <div className="flex gap-1 items-center">
                            <input
                              type="color"
                              value={block.textColor || "#ffffff"}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, textColor: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              className="w-5 h-5 rounded border border-[#d7b9b9]/10 bg-transparent p-0 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={block.textColor || ""}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, textColor: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              placeholder="#ffffff"
                              className="w-full font-mono text-[9px] px-1 py-0.5 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Border Color */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/60">Sempadan (Border)</label>
                          <div className="flex gap-1 items-center">
                            <input
                              type="color"
                              value={block.borderColor || "#d7b9b9"}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, borderColor: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              className="w-5 h-5 rounded border border-[#d7b9b9]/10 bg-transparent p-0 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={block.borderColor || ""}
                              onChange={(e) => {
                                const updated = customBlocks.map(b => b.id === block.id ? { ...b, borderColor: e.target.value } : b);
                                onCustomBlocksChange(updated);
                              }}
                              placeholder="#d7b9b9"
                              className="w-full font-mono text-[9px] px-1 py-0.5 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Alignment */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/60">Penjajaran (Alignment)</label>
                          <select
                            value={block.alignment || "center"}
                            onChange={(e) => {
                              const updated = customBlocks.map(b => b.id === block.id ? { ...b, alignment: e.target.value as any } : b);
                              onCustomBlocksChange(updated);
                            }}
                            className="w-full font-serif text-[10px] px-1.5 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          >
                            <option value="left" className="bg-[#1c0200]">Kiri (Left)</option>
                            <option value="center" className="bg-[#1c0200]">Tengah (Center)</option>
                            <option value="right" className="bg-[#1c0200]">Kanan (Right)</option>
                          </select>
                        </div>

                        {/* Border Thickness */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/60">Tebal Bingkai</label>
                          <select
                            value={block.borderThickness || "1px"}
                            onChange={(e) => {
                              const updated = customBlocks.map(b => b.id === block.id ? { ...b, borderThickness: e.target.value } : b);
                              onCustomBlocksChange(updated);
                            }}
                            className="w-full font-serif text-[10px] px-1.5 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          >
                            <option value="0px" className="bg-[#1c0200]">Tiada (0px)</option>
                            <option value="1px" className="bg-[#1c0200]">Nipis (1px)</option>
                            <option value="2px" className="bg-[#1c0200]">Sederhana (2px)</option>
                            <option value="4px" className="bg-[#1c0200]">Tebal (4px)</option>
                          </select>
                        </div>

                        {/* Corner Radius */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/60">Sisi Melengkung</label>
                          <select
                            value={block.borderRadius || "md"}
                            onChange={(e) => {
                              const updated = customBlocks.map(b => b.id === block.id ? { ...b, borderRadius: e.target.value } : b);
                              onCustomBlocksChange(updated);
                            }}
                            className="w-full font-serif text-[10px] px-1.5 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          >
                            <option value="none" className="bg-[#1c0200]">Tajam (None)</option>
                            <option value="sm" className="bg-[#1c0200]">Sedikit (Sm)</option>
                            <option value="md" className="bg-[#1c0200]">Sederhana (Md)</option>
                            <option value="lg" className="bg-[#1c0200]">Bulat (Lg)</option>
                            <option value="full" className="bg-[#1c0200]">Sfera (Full)</option>
                          </select>
                        </div>

                        {/* Padding */}
                        <div className="flex flex-col gap-1 col-span-2">
                          <label className="text-[9px] uppercase tracking-wider text-[#d7b9b9]/60">Ruang Dalam (Padding)</label>
                          <select
                            value={block.padding || "p-6"}
                            onChange={(e) => {
                              const updated = customBlocks.map(b => b.id === block.id ? { ...b, padding: e.target.value } : b);
                              onCustomBlocksChange(updated);
                            }}
                            className="w-full font-serif text-[10px] px-1.5 py-1 bg-black/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none"
                          >
                            <option value="p-2" className="bg-[#1c0200]">Padat (p-2)</option>
                            <option value="p-4" className="bg-[#1c0200]">Sederhana (p-4)</option>
                            <option value="p-6" className="bg-[#1c0200]">Luas (p-6)</option>
                            <option value="p-8" className="bg-[#1c0200]">Sangat Luas (p-8)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#d7b9b9]/15 bg-black/30 flex items-center justify-between text-[11px] font-serif text-[#d7b9b9]/75">
          <div>
            {activeTab === "readers" ? (
              <span>Menunjukkan <strong>{filteredReaders.length}</strong> daripada <strong>{readers.length}</strong> pembaca beta yang berdaftar</span>
            ) : (
              <span>Penyesuaian Gaya Laman Maktabah Alkutawi</span>
            )}
          </div>
          <div>
            Maktabah Alkutawi © 2026
          </div>
        </div>
      </div>

      {/* Custom Confirmation Sub-modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in" id="admin-confirm-submodal">
          <div className="bg-[#1c0200] w-full max-w-sm rounded-lg border border-[#d7b9b9]/25 shadow-2xl p-5 flex flex-col gap-4 text-white">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d7b9b9] border-b border-[#d7b9b9]/10 pb-2">{confirmDialog.title}</h3>
            <p className="font-serif text-xs text-white/80 leading-relaxed bg-black/20 p-3 rounded">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2.5 font-serif text-xs">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-3.5 py-1.5 border border-[#d7b9b9]/20 hover:bg-white/5 rounded text-white/80 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                }}
                className="px-3.5 py-1.5 bg-[#d7b9b9] hover:bg-[#c5a059] text-[#430400] font-semibold rounded transition-all cursor-pointer"
              >
                Sahkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Sub-modal */}
      {alertDialog && alertDialog.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in" id="admin-alert-submodal">
          <div className="bg-[#1c0200] w-full max-w-sm rounded-lg border border-[#d7b9b9]/25 shadow-2xl p-5 flex flex-col gap-4 text-white">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d7b9b9] border-b border-[#d7b9b9]/10 pb-2">{alertDialog.title}</h3>
            <p className="font-serif text-xs text-white/80 leading-relaxed bg-black/20 p-3 rounded">{alertDialog.message}</p>
            <div className="flex justify-end font-serif text-xs">
              <button 
                onClick={() => setAlertDialog(null)}
                className="px-4 py-1.5 bg-[#d7b9b9] hover:bg-[#c5a059] text-[#430400] font-semibold rounded transition-all cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
