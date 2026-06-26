import React, { useState, useEffect } from "react";
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

  // Parse slides if slider/carousel mode is enabled
  const isSliderMode = block.isSlider || block.isCarousel;
  const sliderIntervalTime = block.sliderInterval || (block.carouselInterval ? block.carouselInterval * 1000 : 5000);

  const slides = isSliderMode && block.content
    ? block.content.split(/\n?---\n?/).map((s) => s.trim()).filter(Boolean)
    : [];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, sliderIntervalTime);
    return () => clearInterval(interval);
  }, [slides.length, sliderIntervalTime]);

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
          className="font-semibold mb-4 tracking-wide z-10"
          style={{
            color: block.titleColor || block.textColor || websiteStyles.textColor,
            fontFamily: block.titleFont || websiteStyles.serifFont,
            fontSize: getResponsiveFontSize(block.titleSize || "20px"),
          }}
        >
          {block.title}
        </h3>
      )}

      {/* Block Content (Carousel/Slider vs Standard Text) */}
      {block.type !== "image" && block.content && (
        isSliderMode && slides.length > 0 ? (
          <div className="w-full flex flex-col items-center justify-center relative z-10 select-none">
            
            {/* Grid Stack to keep absolute height static to the tallest element */}
            <div className="w-full px-8 grid grid-cols-1 grid-rows-1 relative items-center justify-center min-h-[120px] overflow-hidden">
              {slides.map((slideText, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div
                    key={idx}
                    className="col-start-1 row-start-1 transition-all duration-500 ease-in-out w-full flex flex-col justify-center"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0px)" : "translateY(8px)",
                      pointerEvents: isActive ? "auto" : "none",
                      // Keep it in the layout calculation for height stability, but hide from screens / readers when inactive
                      visibility: "visible", 
                      zIndex: isActive ? 10 : 0,
                    }}
                  >
                    {/* Only render actual content if it's active OR we want it to measure height. 
                        Since we want static height, we render all of them so the grid cell remains at the largest height. */}
                    <p
                      className={`leading-relaxed whitespace-pre-line font-serif transition-all duration-300 ${
                        isActive ? "opacity-95 scale-100" : "opacity-0 scale-[0.98]"
                      }`}
                      style={{
                        color: block.textColor || websiteStyles.textColor,
                        fontFamily: block.contentFont || websiteStyles.bodyFont,
                        fontSize: getResponsiveFontSize(block.contentSize || "14px"),
                        textAlign: block.alignment || "center",
                      }}
                    >
                      {slideText}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Slider Controls (Only if > 1 slide) */}
            {slides.length > 1 && (
              <div className="w-full flex flex-col items-center mt-6">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-amber-300 transition-all cursor-pointer shadow-md select-none z-20"
                  title="Ulasan Terdahulu"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-amber-300 transition-all cursor-pointer shadow-md select-none z-20"
                  title="Ulasan Seterusnya"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Slider Dots */}
                <div className="flex gap-2 justify-center items-center">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentSlide
                          ? "bg-amber-400 scale-125 shadow-sm"
                          : "bg-white/20 hover:bg-white/45"
                      }`}
                      aria-label={`Slaid ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
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
