import React, { useState } from "react";
import { motion } from "motion/react";
import { BetaReader } from "../types";
import { Send, CheckCircle2, Loader2, Sparkles, Palette } from "lucide-react";
import { sanitizeText } from "../utils/sanitize";

interface BetaRegistrationProps {
  title?: string;
  description?: string;
  isEditMode?: boolean;
  onTitleChange?: (val: string) => void;
  onDescChange?: (val: string) => void;
  accentColor?: string;
  formBgColor?: string;
  bodyFont?: string;
  serifFont?: string;
  formNameLabel?: string;
  formEmailLabel?: string;
  formPhoneLabel?: string;
  formReasonLabel?: string;
  formBtnText?: string;
  onNameLabelChange?: (val: string) => void;
  onEmailLabelChange?: (val: string) => void;
  onPhoneLabelChange?: (val: string) => void;
  onReasonLabelChange?: (val: string) => void;
  onBtnTextChange?: (val: string) => void;
  formTitleFont?: string;
  formTitleSize?: string;
  formTitleColor?: string;
  formDescFont?: string;
  formDescSize?: string;
  formDescColor?: string;
  onTitleStyleClick?: () => void;
  onDescStyleClick?: () => void;
  googleSheetsWebhookUrl?: string;
  successTitle?: string;
  successDesc?: string;
  successBtnText?: string;
  onSuccessTitleChange?: (val: string) => void;
  onSuccessDescChange?: (val: string) => void;
  onSuccessBtnTextChange?: (val: string) => void;
}

