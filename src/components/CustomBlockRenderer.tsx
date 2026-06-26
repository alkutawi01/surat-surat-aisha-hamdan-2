import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomBlock } from "../types";

interface CustomBlockRendererProps {
  block: CustomBlock;
  websiteStyles: any;
  getResponsiveFontSize: (size?: string) => string;
}

export const CustomBlockRenderer: React.FC<CustomBlockRendererProps> = ({
  block,
  websiteStyles,
  getResponsiveFontSize,
}) => {
  const borderStyle = block.borderThickness && block.borderThickness !== "0px"
    ? `${block.borderThickness} solid ${block.borderColor || websiteStyles.accentColor}`
    : "none";

  const blockAlignClass = block.alignment === "left"
    ? "text-left items-start"
    : block.alignment === "right"
      ? "text-right items-end"
      : "text-center items-center";

  const borderRadiusClass = block.borderRadius === "none"
    ? "rounded-none"
    : block.borderRadius === "sm"
      ? "rounded-sm"
      : block.borderRadius === "lg"
        ? "rounded-lg"
        : block.borderRadius === "full"
          ? "rounded-full"
          : "rounded-md"; // default md

  // Parse slides if slider mode is enabled
  const slides = block.isSlider && block.content
    ? block.content.split(/\n?---\n?/).map((s) => s.trim()).filter(Boolean)
    : [];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const intervalTime = block.sliderInterval || 5000;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [slides.length, block.sliderInterval]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className={`w-full flex flex-col ${blockAlignClass} ${borderRadiusClass} ${block.padding || 'p-6'} transition-all relative overflow-hidden`}
      style={{
        backgroundColor: block.bgColor || websiteStyles.formBgColor,
        color: block.textColor || websiteStyles.textColor,
        border: borderStyle,
      }}
    >
      {/* Block Title */}
      {block.title && (
        <h3
          className="font-semibold mb-3 tracking-wide z-10"
          style={{
            color: block.titleColor || block.textColor || websiteStyles.textColor,
            fontFamily: block.titleFont || websiteStyles.serifFont,
            fontSize: getResponsiveFontSize(block.titleSize || "18px"),
          }}
        >
          {block.title}
        </h3>
      )}

      {/* Block Content (Slider vs Standard Text) */}
      {block.type !== "image" && block.content && (
        block.isSlider && slides.length > 0 ? (
          <div className="w-full flex flex-col items-center justify-center relative min-h-[80px] z-10 select-none">
            {/* Slide view with animation transition */}
            <div className="w-full px-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full"
                >
                  <p
                    className="leading-relaxed whitespace-pre-line opacity-90 font-serif"
                    style={{
                      color: block.textColor || websiteStyles.textColor,
                      fontFamily: block.contentFont || websiteStyles.bodyFont,
                      fontSize: getResponsiveFontSize(block.contentSize || "14px"),
                    }}
                  >
                    {slides[currentSlide]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Controls (Only if > 1 slide) */}
            {slides.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white hover:text-amber-300 transition-all cursor-pointer shadow-sm select-none"
                  title="Ulasan Terdahulu"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white hover:text-amber-300 transition-all cursor-pointer shadow-sm select-none"
                  title="Ulasan Seterusnya"
                >
                  <ChevronRight size={14} />
                </button>

                {/* Slider Dots */}
                <div className="flex gap-1.5 justify-center items-center mt-4">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentSlide
                          ? "bg-amber-400 scale-110"
                          : "bg-white/25 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p
            className="leading-relaxed whitespace-pre-line opacity-90 z-10"
            style={{
              color: block.textColor || websiteStyles.textColor,
              fontFamily: block.contentFont || websiteStyles.bodyFont,
              fontSize: getResponsiveFontSize(block.contentSize || "14px"),
            }}
          >
            {block.content}
          </p>
        )
      )}

      {/* Image Block */}
      {block.type !== "text" && block.imageUrl && (
        <img
          src={block.imageUrl}
          alt={block.title || "Imej tambahan"}
          className={`max-w-full h-auto mt-4 object-contain shadow-lg ${borderRadiusClass} mx-auto z-10`}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};
