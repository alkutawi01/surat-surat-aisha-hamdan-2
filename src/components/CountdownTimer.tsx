import React, { useState, useEffect } from "react";
import { sanitizeText } from "../utils/sanitize";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

interface CountdownTimerProps {
  accentColor?: string;
  serifFont?: string;
  bodyFont?: string;
  label?: string;
  isEditMode?: boolean;
  onLabelChange?: (val: string) => void;
  countdownFont?: string;
  countdownSize?: string;
  countdownColor?: string;
  
  // Custom H-J-M-S labels
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  onDaysLabelChange?: (val: string) => void;
  onHoursLabelChange?: (val: string) => void;
  onMinutesLabelChange?: (val: string) => void;
  onSecondsLabelChange?: (val: string) => void;
}

export default function CountdownTimer({ 
  accentColor = "#d7b9b9", 
  serifFont = "EB Garamond",
  bodyFont = "Inter",
  label = "Bakal Terbit",
  isEditMode = false,
  onLabelChange,
  countdownFont,
  countdownSize,
  countdownColor,
  
  daysLabel = "hari",
  hoursLabel = "jam",
  minutesLabel = "minit",
  secondsLabel = "saat",
  onDaysLabelChange,
  onHoursLabelChange,
  onMinutesLabelChange,
  onSecondsLabelChange,
}: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft => {
    // Target is January 1, 2027 (00:00:00 MYT / UTC+8)
    const targetDate = new Date("2027-01-01T00:00:00+08:00").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isCompleted: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isCompleted && !isEditMode) {
    return (
      <div className="flex flex-col items-center text-center select-none" id="countdown-completed" style={{ fontFamily: serifFont }}>
        <span className="text-xs uppercase tracking-[0.2em] mb-1 opacity-80" style={{ color: accentColor }}>Status Naskhah</span>
        <span className="text-lg font-medium text-white tracking-wide animate-pulse">Telah Dilancarkan</span>
      </div>
    );
  }

  const formatNum = (num: number): string => String(num).padStart(2, "0");

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 select-none w-full" id="countdown-timer" style={{ fontFamily: serifFont }}>
      <div className="w-full flex flex-col items-center justify-center text-center">
        {isEditMode ? (
          <p 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onLabelChange?.(sanitizeText(e.currentTarget.textContent || ""))}
            className="text-[10px] uppercase tracking-[0.4em] mb-1 opacity-75 border-b border-dashed inline-block hover:bg-white/5 px-0.5 rounded outline-none text-center"
            style={{ color: accentColor, fontFamily: bodyFont, borderBottomColor: `${accentColor}40` }}
            title="Klik untuk sunting tajuk unduran"
          >
            {label}
          </p>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.4em] mb-1 opacity-75 text-center" style={{ color: accentColor, fontFamily: bodyFont }}>{label}</p>
        )}
        {(() => {
          const isCustomCountdownSize = countdownSize && (countdownSize.includes('px') || countdownSize.includes('rem') || countdownSize.includes('em') || countdownSize.includes('pt'));
          const digitClass = isCustomCountdownSize ? "" : (countdownSize || "text-base sm:text-xl md:text-2xl");
          const finalNumStyle = {
            fontFamily: countdownFont || serifFont,
            fontSize: isCustomCountdownSize ? countdownSize : undefined,
            color: countdownColor || "#ffffff"
          };
          return (
            <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4 text-white w-full flex-nowrap">
              <div className="flex items-baseline shrink-0 whitespace-nowrap">
                <span className={`font-light tracking-tight ${digitClass}`} style={finalNumStyle}>{formatNum(timeLeft.days)}</span>
                {isEditMode ? (
                  <span 
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onDaysLabelChange?.(sanitizeText(e.currentTarget.textContent || "hari"))}
                    className="text-[9px] uppercase tracking-wider ml-0.5 border-b border-dashed outline-none hover:bg-white/5 px-0.5 rounded"
                    style={{ color: `${accentColor}95`, fontFamily: bodyFont, borderBottomColor: `${accentColor}40` }}
                    title="Sunting label Hari"
                  >
                    {daysLabel}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider ml-0.5" style={{ color: `${accentColor}95`, fontFamily: bodyFont }}>{daysLabel}</span>
                )}
              </div>
              <span className="text-xs select-none opacity-30 shrink-0" style={{ color: accentColor }}>•</span>
              <div className="flex items-baseline shrink-0 whitespace-nowrap">
                <span className={`font-light tracking-tight ${digitClass}`} style={finalNumStyle}>{formatNum(timeLeft.hours)}</span>
                {isEditMode ? (
                  <span 
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onHoursLabelChange?.(sanitizeText(e.currentTarget.textContent || "jam"))}
                    className="text-[9px] uppercase tracking-wider ml-0.5 border-b border-dashed outline-none hover:bg-white/5 px-0.5 rounded"
                    style={{ color: `${accentColor}95`, fontFamily: bodyFont, borderBottomColor: `${accentColor}40` }}
                    title="Sunting label Jam"
                  >
                    {hoursLabel}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider ml-0.5" style={{ color: `${accentColor}95`, fontFamily: bodyFont }}>{hoursLabel}</span>
                )}
              </div>
              <span className="text-xs select-none opacity-30 shrink-0" style={{ color: accentColor }}>•</span>
              <div className="flex items-baseline shrink-0 whitespace-nowrap">
                <span className={`font-light tracking-tight ${digitClass}`} style={finalNumStyle}>{formatNum(timeLeft.minutes)}</span>
                {isEditMode ? (
                  <span 
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onMinutesLabelChange?.(sanitizeText(e.currentTarget.textContent || "minit"))}
                    className="text-[9px] uppercase tracking-wider ml-0.5 border-b border-dashed outline-none hover:bg-white/5 px-0.5 rounded"
                    style={{ color: `${accentColor}95`, fontFamily: bodyFont, borderBottomColor: `${accentColor}40` }}
                    title="Sunting label Minit"
                  >
                    {minutesLabel}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider ml-0.5" style={{ color: `${accentColor}95`, fontFamily: bodyFont }}>{minutesLabel}</span>
                )}
              </div>
              <span className="text-xs select-none opacity-30 shrink-0" style={{ color: accentColor }}>•</span>
              <div className="flex items-baseline shrink-0 whitespace-nowrap">
                <span className={`font-light tracking-tight ${digitClass}`} style={{ ...finalNumStyle, color: countdownColor || accentColor }}>{formatNum(timeLeft.seconds)}</span>
                {isEditMode ? (
                  <span 
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onSecondsLabelChange?.(sanitizeText(e.currentTarget.textContent || "saat"))}
                    className="text-[9px] uppercase tracking-wider ml-0.5 border-b border-dashed outline-none hover:bg-white/5 px-0.5 rounded"
                    style={{ color: `${accentColor}95`, fontFamily: bodyFont, borderBottomColor: `${accentColor}40` }}
                    title="Sunting label Saat"
                  >
                    {secondsLabel}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider ml-0.5" style={{ color: `${accentColor}95`, fontFamily: bodyFont }}>{secondsLabel}</span>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