export default function BetaRegistration({
  title = "Sertai Sebagai Pembaca Beta",
  description = "Daftar nama anda untuk berpeluang membaca draf naskhah sastera yang masih dirahsiakan ini. Anda akan dimaklumkan tentang tajuk novel sebelum pelancaran rasmi.",
  isEditMode = false,
  onTitleChange,
  onDescChange,
  accentColor = "#d7b9b9",
  formBgColor = "#5a0600",
  bodyFont = "Inter",
  serifFont = "EB Garamond",
  formNameLabel = "Nama Penuh",
  formEmailLabel = "Alamat E-mel",
  formPhoneLabel = "No. Telefon",
  formReasonLabel = "Hasrat Pembaca",
  formBtnText = "Sertai Kami",
  onNameLabelChange,
  onEmailLabelChange,
  onPhoneLabelChange,
  onReasonLabelChange,
  onBtnTextChange,
  formTitleFont,
  formTitleSize,
  formTitleColor,
  formDescFont,
  formDescSize,
  formDescColor,
  onTitleStyleClick,
  onDescStyleClick,
  googleSheetsWebhookUrl,
  successTitle = "Warkah Anda Diterima",
  successDesc = "“Alhamdulillah, nama anda telah dicatat dalam warkah kami. Kami akan menghubungi anda melalui e-mel sekiranya anda terpilih untuk menerima draf awal naskhah ini.”",
  successBtnText = "Daftar Nama Lain",
  onSuccessTitleChange,
  onSuccessDescChange,
  onSuccessBtnTextChange
}: BetaRegistrationProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !reason.trim()) {
      setErrorMsg("Sila penuhi semua ruangan wajib (Nama, E-mel & Sebab).");
      return;
    }

    setIsSubmitting(true);

    const newReader: BetaReader = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      // Fetch existing
      const existingDataStr = localStorage.getItem("beta_readers");
      const existingData: BetaReader[] = existingDataStr ? JSON.parse(existingDataStr) : [];

      // Check duplicate email
      const isDuplicate = existingData.some((r) => r.email === newReader.email);
      if (isDuplicate) {
        setErrorMsg("Alamat e-mel ini telah pun didaftarkan sebelum ini.");
        setIsSubmitting(false);
        return;
      }

      // Send to Google Sheets if webhook is available
      if (googleSheetsWebhookUrl && googleSheetsWebhookUrl.trim()) {
        try {
          await fetch(googleSheetsWebhookUrl.trim(), {
            method: "POST",
            mode: "no-cors", // avoid CORS preflight failures on typical Apps Script setups
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              timestamp: new Date().toLocaleString("ms-MY"),
              name: newReader.name,
              email: newReader.email,
              phone: newReader.phone || "",
              reason: newReader.reason
            }),
          });
        } catch (sheetErr) {
          console.warn("Google Sheet Webhook Warning: ", sheetErr);
        }
      }

      // Simulate a small delay for premium visual satisfaction
      await new Promise(resolve => setTimeout(resolve, 800));

      existingData.push(newReader);
      localStorage.setItem("beta_readers", JSON.stringify(existingData));

      setIsSuccess(true);
      setIsSubmitting(false);
      
      // Reset fields
      setName("");
      setEmail("");
      setPhone("");
      setReason("");
    } catch (err) {
      setErrorMsg("Sesuatu tidak kena. Sila cuba lagi.");
      setIsSubmitting(false);
    }
  };

  const customTitleStyle = {
    fontFamily: formTitleFont || serifFont,
    fontSize: formTitleSize || undefined,
    color: formTitleColor || "#ffffff",
    borderBottomColor: isEditMode ? `${accentColor}50` : undefined
  };

  const customDescStyle = {
    fontFamily: formDescFont || serifFont,
    fontSize: formDescSize || undefined,
    color: formDescColor || `${accentColor}d5`,
    borderBottomColor: isEditMode ? `${accentColor}50` : undefined
  };

  const inputStyle = {
    borderColor: `${accentColor}40`,
    fontFamily: bodyFont
  };

  const textStyle = {
    fontFamily: bodyFont
  };

  // Render glassmorphic translucent container with smooth entrance animation
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto p-8 sm:p-10 rounded-sm border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl relative overflow-hidden transition-all duration-500" 
      style={{ 
        fontFamily: bodyFont
      }}
      id="beta-registration-box"
    >
      {/* Decorative background element '27' */}
      <div className="absolute -right-6 -bottom-10 opacity-[0.03] select-none pointer-events-none">
        <span className="text-[200px] leading-none font-bold" style={{ color: accentColor, fontFamily: serifFont }}>27</span>
      </div>

      {isSuccess ? (
        <div className="text-center py-8 px-2 animate-fade-in relative z-10" id="registration-success">
          <div className="flex justify-center mb-5" style={{ color: accentColor }}>
            <CheckCircle2 size={44} strokeWidth={1} className="animate-bounce" />
          </div>
          <h3 className="text-xl sm:text-2xl text-white mb-4 tracking-wide font-medium" style={customTitleStyle}>
            {isEditMode ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onSuccessTitleChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                className="border-b border-dashed hover:bg-white/5 px-0.5 rounded outline-none"
                style={{ borderBottomColor: `${accentColor}50` }}
                title="Klik untuk sunting tajuk kejayaan"
              >
                {successTitle}
              </span>
            ) : (
              <span>{successTitle}</span>
            )}
          </h3>
          <p className="text-sm leading-relaxed max-w-sm mx-auto mb-8 font-light italic" style={customDescStyle}>
            {isEditMode ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onSuccessDescChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                className="border-b border-dashed hover:bg-white/5 px-0.5 rounded outline-none block"
                style={{ borderBottomColor: `${accentColor}50` }}
                title="Klik untuk sunting penerangan kejayaan"
              >
                {successDesc}
              </span>
            ) : (
              <span>{successDesc}</span>
            )}
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="uppercase tracking-[0.25em] hover:opacity-80 transition-opacity underline underline-offset-8 font-serif"
            style={{ color: accentColor, fontSize: "10px" }}
            id="btn-register-another"
          >
            {isEditMode ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onSuccessBtnTextChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                onClick={(e) => e.stopPropagation()}
                className="border-b border-dashed hover:bg-white/5 px-0.5 rounded outline-none"
                style={{ borderBottomColor: `${accentColor}50` }}
                title="Klik untuk sunting teks butang semula"
              >
                {successBtnText}
              </span>
            ) : (
              <span>{successBtnText}</span>
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10" id="beta-registration-form">
          <div className="text-center mb-2">
            <span 
              className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] font-semibold mb-2"
              style={{ color: `${accentColor}95`, fontFamily: bodyFont }}
            >
              <Sparkles size={10} /> Eksklusif
            </span>
            {isEditMode ? (
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <h3 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onTitleChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                  className="text-lg sm:text-xl tracking-[0.1em] uppercase font-medium border-b border-dashed px-1 rounded focus:outline-none"
                  style={customTitleStyle}
                  title="Klik untuk sunting tajuk borang"
                >
                  {title}
                </h3>
                {onTitleStyleClick && (
                  <button
                    type="button"
                    onClick={onTitleStyleClick}
                    className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                    title="Sunting Gaya Tajuk Borang"
                  >
                    <Palette size={10} />
                  </button>
                )}
              </div>
            ) : (
              <h3 className="text-lg sm:text-xl tracking-[0.1em] uppercase font-medium" style={customTitleStyle}>
                {title}
              </h3>
            )}
            
            {isEditMode ? (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <p 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onDescChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                  className="text-xs leading-relaxed font-light max-w-sm mx-auto border-b border-dashed px-1 rounded focus:outline-none"
                  style={customDescStyle}
                  title="Klik untuk sunting huraian borang"
                >
                  {description}
                </p>
                {onDescStyleClick && (
                  <button
                    type="button"
                    onClick={onDescStyleClick}
                    className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none self-start"
                    title="Sunting Gaya Huraian Borang"
                  >
                    <Palette size={10} />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs mt-2 leading-relaxed font-light max-w-sm mx-auto" style={customDescStyle}>
                {description}
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-black/40 border border-red-500/25 rounded-sm text-center font-light" style={{ color: accentColor, ...textStyle }} id="form-error">
              {errorMsg}
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="full-name" className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: `${accentColor}ee` }}>
              {isEditMode ? (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onNameLabelChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                  className="border-b border-dashed hover:bg-white/5 px-0.5 rounded outline-none"
                  style={{ borderBottomColor: `${accentColor}50` }}
                  title="Klik untuk sunting label Nama"
                >
                  {formNameLabel}
                </span>
              ) : (
                <span>{formNameLabel}</span>
              )} <span className="text-white">*</span>
            </label>
            <input
              type="text"
              id="full-name"
              required
              placeholder="AISHA HAMDAN"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm py-2 bg-transparent text-white border-b focus:outline-none focus:border-white transition-colors uppercase tracking-wider placeholder:opacity-20"
              style={inputStyle}
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="email-address" className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: `${accentColor}ee` }}>
              {isEditMode ? (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onEmailLabelChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                  className="border-b border-dashed hover:bg-white/5 px-0.5 rounded outline-none"
                  style={{ borderBottomColor: `${accentColor}50` }}
                  title="Klik untuk sunting label E-mel"
                >
                  {formEmailLabel}
                </span>
              ) : (
                <span>{formEmailLabel}</span>
              )} <span className="text-white">*</span>
            </label>
            <input
              type="email"
              id="email-address"
              required
              placeholder="AISHA@MADRASAH.EDU"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm py-2 bg-transparent text-white border-b focus:outline-none focus:border-white transition-colors uppercase tracking-wider placeholder:opacity-20"
              style={inputStyle}
            />
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="phone-number" className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: `${accentColor}ee` }}>
              {isEditMode ? (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onPhoneLabelChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                  className="border-b border-dashed hover:bg-white/5 px-0.5 rounded outline-none"
                  style={{ borderBottomColor: `${accentColor}50` }}
                  title="Klik untuk sunting label Telefon"
                >
                  {formPhoneLabel}
                </span>
              ) : (
                <span>{formPhoneLabel}</span>
              )} <span className="opacity-50 font-normal">(PILIHAN)</span>
            </label>
            <input
              type="tel"
              id="phone-number"
              placeholder="+6012-3456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-sm py-2 bg-transparent text-white border-b focus:outline-none focus:border-white transition-colors tracking-wider placeholder:opacity-20"
              style={inputStyle}
            />
          </div>

          {/* Reason Field */}
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="reason-why" className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: `${accentColor}ee` }}>
              {isEditMode ? (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onReasonLabelChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                  className="border-b border-dashed hover:bg-white/5 px-0.5 rounded outline-none"
                  style={{ borderBottomColor: `${accentColor}50` }}
                  title="Klik untuk sunting label Hasrat"
                >
                  {formReasonLabel}
                </span>
              ) : (
                <span>{formReasonLabel}</span>
              )} <span className="text-white">*</span>
            </label>
            <textarea
              id="reason-why"
              required
              rows={2}
              placeholder="Mengapa anda ingin membaca naskhah rahsia ini?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm py-2 bg-transparent text-white border-b focus:outline-none focus:border-white transition-colors resize-none tracking-wide placeholder:opacity-20"
              style={inputStyle}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 text-[10px] font-bold uppercase tracking-[0.25em] py-3.5 px-8 transition-all duration-300 rounded-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer shadow-lg hover:brightness-110"
            style={{ 
              backgroundColor: accentColor, 
              color: formBgColor,
              fontFamily: bodyFont
            }}
            id="btn-submit-registration"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Mencatat Nama...
              </>
            ) : (
              <>
                {isEditMode ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onBtnTextChange?.(sanitizeText(e.currentTarget.textContent || ""))}
                    onClick={(e) => e.stopPropagation()}
                    className="border-b border-dashed hover:bg-white/10 px-1 rounded outline-none"
                    style={{ borderBottomColor: `${formBgColor}50` }}
                    title="Klik untuk sunting teks butang"
                  >
                    {formBtnText}
                  </span>
                ) : (
                  <span>{formBtnText}</span>
                )}
                <Send size={11} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
