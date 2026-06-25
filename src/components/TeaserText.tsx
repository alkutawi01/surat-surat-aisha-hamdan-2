import React, { useState, useEffect, useRef } from "react";
import { Quote } from "../types";
import { ChevronLeft, ChevronRight, Play, Pause, Quote as QuoteIcon } from "lucide-react";
import { sanitizeText } from "../utils/sanitize";

interface TeaserTextProps {
  quotes: Quote[];
  isEditMode: boolean;
  onQuoteChange: (id: number, field: "text" | "context", value: string) => void;
  serifFont?: string;
  quoteSize?: string;
  accentColor?: string;
  bodyFont?: string;
  quoteFont?: string;
  quoteColor?: string;
}

export default function TeaserText({ 
  quotes, 
  isEditMode, 
  onQuoteChange,
  serifFont = "EB Garamond",
  quoteSize = "text-base xs:text-lg sm:text-2xl lg:text-3xl",
  accentColor = "#d7b9b9",
  bodyFont = "Inter",
  quoteFont,
  quoteColor
}: TeaserTextProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fadeSubtitle, setFadeSubtitle] = useState<boolean>(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuote: Quote = quotes[currentIdx] || { id: 0, text: "", context: "" };

  const isCustomQuoteSize = quoteSize && (quoteSize.includes('px') || quoteSize.includes('rem') || quoteSize.includes('em') || quoteSize.includes('pt'));
  const finalQuoteStyle = {
    fontFamily: quoteFont || serifFont,
    color: quoteColor || "#ffffff",
    fontSize: isCustomQuoteSize ? quoteSize : undefined,
    borderBottomColor: isEditMode ? `${accentColor}40` : undefined
  };

  // Helper to clear all active timers
  const clearAllTimers = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  // Set text directly and stop animations if in edit mode
  useEffect(() => {
    if (isEditMode) {
      clearAllTimers();
      setTypedText(currentQuote.text);
      setFadeSubtitle(true);
      setIsPlaying(false);
      setIsTyping(false);
    } else {
      // Restart typing when exiting edit mode
      clearAllTimers();
      setTypedText("");
      setIsTyping(true);
      setIsPlaying(true);
    }

    return () => clearAllTimers();
  }, [isEditMode, currentIdx, currentQuote.text]);

  // Typing effect
  useEffect(() => {
    if (isEditMode) return;
    
    const fullText = "“" + currentQuote.text + "”";
    
    if (isPlaying) {
      if (typedText.length < fullText.length) {
        typingTimeoutRef.current = setTimeout(() => {
          setTypedText(fullText.substring(0, typedText.length + 1));
        }, 40); // typing speed
      } else {
        setIsTyping(false);
        setFadeSubtitle(true);
        
        // Auto-advance to next quote after some seconds if playing
        typingTimeoutRef.current = setTimeout(() => {
          handleNext();
        }, 6000);
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [typedText, isTyping, currentIdx, isPlaying, isEditMode, currentQuote.text]);

  const handleNext = () => {
    clearAllTimers();
    setFadeSubtitle(false);
    setIsTyping(false);
    
    // Smooth transition
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % quotes.length);
      setTypedText("");
      setIsTyping(true);
    }, 400);
  };

  const handlePrev = () => {
    clearAllTimers();
    setFadeSubtitle(false);
    setIsTyping(false);
    
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + quotes.length) % quotes.length);
      setTypedText("");
      setIsTyping(true);
    }, 400);
  };

  const togglePlay = () => {
    if (isEditMode) return;
    clearAllTimers();
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    // If we were completed and stopped, trigger next
    if (nextPlaying && !isTyping) {
      handleNext();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center text-center max-w-3xl px-4 py-8 mx-auto" 
      id="teaser-text-container"
      style={{
        paddingBottom: "0px",
        paddingRight: "16px",
        paddingTop: "26px",
        paddingLeft: "16px"
      }}
    >

      {/* Typing Text Box */}
      <div className="min-h-[110px] xs:min-h-[130px] sm:min-h-[150px] flex items-center justify-center mb-8 w-full">
        {isEditMode ? (
          <p 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onQuoteChange(currentQuote.id, "text", sanitizeText(e.currentTarget.innerText || ""))}
            className={`${isCustomQuoteSize ? "" : quoteSize} leading-relaxed tracking-wide italic font-light drop-shadow-sm select-text border-b border-dashed px-1 rounded-sm focus:outline-none w-full outline-none whitespace-pre-wrap`}
            style={finalQuoteStyle}
            title="Klik untuk menyunting warkah petikan ini"
          >
            {currentQuote.text}
          </p>
        ) : (() => {
          const fullText = "“" + currentQuote.text + "”";
          const typedLength = typedText.length;
          const part1 = typedText;
          const part2 = fullText.substring(typedLength);
          return (
            <p className={`${isCustomQuoteSize ? "" : quoteSize} leading-relaxed tracking-wide italic font-light drop-shadow-sm select-text whitespace-pre-wrap`} style={finalQuoteStyle}>
              <span style={{ fontSize: "31px", textAlign: "center" }}>{part1}</span>
              <span className="cursor-blink inline-block w-[2px] h-[1.1em] mx-0.5 align-middle animate-blink" style={{ backgroundColor: accentColor }} />
              <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">{part2}</span>
            </p>
          );
        })()}
      </div>

      {/* Minimal Controls */}
      <div className="flex items-center justify-center gap-6 mt-12" id="quote-controls" style={{ fontFamily: bodyFont }}>
        <button 
          onClick={handlePrev} 
          className="opacity-40 hover:opacity-100 transition-all p-2 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer"
          style={{ color: accentColor }}
          title="Surat Terdahulu"
          aria-label="Surat Terdahulu"
          id="btn-prev-quote"
        >
          <ChevronLeft size={18} />
        </button>

        <button 
          onClick={togglePlay} 
          disabled={isEditMode}
          className="opacity-40 hover:opacity-100 transition-all p-2.5 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
          style={{ color: accentColor }}
          title={isEditMode ? "Mod Suntingan Aktif" : isPlaying ? "Jeda Aliran Automatik" : "Mainkan Aliran Automatik"}
          aria-label={isPlaying ? "Jeda Aliran Automatik" : "Mainkan Aliran Automatik"}
          id="btn-toggle-play"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button 
          onClick={handleNext} 
          className="opacity-40 hover:opacity-100 transition-all p-2 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer"
          style={{ color: accentColor }}
          title="Surat Seterusnya"
          aria-label="Surat Seterusnya"
          id="btn-next-quote"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
