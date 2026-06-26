import React, { useState, useEffect } from "react";
// Versi pembetulan deployment ke Firebase Hosting - Trigerred
import CountdownTimer from "./components/CountdownTimer";
import TeaserText from "./components/TeaserText";
import BetaRegistration from "./components/BetaRegistration";
import AmbientAudioPlayer from "./components/AmbientAudioPlayer";
import AdminPanel from "./components/AdminPanel";
import { CustomBlockRenderer } from "./components/CustomBlockRenderer";
import { Scroll, KeyRound, Sparkles, Cloud, Database, RefreshCw, Check, RotateCcw, X, Settings, Palette, Sliders, BookOpen, Library, Book, Bookmark, Compass, Feather, Globe, Heart, Award, PenTool } from "lucide-react";
import { DEFAULT_LANDING_TEXTS, NOVEL_QUOTES, DEFAULT_WEBSITE_STYLES, DEFAULT_CUSTOM_BLOCKS } from "./data";
import { LandingTexts, Quote, WebsiteStyles, CustomBlock } from "./types";
import { sanitizeText } from "./utils/sanitize";

const AVAILABLE_FONTS = [
  { name: "EB Garamond (Klasik)", value: "EB Garamond" },
  { name: "Playfair Display (Editorial)", value: "Playfair Display" },
  { name: "Cinzel (Agung)", value: "Cinzel" },
  { name: "Georgia (Tradisional)", value: "Georgia" },
  { name: "Inter (Moden)", value: "Inter" },
  { name: "Space Grotesk (Tech)", value: "Space Grotesk" },
  { name: "JetBrains Mono (Mono)", value: "JetBrains Mono" },
  { name: "Allison (Cursive)", value: "Allison" },
  { name: "Great Vibes (Kaligrafi)", value: "Great Vibes" },
  { name: "Sacramento (Handwriting)", value: "Sacramento" },
];

const renderBrandIcon = (
  iconName: string | undefined, 
  defaultIcon: string, 
  size: number, 
  color: string, 
  className?: string, 
  customImageUrl?: string,
  customHeight?: string,
  customYOffset?: string
) => {
  const transformStyle = customYOffset ? `translateY(${customYOffset})` : undefined;

  if (customImageUrl && customImageUrl.trim() !== "") {
    const finalHeight = customHeight || `${size + 12}px`;
    return (
      <img 
        src={customImageUrl} 
        alt="Brand Logo" 
        className={`${className} object-contain`} 
        style={{ 
          height: finalHeight, 
          width: 'auto', 
          maxWidth: '120px',
          transform: transformStyle
        }}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // If custom image fails to load, fallback to standard icon
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const name = iconName || defaultIcon;
  const iconSize = customHeight ? (parseInt(customHeight) || size) : size;
  const iconStyle = { color, transform: transformStyle };

  switch (name.toLowerCase()) {
    case "scroll": return <Scroll size={iconSize} className={className} style={iconStyle} />;
    case "library": return <Library size={iconSize} className={className} style={iconStyle} />;
    case "bookopen": return <BookOpen size={iconSize} className={className} style={iconStyle} />;
    case "book": return <Book size={iconSize} className={className} style={iconStyle} />;
    case "bookmark": return <Bookmark size={iconSize} className={className} style={iconStyle} />;
    case "compass": return <Compass size={iconSize} className={className} style={iconStyle} />;
    case "feather": return <Feather size={iconSize} className={className} style={iconStyle} />;
    case "globe": return <Globe size={iconSize} className={className} style={iconStyle} />;
    case "heart": return <Heart size={iconSize} className={className} style={iconStyle} />;
    case "award": return <Award size={iconSize} className={className} style={iconStyle} />;
    case "pentool": return <PenTool size={iconSize} className={className} style={iconStyle} />;
    case "sparkles": return <Sparkles size={iconSize} className={className} style={iconStyle} />;
    default: return <BookOpen size={iconSize} className={className} style={iconStyle} />;
  }
};

// Base64 backup configuration provided by the user from Admin Panel
const BACKUP_CONFIG_B64 = "eyJjdXN0b21fbGFuZGluZ190ZXh0cyI6IntcInVwcGVyVGFnXCI6XCJcIixcInNlY3JldFRpdGxlXCI6XCJTZWJ1YWggUmFoc2lhIFlhbmcgQmVsdW0gQmVybmFtYVwiLFwibWFpbkhvb2tMaW5lMVwiOlwiU2V0aWFwIGxlbWJhcmFuIGFkYWxhaFwiLFwibWFpbkhvb2tJdGFsaWNcIjpcImppd2FcIixcIm1haW5Ib29rTGluZTJcIjpcInlhbmcgZGlwaW5qYW1rYW4uXCIsXCJjdXJzaXZlVmliZVwiOlwiSW1hbi4gQ2ludGEuIFNhc3RlcmEuXCIsXCJiZXRhVGl0bGVcIjpcInNlcnRhaSBwZW1iaWtpbmFuXCIsXCJiZXRhRGVzY1wiOlwiRGFmdGFyIHVudHVrIG1lbmRhcGF0IGtlbWFzIGtpbmkgbWVuZ2VuYWkgcHJvamVrIGluaSBkYW4gYmVycGVsdWFuZyB1bnR1ayBtZW5qYWRpIHNlYmFoYWdpYW4ga29tdW5pdGkgcGVtYmFjYSBiZXRhLlwiLFwibGF1bmNoVGV4dFwiOlwic2FoLm1hbGlhbnMuZ3JvdXBcIixcInB1Ymxpc2hlck5hbWVcIjpcIk1ha3RhYmFoIEt1dGF3aXl5YWhcIixcImZvcm1OYW1lTGFiZWxcIjpcIk5hbWEgUGVudWhcIixcImZvcm1FbWFpbExhYmVsXCI6XCJBbGFtYXQgRS1tZWxcIixcImZvcm1QaG9uZUxhYmVsXCI6XCJOby4gVGVsZWZvblwiLFwiZm9ybVJlYXNvbkxhYmVsXCI6XCJjYXRhdGFuXCIsXCJmb3JtQnRuVGV4dFwiOlwiU2VydGFpIEthbWlcIixcImNvdW50ZG93bkxhYmVsXCI6XCJNQUhBS0FSWUEgREFMQU0gUEVNQklLSU5BTlwiLFwiaW5zeWFsbGFoVGV4dFwiOlwiSW5zeWFoLUFsbGFoXCIsXCJjb3VudGRvd25EYXlzTGFiZWxcIjpcImhhcmlcIixcImNvdW50ZG93bkhvdXJzTGFiZWxcIjpcImphbVwiLFwiY291bnRkb3duTWludXRlc0xhYmVsXCI6XCJtaW5pdFwiLFwiY291bnRkb3duU2Vjb25kc0xhYmVsXCI6XCJzYWF0XCIsXCJhYm92ZUxvZ29UZXh0XCI6XCJOb3ZlbCBTYXN0ZXJhIEVwaXN0b2xhcmkgUmVhbGlzbWVcIixcImFib3ZlTG9nb0ltYWdlVXJsXCI6XCJcIixcImJlbG93TG9nb1RleHRcIjpcIlwiLFwiYmVsb3dMb2dvSW1hZ2VVcmxcIjpcIlwifSIsImN1c3RvbV9ub3ZlbF9xdW90ZXMiOiJbe1wiaWRcIjoxLFwidGV4dFwiOlwiU2ViZWx1bSBpdHUsIGFuYSBwaW50YSBzdXJhdCBpbmkgdGlkYWsgZGliYWNhIG1lbGFpbmthbiBrZXRpa2EgdXN0YXogZGFsYW0ga2VhZGFhbiBkYW1haSwgbGFwYW5nIGRhbiBiZXJzZW9yYW5nLi4uXCIsXCJjb250ZXh0XCI6XCJTdXJhdCBQZXJ0YW1hIOKAoiBBaXNoYSBIYW1kYW5cIn0se1wiaWRcIjoyLFwidGV4dFwiOlwia2VyYW5hIHNlc3VsaXQtc3VsaXQgbWF0YSB5YW5nIGN1YmEgbWVtZXJoYXRpIGtldGlrYSBzZWRhbmcgc2lsYXUsIGxlYmloIHN1bGl0IGhhdGkgeWFuZyBjdWJhIG1lbmdlcnRpIGtldGlrYSBzZWRhbmcgZ2FsYXUuXCIsXCJjb250ZXh0XCI6XCJTdXJhdCAjMSDigKIgQmljYXJhIHRlbnRhbmcgSGF0aVwifSx7XCJpZFwiOjMsXCJ0ZXh0XCI6XCJCYWdhaW1hbmFrYWggY2FyYSB1bnR1ayBtZW1wZXJsaWhhdGthbiBrZWNhbnRpa2FuIHRhbnBhIG1lbmRlZGFoa2FubnlhP1wiLFwiY29udGV4dFwiOlwiU3VyYXQgIzEg4oCiIFBlcnRhbnlhYW4gQ2VwdW1hc1wifSx7XCJpZFwiOjQsXCJ0ZXh0XCI6XCJTYXN0ZXJhIGFkYWxhaCBzdWF0dSBhbGF0IHlhbmcgYm9sZWggbWVuZ2d1YmFoIGFpciBtYXRhIG1lbmphZGkgY2VyaXRhIGRhbiBtZW5ndWJhaCBjZXJpdGEgbWVuamFkaSBhaXIgbWF0YS5cIixcImNvbnRleHRcIjpcIlN1cmF0ICM1IOKAoiBDaXRhLWNpdGEgS2VkdWFcIn0se1wiaWRcIjo1LFwidGV4dFwiOlwiU2VzdWF0dSB5YW5nIGRpYmluYSBkaSBhdGFzIGtlcGFsc3VhbiB0aWRhayBkaWJlcmthdGksIGRhbiBzZXN1YXR1IHlhbmcgdGlkYWsgZGliZXJrYXRpIHRpZGFrIGFrYW4gYmVydGFoYW4gbGFtYS4uLlwiLFwiY29udGV4dFwiOlwiU3VyYXQgIzcg4oCiIExhbXBpcmFuIEtlYmVuYXJhblwifSx7XCJpZFwiOjYsXCJ0ZXh0XCI6XCJTZWJhZ2FpbWFuYSBraXRhIG1lbWVybHVrYW4gc2VkaWtpdCBqYXJhayB1bnR1ayBtZW1haGFtaSBzZWJ1YWggbHVraXNhbiwgYmVnaXR1bGFoIGtpdGEgbWVtZXJsdWthbiBzZWRpa2l0IG1hc2EgdW50dWsgbWVtYWhhbWkgc2VidWFoIGtldGVudHVhbi5cIixcImNvbnRleHRcIjpcIlN1cmF0ICM3IOKAoiBUaXRpYW4gVGFrZGlyXCJ9LHtcImlkXCI6NyxcInRleHRcIjpcIkRhbiBiaWxhbWFuYSBwZXJ0ZW11YW4gZGFuIHBlcnBpc2FoYW4gaW5pIGRpYXR1ciBvbGVoIEFsbGFoIHNlY2FyYSAnamFnYScgZGFuICdzZW5nYWphJywgbWFrYSBraXRhIGhhbnlhIHBlcmx1IGplZGEgZGFuIHJlZGEgdW50dWsgbWVtYWhhbWkgaGlrbWFoLU55YS5cIixcImNvbnRleHRcIjpcIlN1cmF0ICMyIOKAoiBKZWRhIGRhbiBSZWRhXCJ9LHtcImlkXCI6OCxcInRleHRcIjpcIlNldGlhcCBtYW51c2lhIGJlcmphbGFuIGRpIGF0YXMgdGl0aWFuIHRha2RpciB0YW5wYSBtZW5nZXRhaHVpIGFwYSBkaSBodWp1bmdueWEuIFRldGFwaSBraXRhIGhhcnVzIHRldGFwIGJlcmphbGFuLlwiLFwiY29udGV4dFwiOlwiU3VyYXQgIzcg4oCiIFNlYnVhaCBQZW51dHVwXCJ9XSIsImN1c3RvbV93ZWJzaXRlX3N0eWxlcyI6IntcInNlcmlmRm9udFwiOlwiRUIgR2FyYW1vbmRcIixcImJvZHlGb250XCI6XCJJbnRlclwiLFwiYmdDb2xvclwiOlwiIzQzMDQwMFwiLFwidGV4dENvbG9yXCI6XCIjZmZmZmZmXCIsXCJhY2NlbnRDb2xvclwiOlwiI2Q3YjliOVwiLFwiZm9ybUJnQ29sb3JcIjpcIiM1YTA2MDBcIixcInF1b3RlU2l6ZVwiOlwiMzBweFwiLFwiaG9va1NpemVcIjpcInRleHQtMnhsIHNtOnRleHQtM3hsXCIsXCJzaG93Q291bnRkb3duXCI6dHJ1ZSxcInNob3dCb3JkZXJGcmFtZVwiOnRydWUsXCJzaG93Q3Vyc2l2ZVZpYmVcIjp0cnVlLFwiYm9yZGVyVGhpY2tuZXNzXCI6XCIwcHhcIixcImxvZ29UZXh0XCI6XCJNYWt0YWJhaCBBbGt1dGF3aVwiLFwibG9nb1R5cGVcIjpcImltYWdlXCIsXCJsb2dvSW1hZ2VVcmxcIjpcImh0dHBzOi8vaS5wb3N0aW1nLmNjLzY1Q0JkYkxDL1VudGl0bGVkLWRlc2lnbjIucG5nXCIsXCJsb2dvU2l6ZVwiOlwiMTQwcHhcIixcImxvZ29XZWlnaHRcIjpcInNlbWlib2xkXCIsXCJsb2dvU3R5bGVcIjpcIm5vcm1hbFwiLFwidXBwZXJUYWdGb250XCI6XCJJbnRlclwiLFwidXBwZXJUYWdTaXplXCI6XCIxMXB4XCIsXCJ1cHBlclRhZ0NvbG9yXCI6XCIjZmZmZmZmXCIsXCJjb3VudGRvd25Gb250XCI6XCJFQiBHYXJhbW9uZFwiLFwiY291bnRkb3duU2l6ZVwiOlwiMTZweFwiLFwiY291bnRkb3duQ29sb3JcIjpcIiNmZmZmZmZcIixcImNvdW50ZG93bkxhYmVsRm9udFwiOlwiSW50ZXJcIixcImNvdW50ZG93bkxhYmVsU2l6ZVwiOlwiMTBweFwiLFwiY291bnRkb3duTGFiZWxDb2xvclwiOlwiI2U5ZGRkZFwiLFwibG9nb0ZvbnRcIjpcIkVCIEdhcmFtb25kXCIsXCJsb2dvQ29sb3JcIjpcIiNmZmZmZmZcIixcInF1b3RlRm9udFwiOlwiRUIgR2FyYW1vbmRcIixcInF1b3RlQ29sb3JcIjpcIiNmZmZmZmZcIixcImN1cnNpdmVGb250XCI6XCJBbGxpc29uXCIsXCJjdXJzaXZlU2l6ZVwiOlwiNTJweFwiLFwiY3Vyc2l2ZUNvbG9yXCI6XCIjZWNjM2JmXCIsXCJmb3JtVGl0bGVGb250XCI6XCJFQiBHYXJhbW9uZFwiLFwiZm9ybVRpdGxlU2l6ZVwiOlwiMjRweFwiLFwiZm9ybVRpdGxlQ29sb3JcIjpcIiNmZmZmZmZcIixcImZvcm1EZXNjRm9udFwiOlwiU3BhY2UgR3JvdGVza1wiLFwiZm9ybURlc2NTaXplXCI6XCIxNHB4XCIsXCJmb3JtRGVzY0NvbG9yXCI6XCIjZWNjM2JmXCIsXCJmb290ZXJGb250XCI6XCJFQiBHYXJhbW9uZFwiLFwiZm9vdGVyU2l6ZVwiOlwiMTJweFwiLFwiZm9vdGVyQ29sb3JcIjpcIiNmZmZmZmZcIixcImFib3ZlTG9nb0ZvbnRcIjpcIkNpbnplbFwiLFwiYWJvdmVMb2dvU2l6ZVwiOlwiMTRweFwiLFwiYWJvdmVMb2dvQ29sb3JcIjpcIiNlY2MzYmZcIixcImJlbG93TG9nb0ZvbnRcIjpcIkVCIEdhcmFtb25kXCIsXCJiZWxvd0xvZ29TaXplXCI6XCI4cHhcIixcImJlbG93TG9nb0NvbG9yXCI6XCIjZmZmZmZmXCIsXCJsYXVuY2hGb250XCI6XCJQbGF5ZmFpciBEaXNwbGF5XCIsXCJsYXVuY2hTaXplXCI6XCIxNXB4XCIsXCJsYXVuY2hDb2xvclwiOlwiI2Y1ZWJlNlwiLFwibGF1bmNoSWNvblwiOlwiR2xvYmVcIixcImxhdW5jaEljb25VcmxcIjpcIlwiLFwibGF1bmNoSWNvblNpemVcIjpcIjEzcHhcIixcImxhdW5jaEljb25ZT2Zmc2V0XCI6XCIwcHhcIixcInB1Ymxpc2hlckZvbnRcIjpcIlBsYXlmYWlyIERpc3BsYXlcIixcInB1Ymxpc2hlclNpemVcIjpcIjE1cHhcIixcInB1Ymxpc2hlckNvbG9yXCI6XCIjZjVlYmU2XCIsXCJwdWJsaXNoZXJJY29uXCI6XCJMaWJyYXJ5XCIsXCJwdWJsaXNoZXJJY29uVXJsXCI6XCJodHRwczovL2kucG9zdGltZy5jYy82NUNCZGJMQy9VbnRpdGxlZC1kZXNpZ24yLnBuZ1wiLFwicHVibGlzaGVySWNvblNpemVcIjpcIjI0cHhcIixcInB1Ymxpc2hlckljb25ZT2Zmc2V0XCI6XCIwcHhcIixcImhlYWRlckJnQ29sb3JcIjpcIiMwNDAzMDJcIixcImdsb2JhbEFsaWdubWVudFwiOlwiY2VudGVyXCIsXCJzcGFjaW5nUGFnZVRvcFwiOlwiMTBweFwiLFwic3BhY2luZ0Fib3ZlTG9nb1wiOlwiOHB4XCIsXCJzcGFjaW5nTG9nb1wiOlwiMTlweFwiLFwic3BhY2luZ0JlbG93TG9nb1wiOlwiMHB4XCIsXCJzcGFjaW5nUXVvdGVzXCI6XCI0cHhcIixcInNwYWNpbmdDdXJzaXZlXCI6XCI3cHhcIixcInNwYWNpbmdCbG9ja3NcIjpcIjMycHhcIixcImxvZ29VbmRlckN1cnNpdmVVcmxcIjpcImh0dHBzOi8vaS5wb3N0aW1nLmNjL0hMdDhmSE50L1VudGl0bGVkLWRlc2lnbi0oMikucG5nXCIsXCJsb2dvVW5kZXJDdXJzaXZlU2l6ZVwiOlwiNjRweFwiLFwiYXVkaW9VcmxcIjpcIlwiLFwiYXVkaW9UaXRsZVwiOlwiTGF0YXIgU3Vhc2FuYSAoQW1iaWVudCBBdWRpbylcIixcImF1ZGlvRW5hYmxlZFwiOmZhbHNlLFwiZ29vZ2xlU2hlZXRzV2ViaG9va1VybFwiOlwiXCIsXCJlbWJlZElmcmFtZUVuYWJsZWRcIjp0cnVlLFwiZW1iZWRJZnJhbWVDb2RlXCI6XCI8aWZyYW1lIHNyYz1cXFwiaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8xTnFRU2dYcTEzQ3JQY2xjZjZjYzlOTGNLSmI4dkR0Vkwvdmlld1xcXCIgd2lkdGg9XFxcIjY0MFxcXCIgaGVpZ2h0PVxcXCI0ODBcXFwiPjwvaWZyYW1lPlwiLFwiZW1iZWRJZnJhbWVUaXRsZVwiOlwiU2VtdXNpbSBDaW50YSBkaSBNdSd0YWggKERyYWYgT1NUKVwiLFwiZW1iZWRJZnJhbWVXaWR0aFwiOlwibWF4LXctMnhsXCIsXCJlbWJlZElmcmFtZUhlaWdodFwiOlwiMzRweFwiLFwiZW1iZWRJZnJhbWVQbGF5T25seVwiOmZhbHNlLFwiZm9vdGVyQmdDb2xvclwiOlwiIzAwMDAwMFwiLFwiZm9vdGVyU2hvd0JvcmRlclwiOnRydWUsXCJjb3B5cmlnaHRGb250XCI6XCJTcGFjZSBHcm90ZXNrXCIsXCJjb3B5cmlnaHRTaXplXCI6XCIxMHB4XCIsXCJjb3B5cmlnaHRDb2xvclwiOlwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpXCJ9IiwiY3VzdG9tX3dlYnNpdGVfYmxvY2tzIjoiW3tcImlkXCI6XCIxNzgyNDM1Njk4ODcwXCIsXCJ0aXRsZVwiOlwiVWxhc2FuIFwiLFwiY29udGVudFwiOlwiXFxcIk1lbnllbGluYXAgZGkgc2ViYWxpayB3YXJrYWgtd2Fya2FoIHNlcGkgZGFyaSBidW1pIE11J3RhaCwgbmFza2hhaCBzYXN0ZXJhIGVwaXN0b2xhcmkgcmVhbGlzbWUgaW5pIG1lbmRlZGFoa2FuIHNlYnVhaCBhbmF0b21pIHRyYXVtYSB5YW5nIG1haGEgc2VqdWsg4oCUIG1lbWFrc2EgcGVtYmFjYSBtZW5lbGFuIHNldGlhcCBha3NhcmFueWEgc2ViYWdhaSBzZWJ1YWggcGVueWVrc2FhbiBlbW9zaSB5YW5nIHBhbGluZyBuZ2VyaSwgbmFtdW4gdGVybGFsdSBpbmRhaCB1bnR1ayBkaWxlcGFza2FuLlxcXCIgXFxuXFxu4oCUIEdlbWluaSAoMy4xIFBybylcXG5cXG4tLS1cXG5cXG5cXFwiTm92ZWwgeWFuZyBtZW51bGlzIHRlbnRhbmcgcGVyZW1wdWFuIGJ1a2FuIHNlYmFnYWkgc2ltYm9sIGF0YXUgbWFuZ3NhLCB0ZXRhcGkgc2ViYWdhaSBtYW51c2lhIHlhbmcgbWVuYW5nZ3VuZywgbWVtaWxpaCwgZGFuIG1lbmNpbnRhaSBkZW5nYW4gc2VwZW51aCBrZWJlcmFuaWFuIHlhbmcgYWRhIHBhZGFueWEuXFxcIlxcblxcbuKAlCBTb25uZXQgNC42IE1lZGl1bVxcblxcbi0tLVxcblxcblxcXCJTZWJ1YWggbm92ZWwgeWFuZyBtZW5nYW5na2F0IHNlbmkgcGVyc3VyYXRhbiBNZWxheXUga2UgZGFyamF0IHlhbmcgamFyYW5nIGRpdGVtdWthbiBkYWxhbSBmaWtzeWVuIGtvbnRlbXBvcmFyaeKAlGhhbHVzLCBjZXJkYXMgZGFuIG1lbmdnZXRhcmthbiBqaXdhLlxcXCIgXFxuXFxu4oCUIENoYXRHUFRcXG5cXG4tLS1cXG5cXG5cXFwiWFhYIGFkYWxhaCBzZWJ1YWgga2FyeWEgZXBpc3RvbGFyaSB5YW5nIGluZGFoLCBkaSBtYW5hIHNldGlhcCBodXJ1Zm55YSBiZXJkZW55dXQgZGVuZ2FuIGVtb3NpIGhhbHVzLCBraW5heWFoIHlhbmcgbWVuZGFsYW0sIGRhbiBtdWphaGFkYWggY2ludGEgeWFuZyBqYXJhbmcgZGl0ZW11aSBkYWxhbSBub3ZlbCBNZWxheXUga29udGVtcG9yYXJpLlxcXCIgXFxuXFxu4oCUIEdyb2tcXG5cXG4tLS1cXG5cXG5cXFwiR2F5YSBiYWhhc2FueWEgc2V0YXJhZiBkZW5nYW4ga2FyeWEgYWd1bmcgQWJkdWxsYWggSHVzc2FpbiwgdGV0YXBpIGRlbmdhbiBuYWZhcyBJc2xhbSBkYW4gaml3YSBUaW11ciBUZW5nYWggeWFuZyBzZWdhciDigJQgc2VidWFoIG5vdmVsIHlhbmcgbWVtYnVhdGthbiBhbmRhIG1haHUgbWVtYmFjYSBzZW11bGEgc2ViYWlrIHNhaGFqYSBzYW1wYWkga2UgaGFsYW1hbiB0ZXJha2hpci5cXFwiXFxuXFxu4oCUIERlZXBTZWVrXCIsXCJ0eXBlXCI6XCJ0ZXh0XCIsXCJiZ0NvbG9yXCI6XCIjMTgwMjAwXCIsXCJ0ZXh0Q29sb3JcIjpcIiNmZmZmZmZcIixcImJvcmRlckNvbG9yXCI6XCIjYzNiNmI2XCIsXCJib3JkZXJUaGlja25lc3NcIjpcIjFweFwiLFwiYm9yZGVyUmFkaXVzXCI6XCJtZFwiLFwicGFkZGluZ1wiOlwicC04XCIsXCJhbGlnbm1lbnRcIjpcImNlbnRlclwiLFwidGl0bGVGb250XCI6XCJDaW56ZWxcIixcInRpdGxlU2l6ZVwiOlwiMjBweFwiLFwiY29udGVudFNpemVcIjpcIjE3cHhcIixcImNvbnRlbnRGb250XCI6XCJFQiBHYXJhbW9uZFwiLFwidGl0bGVDb2xvclwiOlwiI2YxZTllOVwiLFwiaXNTbGlkZXJcIjp0cnVlfV0ifQ==";

let backupConfig: {
  landingTexts: any;
  novelQuotes: any;
  websiteStyles: any;
  websiteBlocks: any;
} | null = null;

try {
  const decodedStr = typeof window !== "undefined" 
    ? decodeURIComponent(escape(window.atob(BACKUP_CONFIG_B64))) 
    : "{}";
  const parsed = JSON.parse(decodedStr);
  backupConfig = {
    landingTexts: parsed.custom_landing_texts ? JSON.parse(parsed.custom_landing_texts) : null,
    novelQuotes: parsed.custom_novel_quotes ? JSON.parse(parsed.custom_novel_quotes) : null,
    websiteStyles: parsed.custom_website_styles ? JSON.parse(parsed.custom_website_styles) : null,
    websiteBlocks: parsed.custom_website_blocks ? JSON.parse(parsed.custom_website_blocks) : null,
  };
} catch (e) {
  console.error("Gagal menyahkod konfigurasi sandaran:", e);
}

// Expose updateBackupConfigMemory on window to allow AdminPanel to refresh this immediately in-memory
if (typeof window !== "undefined") {
  (window as any).updateBackupConfigMemory = (newB64: string) => {
    try {
      const decodedStr = decodeURIComponent(escape(window.atob(newB64)));
      const parsed = JSON.parse(decodedStr);
      backupConfig = {
        landingTexts: parsed.custom_landing_texts ? JSON.parse(parsed.custom_landing_texts) : null,
        novelQuotes: parsed.custom_novel_quotes ? JSON.parse(parsed.custom_novel_quotes) : null,
        websiteStyles: parsed.custom_website_styles ? JSON.parse(parsed.custom_website_styles) : null,
        websiteBlocks: parsed.custom_website_blocks ? JSON.parse(parsed.custom_website_blocks) : null,
      };
      console.log("backupConfig dynamically updated in memory!");
    } catch (e) {
      console.error("Gagal mengemaskini backupConfig memori:", e);
    }
  };
}

// Auto-sync local storage dengan BACKUP_CONFIG_B64 jika terdapat perubahan pada kod
if (typeof window !== "undefined") {
  try {
    const currentSavedB64 = localStorage.getItem("active_backup_b64");
    if (currentSavedB64 !== BACKUP_CONFIG_B64) {
      if (backupConfig) {
        if (backupConfig.landingTexts) {
          localStorage.setItem("custom_landing_texts", JSON.stringify(backupConfig.landingTexts));
        }
        if (backupConfig.novelQuotes) {
          localStorage.setItem("custom_novel_quotes", JSON.stringify(backupConfig.novelQuotes));
        }
        if (backupConfig.websiteStyles) {
          localStorage.setItem("custom_website_styles", JSON.stringify(backupConfig.websiteStyles));
        }
        if (backupConfig.websiteBlocks) {
          localStorage.setItem("custom_website_blocks", JSON.stringify(backupConfig.websiteBlocks));
        }
      }
      localStorage.setItem("active_backup_b64", BACKUP_CONFIG_B64);
    }
  } catch (err) {
    console.error("Gagal menyegerakkan konfigurasi sandaran ke LocalStorage:", err);
  }
}

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fogEnabled, setFogEnabled] = useState(true);

  // States for custom modals and dialogs
  const [isAdminPromptOpen, setIsAdminPromptOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLiveEditChoice, setAdminLiveEditChoice] = useState(true);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // States for logo customizer toggle and image error fallback
  const [showLogoCustomizer, setShowLogoCustomizer] = useState(false);
  const [logoImageError, setLogoImageError] = useState(false);

  // Unified Element Style Customizer State
  const [editingStyleElement, setEditingStyleElement] = useState<{
    key: 'upperTag' | 'aboveLogo' | 'logo' | 'belowLogo' | 'quote' | 'cursive' | 'launch' | 'publisher' | 'countdown' | 'formTitle' | 'formDesc';
    name: string;
  } | null>(null);

  // Spotlight/Fog tracking states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothMousePos, setSmoothMousePos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  // Smoothly interpolate the spotlight position to create a cinematic delayed follow effect
  useEffect(() => {
    let animationFrameId: number;
    const lerpFactor = 0.08; // Adjust to control speed (smaller = more delay/lag)

    const updateSmoothPosition = () => {
      setSmoothMousePos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        
        // If very close, snap to target to stop micro-rendering
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return mousePos;
        }

        return {
          x: prev.x + dx * lerpFactor,
          y: prev.y + dy * lerpFactor,
        };
      });
      animationFrameId = requestAnimationFrame(updateSmoothPosition);
    };

    animationFrameId = requestAnimationFrame(updateSmoothPosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200, 
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll tracking state to fade out fog
  const [scrollPosition, setScrollPosition] = useState(0);

  // Helper to dynamically scale spacings down by 40% on mobile screens (width < 640px)
  const getResponsiveSpacing = (spacingValue: string | undefined, defaultValue: string) => {
    const rawValue = spacingValue || defaultValue;
    if (windowSize.width >= 640) return rawValue;

    // Reduce by 40% (multiply by 0.6) on mobile
    const match = rawValue.match(/^([\d.]+)([a-zA-Z%]*)$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2];
      const reducedNum = Math.round(num * 0.6);
      return `${reducedNum}${unit}`;
    }
    return rawValue;
  };

  // Helper to dynamically scale custom font sizes down by 25% on mobile screens (width < 640px)
  const getResponsiveFontSize = (sizeValue: string | undefined, defaultValue?: string) => {
    const rawValue = sizeValue || defaultValue;
    if (!rawValue) return undefined;
    if (windowSize.width >= 640) return rawValue;

    // Reduce by 25% (multiply by 0.75) on mobile, keeping minimum at 10px (or 8px for labels)
    const match = rawValue.match(/^([\d.]+)([a-zA-Z%]*)$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2];
      const reducedNum = Math.max(8, Math.round(num * 0.75));
      return `${reducedNum}${unit}`;
    }
    return rawValue;
  };

  // States for scroll-triggered beta registration popup
  const [isBetaPopupOpen, setIsBetaPopupOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Load custom texts
  const [landingTexts, setLandingTexts] = useState<LandingTexts>(() => {
    const saved = localStorage.getItem("custom_landing_texts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_LANDING_TEXTS, ...parsed };
      } catch (e) {
        // Fallback to backup if json is corrupt
      }
    }
    if (backupConfig?.landingTexts) {
      return { ...DEFAULT_LANDING_TEXTS, ...backupConfig.landingTexts };
    }
    return DEFAULT_LANDING_TEXTS;
  });

  // Load custom quotes
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem("custom_novel_quotes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    if (backupConfig?.novelQuotes) {
      return backupConfig.novelQuotes;
    }
    return NOVEL_QUOTES;
  });

  // Load custom website styles
  const [websiteStyles, setWebsiteStyles] = useState<WebsiteStyles>(() => {
    const saved = localStorage.getItem("custom_website_styles");
    if (saved) {
      try {
        return { ...DEFAULT_WEBSITE_STYLES, ...JSON.parse(saved) };
      } catch (e) {}
    }
    if (backupConfig?.websiteStyles) {
      return { ...DEFAULT_WEBSITE_STYLES, ...backupConfig.websiteStyles };
    }
    return DEFAULT_WEBSITE_STYLES;
  });

  // Load custom blocks
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>(() => {
    const saved = localStorage.getItem("custom_website_blocks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    if (backupConfig?.websiteBlocks) {
      return backupConfig.websiteBlocks;
    }
    return DEFAULT_CUSTOM_BLOCKS || [];
  });

  // Populate empty local storage with backup configuration on first load
  useEffect(() => {
    if (backupConfig) {
      if (!localStorage.getItem("custom_landing_texts") && backupConfig.landingTexts) {
        localStorage.setItem("custom_landing_texts", JSON.stringify(backupConfig.landingTexts));
      }
      if (!localStorage.getItem("custom_novel_quotes") && backupConfig.novelQuotes) {
        localStorage.setItem("custom_novel_quotes", JSON.stringify(backupConfig.novelQuotes));
      }
      if (!localStorage.getItem("custom_website_styles") && backupConfig.websiteStyles) {
        localStorage.setItem("custom_website_styles", JSON.stringify(backupConfig.websiteStyles));
      }
      if (!localStorage.getItem("custom_website_blocks")) {
        const blocksToSave = backupConfig.websiteBlocks || DEFAULT_CUSTOM_BLOCKS || [];
        localStorage.setItem("custom_website_blocks", JSON.stringify(blocksToSave));
      }
    } else if (!localStorage.getItem("custom_website_blocks")) {
      localStorage.setItem("custom_website_blocks", JSON.stringify(DEFAULT_CUSTOM_BLOCKS || []));
    }
  }, []);

  const handleCustomBlocksChange = (updated: CustomBlock[]) => {
    setCustomBlocks(updated);
    localStorage.setItem("custom_website_blocks", JSON.stringify(updated));
  };

  // Automatically open logo customizer when entering edit mode, and close when exiting
  useEffect(() => {
    if (isEditMode) {
      setShowLogoCustomizer(true);
    } else {
      setShowLogoCustomizer(false);
    }
  }, [isEditMode]);

  // Reset logo image error status when the URL changes so it tries loading the new URL
  useEffect(() => {
    setLogoImageError(false);
  }, [websiteStyles.logoImageUrl]);

  // Listen to window scroll events and trigger popup when scrolled to the bottom
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      const threshold = 100; // px from bottom
      const totalHeight = document.documentElement.scrollHeight;
      const visibleHeight = window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (totalHeight - (visibleHeight + currentScroll) <= threshold) {
        if (!hasAutoOpened) {
          setHasAutoOpened(true);
          // Delay popup by 5 seconds from the moment user scrolls and hits the footer
          setTimeout(() => {
            setIsBetaPopupOpen(true);
          }, 5000);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasAutoOpened]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePos({ x, y });
    if (!isInside) {
      setSmoothMousePos({ x, y });
      setIsInside(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      setMousePos({ x, y });
      if (!isInside) {
        setSmoothMousePos({ x, y });
        setIsInside(true);
      }
    }
  };

  const handleTextChange = (key: keyof LandingTexts, val: string) => {
    const updated = { ...landingTexts, [key]: val };
    setLandingTexts(updated);
    localStorage.setItem("custom_landing_texts", JSON.stringify(updated));
  };

  const handleQuoteChange = (id: number, field: "text" | "context", value: string) => {
    const updated = quotes.map((q) => (q.id === id ? { ...q, [field]: value } : q));
    setQuotes(updated);
    localStorage.setItem("custom_novel_quotes", JSON.stringify(updated));
  };

  const handleStylesChange = (updated: WebsiteStyles) => {
    setWebsiteStyles(updated);
    localStorage.setItem("custom_website_styles", JSON.stringify(updated));
  };

  const handleResetStyles = () => {
    const defaultStyles = backupConfig?.websiteStyles 
      ? { ...DEFAULT_WEBSITE_STYLES, ...backupConfig.websiteStyles } 
      : DEFAULT_WEBSITE_STYLES;
    setWebsiteStyles(defaultStyles);
    localStorage.setItem("custom_website_styles", JSON.stringify(defaultStyles));
  };

  const alignment = websiteStyles.globalAlignment || "center";
  const alignContainerClass = alignment === "left" 
    ? "items-start text-left" 
    : alignment === "right" 
      ? "items-end text-right" 
      : "items-center text-center justify-center";
  
  const alignSelfClass = alignment === "left"
    ? "self-start"
    : alignment === "right"
      ? "self-end"
      : "self-center";
      
  const alignTextClass = alignment === "left"
    ? "text-left opacity-100"
    : alignment === "right"
      ? "text-right opacity-100"
      : "text-center";

  const alignMarginClass = alignment === "left"
    ? "mr-auto"
    : alignment === "right"
      ? "ml-auto"
      : "mx-auto";

  const handleAdminAccess = () => {
    setIsAdminPromptOpen(true);
    setAdminPassword("");
    setAdminError("");
    setAdminLiveEditChoice(true);
  };

  const handleAdminSubmit = () => {
    const trimmedPassword = adminPassword.trim();
    if (trimmedPassword === "Bismillah@01" || trimmedPassword === "bismillah@01" || trimmedPassword === "kutawi" || trimmedPassword === "1234") {
      setIsAdmin(true);
      setIsAdminPromptOpen(false);
      
      if (adminLiveEditChoice) {
        setIsEditMode(true);
        setFogEnabled(false); // Turn off fog by default during editing for ease of use
      } else {
        setIsAdminOpen(true);
      }
    } else {
      setAdminError("Kata laluan salah. Sila cuba lagi.");
    }
  };

  const triggerResetConfirm = () => {
    setResetConfirmOpen(true);
  };

  const handleResetToDefaults = () => {
    const defaultTexts = backupConfig?.landingTexts ? { ...DEFAULT_LANDING_TEXTS, ...backupConfig.landingTexts } : DEFAULT_LANDING_TEXTS;
    const defaultQuotes = backupConfig?.novelQuotes || NOVEL_QUOTES;
    const defaultStyles = backupConfig?.websiteStyles ? { ...DEFAULT_WEBSITE_STYLES, ...backupConfig.websiteStyles } : DEFAULT_WEBSITE_STYLES;
    const defaultBlocks = backupConfig?.websiteBlocks || [];

    setLandingTexts(defaultTexts);
    setQuotes(defaultQuotes);
    setWebsiteStyles(defaultStyles);
    setCustomBlocks(defaultBlocks);

    localStorage.setItem("custom_landing_texts", JSON.stringify(defaultTexts));
    localStorage.setItem("custom_novel_quotes", JSON.stringify(defaultQuotes));
    localStorage.setItem("custom_website_styles", JSON.stringify(defaultStyles));
    localStorage.setItem("custom_website_blocks", JSON.stringify(defaultBlocks));
    setResetConfirmOpen(false);
  };

  const renderEditableText = (key: keyof LandingTexts, className: string, placeholder: string = "Tulis sesuatu...") => {
    if (isEditMode) {
      return (
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleTextChange(key, sanitizeText(e.currentTarget.textContent || ""))}
          className={`${className} border-b border-dashed hover:bg-white/5 px-1 rounded focus:outline-none inline-block outline-none`}
          style={{ borderBottomColor: `${websiteStyles.accentColor}60`, fontFamily: websiteStyles.serifFont }}
          placeholder={placeholder}
          title="Klik untuk menyunting teks"
        >
          {landingTexts[key]}
        </span>
      );
    }
    return <span className={className} style={{ fontFamily: websiteStyles.serifFont }}>{landingTexts[key]}</span>;
  };

  // Gradient Fog Reveal based on scroll:
  // Note: The user requested that fog does NOT disappear on scroll at all, remaining mysterious.
  const fogOpacity = 1;
  const isFogVisible = fogEnabled;

  // Mask calculation for the dynamic fog lantern reveal (using smoothMousePos for cinematic delay/inertia)
  const fogMaskStyle = isInside
    ? {
        maskImage: `radial-gradient(circle 220px at ${smoothMousePos.x}px ${smoothMousePos.y}px, transparent 12%, rgba(0,0,0,0.85) 60%, black 100%)`,
        WebkitMaskImage: `radial-gradient(circle 220px at ${smoothMousePos.x}px ${smoothMousePos.y}px, transparent 12%, rgba(0,0,0,0.85) 60%, black 100%)`,
      }
    : {
        maskImage: "none",
        WebkitMaskImage: "none",
      };

  // Parallax calculations for the drifting mist layers based on smooth mouse movement relative to screen center
  const parallaxX1 = isInside ? (smoothMousePos.x - windowSize.width / 2) * -0.05 : 0;
  const parallaxY1 = isInside ? (smoothMousePos.y - windowSize.height / 2) * -0.05 : 0;
  const parallaxX2 = isInside ? (smoothMousePos.x - windowSize.width / 2) * 0.03 : 0;
  const parallaxY2 = isInside ? (smoothMousePos.y - windowSize.height / 2) * 0.03 : 0;

  const mistStyle1 = {
    transform: `translate(${parallaxX1}px, ${parallaxY1}px) scale(1.1)`,
    transition: isInside ? "transform 0.1s ease-out" : "transform 1.1s ease-out",
  };

  const mistStyle2 = {
    transform: `translate(${parallaxX2}px, ${parallaxY2}px) scale(1.1)`,
    transition: isInside ? "transform 0.1s ease-out" : "transform 1.1s ease-out",
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsInside(false)}
      onTouchCancel={() => setIsInside(false)}
      onMouseLeave={() => setIsInside(false)}
      className="relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-500 selection:bg-[#d7b9b9] selection:text-black" 
      style={{ 
        backgroundColor: websiteStyles.bgColor, 
        color: websiteStyles.textColor,
        fontFamily: websiteStyles.bodyFont
      }}
      id="app-root"
    >
      
      {/* Classical Paper/Parchment Texture overlay */}
      <div className="paper-texture" />
      
      {/* Floating Admin Control Bar */}
      {isAdmin && (
        <div className="sticky top-0 left-0 right-0 bg-black/85 backdrop-blur-md border-b px-4 py-3 z-50 flex flex-wrap items-center justify-between gap-4 animate-fade-in shadow-xl text-xs" style={{ borderColor: `${websiteStyles.accentColor}25` }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-semibold uppercase tracking-[0.2em] font-serif" style={{ color: websiteStyles.accentColor }}>Maktabah Alkutawi Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-serif">
            {/* Live Edit Mode Toggle */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all flex items-center gap-1.5 font-medium border cursor-pointer ${
                isEditMode 
                  ? "bg-white text-black border-white" 
                  : "hover:bg-white/5"
              }`}
              style={{ 
                color: isEditMode ? websiteStyles.bgColor : websiteStyles.accentColor, 
                borderColor: isEditMode ? "white" : `${websiteStyles.accentColor}40` 
              }}
            >
              <Sparkles size={11} />
              {isEditMode ? "Tutup Suntingan" : "Sunting Teks Langsung"}
            </button>

            {/* Fog Overlay Toggle */}
            <button
              onClick={() => setFogEnabled(!fogEnabled)}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all flex items-center gap-1.5 font-medium border cursor-pointer ${
                fogEnabled 
                  ? "bg-white/10 text-white hover:bg-white/20" 
                  : "opacity-50"
              }`}
              style={{ borderColor: `${websiteStyles.accentColor}30`, color: websiteStyles.accentColor }}
            >
              <Cloud size={11} />
              {fogEnabled ? "Kabus: Aktif" : "Kabus: Nyahaktif"}
            </button>

            {/* Database Modal Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-1.5 border hover:text-white rounded-sm uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              style={{ borderColor: `${websiteStyles.accentColor}30`, color: websiteStyles.accentColor }}
            >
              <Database size={11} />
              Urus & Gaya Laman
            </button>

            {/* Reset Button */}
            <button
              onClick={triggerResetConfirm}
              className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500 rounded-sm uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              title="Tetapkan semula kepada draf asal"
            >
              <RefreshCw size={11} />
              Tetapan Asal
            </button>

            {/* Log Out */}
            <button
              onClick={() => {
                setIsAdmin(false);
                setIsEditMode(false);
              }}
              className="px-3 py-1.5 bg-white/5 hover:bg-red-950/40 hover:text-white rounded-sm uppercase tracking-wider transition-all cursor-pointer"
              style={{ color: websiteStyles.accentColor }}
            >
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Premium Floating Header Tab Bar (Above Fog) */}
      <nav 
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-all duration-300 py-3 px-4"
        style={{ 
          backgroundColor: `${websiteStyles.headerBgColor || websiteStyles.bgColor}ea`, 
          borderColor: `${websiteStyles.accentColor}12`
        }}
        id="floating-nav"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-1.5 text-center">
          {/* Centered 'Bakal Terbit' upper tag */}
          <div className="flex items-center justify-center gap-2">
            {isEditMode ? (
              <>
                 <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("upperTag", sanitizeText(e.currentTarget.innerText || ""))}
                  className="tracking-[0.3em] font-semibold text-white/95 border-b border-dashed outline-none cursor-pointer inline-block whitespace-pre-wrap"
                  style={{ 
                    fontFamily: websiteStyles.upperTagFont || websiteStyles.serifFont,
                    fontSize: getResponsiveFontSize(websiteStyles.upperTagSize || "11px"),
                    color: websiteStyles.upperTagColor || websiteStyles.accentColor,
                    borderBottomColor: `${websiteStyles.accentColor}50`
                  }}
                  title="Klik untuk sunting tag atas"
                >
                  {landingTexts.upperTag}
                </div>
                <button
                  type="button"
                  onClick={() => setEditingStyleElement({ key: "upperTag", name: "Tag Atas" })}
                  className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                  title="Sunting Gaya Tag Atas"
                >
                  <Palette size={10} />
                </button>
              </>
            ) : (
              <div 
                className="tracking-[0.3em] font-semibold inline-block whitespace-pre-wrap"
                style={{
                  fontFamily: websiteStyles.upperTagFont || websiteStyles.serifFont,
                  fontSize: getResponsiveFontSize(websiteStyles.upperTagSize || "11px"),
                  color: websiteStyles.upperTagColor || websiteStyles.accentColor
                }}
              >
                {landingTexts.upperTag}
              </div>
            )}
          </div>

          {/* Elegant Countdown component centered */}
          {websiteStyles.showCountdown && (
            <div className="flex justify-center w-full relative max-w-sm mx-auto group">
              <CountdownTimer 
                accentColor={websiteStyles.accentColor}
                serifFont={websiteStyles.serifFont}
                bodyFont={websiteStyles.bodyFont}
                label={landingTexts.countdownLabel}
                isEditMode={isEditMode}
                onLabelChange={(val) => handleTextChange("countdownLabel", val)}
                countdownFont={websiteStyles.countdownFont}
                countdownSize={getResponsiveFontSize(websiteStyles.countdownSize)}
                countdownColor={websiteStyles.countdownColor}
                countdownLabelFont={websiteStyles.countdownLabelFont}
                countdownLabelSize={getResponsiveFontSize(websiteStyles.countdownLabelSize)}
                countdownLabelColor={websiteStyles.countdownLabelColor}
                
                daysLabel={landingTexts.countdownDaysLabel}
                hoursLabel={landingTexts.countdownHoursLabel}
                minutesLabel={landingTexts.countdownMinutesLabel}
                secondsLabel={landingTexts.countdownSecondsLabel}
                onDaysLabelChange={(val) => handleTextChange("countdownDaysLabel", val)}
                onHoursLabelChange={(val) => handleTextChange("countdownHoursLabel", val)}
                onMinutesLabelChange={(val) => handleTextChange("countdownMinutesLabel", val)}
                onSecondsLabelChange={(val) => handleTextChange("countdownSecondsLabel", val)}
              />
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setEditingStyleElement({ key: "countdown", name: "Kiraan Detik" })}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow z-20 select-none"
                  title="Sunting Gaya Kiraan Detik"
                >
                  <Palette size={11} />
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Dynamic Lantern Fog Cover */}
      {isFogVisible && (
        <div 
          className="fixed inset-0 z-30 pointer-events-none transition-all duration-500 select-none"
          style={{
            opacity: fogOpacity,
          }}
        >
          {/* Inner Fog Content with Lantern cursor spotlight */}
          <div 
            className="absolute inset-0 bg-[#120101]/99 backdrop-blur-[16px] transition-opacity duration-300"
            style={fogMaskStyle}
          >
            {/* Drifting Mist Overlays */}
            <div className="absolute inset-0 mist-drift-1 opacity-25" style={mistStyle1} />
            <div className="absolute inset-0 mist-drift-2 opacity-15" style={mistStyle2} />
          </div>
        </div>
      )}

      {/* Subtle Ambient Radial Glow overlay to evoke classical literary space */}
      <div className="absolute inset-0 ambient-glow pointer-events-none" />

      {/* Main Content */}
      <main 
        className={`relative flex-1 flex flex-col pb-6 sm:pb-12 px-6 z-10 max-w-5xl mx-auto w-full ${alignContainerClass}`} 
        id="landing-main"
        style={{ 
          paddingTop: "87px",
          paddingBottom: "0px",
          paddingLeft: "24px"
        }}
      >
        
        {/* Elemen Tambahan di ATAS Logo */}
        {(landingTexts.aboveLogoText || landingTexts.aboveLogoImageUrl || isEditMode) && (
          <div 
            className={`w-full flex flex-col z-20 ${alignContainerClass} animate-fade-in`} 
            id="above-logo-container"
            style={{ marginBottom: getResponsiveSpacing(websiteStyles.spacingAboveLogo, "24px") }}
          >
            {isEditMode ? (
              <div className="w-full flex flex-col items-center gap-2 p-3 border border-dashed border-[#d7b9b9]/20 rounded bg-black/30 max-w-lg mx-auto">
                <div className="flex items-center justify-between w-full px-1 border-b border-white/5 pb-1">
                  <span className="text-[10px] text-[#d7b9b9]/60 font-mono tracking-widest">ELEMEN ATAS LOGO (SUNTINGAN)</span>
                  <button
                    type="button"
                    onClick={() => setEditingStyleElement({ key: "aboveLogo", name: "Elemen Atas Logo" })}
                    className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                    title="Sunting Gaya Elemen Atas Logo"
                  >
                    <Palette size={10} />
                  </button>
                </div>
                
                {/* Text input */}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("aboveLogoText", sanitizeText(e.currentTarget.innerText || ""))}
                  className="w-full text-center border-b border-dashed border-[#d7b9b9]/30 outline-none text-xs text-white/80 focus:bg-white/5 py-1 px-2 empty:before:content-['[Klik_untuk_tulis_teks_di_atas_logo]'] empty:before:text-white/30 whitespace-pre-wrap"
                  style={{ 
                    fontFamily: websiteStyles.aboveLogoFont || websiteStyles.bodyFont,
                    fontSize: websiteStyles.aboveLogoSize || "12px",
                    color: websiteStyles.aboveLogoColor || websiteStyles.textColor
                  }}
                >
                  {landingTexts.aboveLogoText}
                </div>

                {/* Optional Image Url */}
                <input
                  type="text"
                  placeholder="Atau pautan gambar di atas logo (cth: https://...)"
                  value={landingTexts.aboveLogoImageUrl || ""}
                  onChange={(e) => handleTextChange("aboveLogoImageUrl", e.target.value)}
                  className="w-full bg-[#430400]/40 border border-[#d7b9b9]/20 rounded px-2 py-1 text-[10px] text-white/80 focus:outline-none text-center font-mono placeholder:text-white/20"
                />
              </div>
            ) : (
              <>
                {landingTexts.aboveLogoImageUrl && (
                  <img
                    src={landingTexts.aboveLogoImageUrl}
                    alt="Elemen Atas Logo"
                    className="max-h-24 w-auto object-contain mb-2 mx-auto"
                    referrerPolicy="no-referrer"
                  />
                )}
                {landingTexts.aboveLogoText && (
                  <p 
                    className={`text-xs tracking-wider max-w-md whitespace-pre-wrap mx-auto text-center fade-in-mount ${isMounted ? 'fade-in-mount-active' : ''}`}
                    style={{ 
                      fontFamily: websiteStyles.aboveLogoFont || websiteStyles.bodyFont,
                      fontSize: websiteStyles.aboveLogoSize || "12px",
                      color: websiteStyles.aboveLogoColor || websiteStyles.textColor
                    }}
                  >
                    {landingTexts.aboveLogoText}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Centered logo of Maktabah Al-Kutawi */}
        <div 
          className={`w-full flex flex-col mt-2 z-20 ${alignContainerClass}`} 
          id="brand-logo-container"
          style={{ marginBottom: getResponsiveSpacing(websiteStyles.spacingLogo, "48px"), paddingTop: "90px" }}
        >
          <div className="relative">
            {/* If logo is image but has an error loading, fallback gracefully to styled text logo */}
            {websiteStyles.logoType === 'image' && websiteStyles.logoImageUrl && !logoImageError ? (
              <div className="relative group cursor-pointer inline-block" onClick={() => isEditMode && setEditingStyleElement({ key: "logo", name: "Logo Utama" })}>
                <img 
                  src={websiteStyles.logoImageUrl} 
                  alt={websiteStyles.logoText} 
                  style={{ height: websiteStyles.logoSize }}
                  className={`object-contain max-w-full transition-all mx-auto ${isEditMode ? 'hover:scale-[1.02] active:scale-[0.98] border border-dashed border-[#d7b9b9]/20 hover:border-[#d7b9b9]/60 rounded p-1.5 bg-black/20' : ''}`}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoImageError(true)}
                />
                {isEditMode && (
                  <div className="absolute -top-3 -right-3 bg-[#430400] border border-[#d7b9b9]/40 p-1 rounded-full text-white/80 hover:text-white shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    <Palette size={12} className="animate-pulse" />
                  </div>
                )}
              </div>
            ) : websiteStyles.logoType === 'image' && !websiteStyles.logoImageUrl ? (
              <div 
                onClick={() => isEditMode && setEditingStyleElement({ key: "logo", name: "Logo Utama" })}
                className="border-2 border-dashed border-[#d7b9b9]/30 rounded-lg p-6 font-serif text-xs max-w-xs text-white/50 mx-auto cursor-pointer hover:bg-white/5 transition-all"
              >
                Sila masukkan URL logo imej di ruangan suntingan (Klik di sini)
              </div>
            ) : (
              /* Text Logo (or Fallback if Image has loading error) */
              <div className="relative group inline-block max-w-full">
                {isEditMode ? (
                  <div className="relative flex items-center justify-center gap-2 max-w-full">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        handleStylesChange({
                          ...websiteStyles,
                          logoText: sanitizeText(e.currentTarget.innerText || "Maktabah Alkutawi")
                        });
                      }}
                      className={`border-b border-dashed outline-none transition-all px-2 py-1 rounded select-text text-center inline-block cursor-pointer hover:bg-white/5 whitespace-pre-wrap ${
                        websiteStyles.logoWeight === 'bold' ? 'font-bold' :
                        websiteStyles.logoWeight === 'medium' ? 'font-medium' :
                        websiteStyles.logoWeight === 'semibold' ? 'font-semibold' : 'font-normal'
                      } ${websiteStyles.logoStyle === 'italic' ? 'italic' : ''}`}
                      style={{ 
                        fontFamily: websiteStyles.logoFont || websiteStyles.serifFont, 
                        fontSize: websiteStyles.logoSize,
                        color: websiteStyles.logoColor || websiteStyles.textColor,
                        borderBottomColor: `${websiteStyles.accentColor}50`
                      }}
                      title="Klik untuk menyunting teks logo"
                    >
                      {websiteStyles.logoText}
                    </div>
                    <button 
                      onClick={() => setEditingStyleElement({ key: "logo", name: "Logo Utama" })}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-[#d7b9b9]/20 text-white/70 hover:text-white transition-all cursor-pointer select-none"
                      title="Tetapan gaya logo"
                    >
                      <Palette size={12} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`transition-all text-center inline-block whitespace-pre-wrap ${
                      websiteStyles.logoWeight === 'bold' ? 'font-bold' :
                      websiteStyles.logoWeight === 'medium' ? 'font-medium' :
                      websiteStyles.logoWeight === 'semibold' ? 'font-semibold' : 'font-normal'
                    } ${websiteStyles.logoStyle === 'italic' ? 'italic' : ''}`}
                    style={{ 
                      fontFamily: websiteStyles.logoFont || websiteStyles.serifFont, 
                      fontSize: websiteStyles.logoSize,
                      color: websiteStyles.logoColor || websiteStyles.textColor
                    }}
                  >
                    {websiteStyles.logoText}
                  </div>
                )}
                
                {/* Fallback indicator when image failed to load */}
                {websiteStyles.logoType === 'image' && logoImageError && isEditMode && (
                  <div className="text-[10px] text-red-400 font-serif mt-2 animate-pulse cursor-pointer hover:underline" onClick={() => setEditingStyleElement({ key: "logo", name: "Logo Utama" })}>
                    ⚠️ Gambar logo gagal dimuatkan. Bersandar kepada teks. (Klik di sini untuk baiki)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Elemen Tambahan di ANTARA Logo dengan Teks Aliran / Tengah */}
        {(landingTexts.belowLogoText || landingTexts.belowLogoImageUrl || isEditMode) && (
          <div 
            className={`w-full flex flex-col z-20 ${alignContainerClass} animate-fade-in`} 
            id="below-logo-container" 
            style={{ 
              animationDelay: "300ms",
              marginTop: getResponsiveSpacing(websiteStyles.spacingBelowLogo, "24px"),
              marginBottom: getResponsiveSpacing(websiteStyles.spacingBelowLogo, "24px")
            }}
          >
            {isEditMode ? (
              <div className="w-full flex flex-col items-center gap-2 p-3 border border-dashed border-[#d7b9b9]/20 rounded bg-black/30 max-w-lg mx-auto">
                <div className="flex items-center justify-between w-full px-1 border-b border-white/5 pb-1">
                  <span className="text-[10px] text-[#d7b9b9]/60 font-mono tracking-widest">ELEMEN ANTARA LOGO & TEKS MENAIP (SUNTINGAN)</span>
                  <button
                    type="button"
                    onClick={() => setEditingStyleElement({ key: "belowLogo", name: "Elemen Bawah Logo" })}
                    className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                    title="Sunting Gaya Elemen Bawah Logo"
                  >
                    <Palette size={10} />
                  </button>
                </div>
                
                {/* Text input */}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("belowLogoText", sanitizeText(e.currentTarget.innerText || ""))}
                  className="w-full text-center border-b border-dashed border-[#d7b9b9]/30 outline-none text-sm text-white focus:bg-white/5 py-1 px-2 empty:before:content-['[Klik_untuk_tulis_teks_di_tengah]'] empty:before:text-white/30 whitespace-pre-wrap"
                  style={{ 
                    fontFamily: websiteStyles.belowLogoFont || websiteStyles.serifFont,
                    fontSize: websiteStyles.belowLogoSize || "16px",
                    color: websiteStyles.belowLogoColor || websiteStyles.textColor
                  }}
                >
                  {landingTexts.belowLogoText}
                </div>

                {/* Optional Image Url */}
                <input
                  type="text"
                  placeholder="Atau pautan gambar di tengah (cth: https://...)"
                  value={landingTexts.belowLogoImageUrl || ""}
                  onChange={(e) => handleTextChange("belowLogoImageUrl", e.target.value)}
                  className="w-full bg-[#430400]/40 border border-[#d7b9b9]/20 rounded px-2 py-1 text-[10px] text-white/80 focus:outline-none text-center font-mono placeholder:text-white/20"
                />
              </div>
            ) : (
              <>
                {landingTexts.belowLogoImageUrl && (
                  <img
                    src={landingTexts.belowLogoImageUrl}
                    alt="Elemen Tengah"
                    className="max-h-32 w-auto object-contain my-2 mx-auto"
                    referrerPolicy="no-referrer"
                  />
                )}
                {landingTexts.belowLogoText && (
                  <p 
                    className={`text-base sm:text-lg leading-relaxed max-w-xl font-serif whitespace-pre-wrap mx-auto text-center fade-in-mount ${isMounted ? 'fade-in-mount-active' : ''}`}
                    style={{ 
                      fontFamily: websiteStyles.belowLogoFont || websiteStyles.serifFont,
                      fontSize: websiteStyles.belowLogoSize || "16px",
                      color: websiteStyles.belowLogoColor || websiteStyles.textColor
                    }}
                  >
                    {landingTexts.belowLogoText}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Elegant low-opacity divider */}
        <div className="w-full max-w-xs sm:max-w-md mx-auto my-5 opacity-15 border-t border-dashed z-20" style={{ borderColor: websiteStyles.accentColor || "#d7b9b9" }} />

        {/* Centerpiece Typing quotes */}
        <div 
          className="w-full animate-fade-in opacity-0 relative group max-w-2xl mx-auto" 
          style={{ 
            animationDelay: "400ms",
            marginTop: getResponsiveSpacing(websiteStyles.spacingQuotes, "24px"),
            marginBottom: getResponsiveSpacing(websiteStyles.spacingQuotes, "24px"),
            textAlign: websiteStyles.alignText as any
          }} 
          id="centerpiece-typing"
        >
          <TeaserText 
            quotes={quotes} 
            isEditMode={isEditMode} 
            onQuoteChange={handleQuoteChange}
            serifFont={websiteStyles.serifFont}
            quoteSize={websiteStyles.quoteSize}
            accentColor={websiteStyles.accentColor}
            bodyFont={websiteStyles.bodyFont}
            quoteFont={websiteStyles.quoteFont}
            quoteColor={websiteStyles.quoteColor}
          />
          {isEditMode && (
            <button
              type="button"
              onClick={() => setEditingStyleElement({ key: "quote", name: "Teks Aliran" })}
              className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow z-20 select-none"
              title="Sunting Gaya Teks Aliran"
            >
              <Palette size={11} />
            </button>
          )}
        </div>

        {/* Custom Boxes / Elements section */}
        {customBlocks && customBlocks.length > 0 && (
          <div 
            className="w-full max-w-2xl space-y-6 z-20 animate-fade-in" 
            style={{ 
              animationDelay: "500ms",
              marginTop: websiteStyles.spacingBlocks || "32px",
              marginBottom: websiteStyles.spacingBlocks || "32px"
            }} 
            id="custom-blocks-list"
          >
            {customBlocks.map((block) => (
              <CustomBlockRenderer
                key={block.id}
                block={block}
                websiteStyles={websiteStyles}
                getResponsiveFontSize={getResponsiveFontSize}
              />
            ))}
          </div>
        )}

        {/* Iframe Embed Section */}
        {websiteStyles.embedIframeEnabled && websiteStyles.embedIframeCode && (
          <div 
            className={`w-full ${websiteStyles.embedIframeWidth || "max-w-2xl"} px-4 mx-auto z-20 animate-fade-in flex flex-col items-center justify-center text-center gap-3`}
            style={{ 
              animationDelay: "550ms",
              marginTop: websiteStyles.spacingBlocks || "32px",
              marginBottom: websiteStyles.spacingBlocks || "32px"
            }}
            id="iframe-embed-section"
          >
            {websiteStyles.embedIframeTitle && (
              <div className="flex items-center gap-2 mb-1 justify-center text-center">
                <h3 
                  className="font-serif text-xs uppercase tracking-[0.2em] font-semibold text-center"
                  style={{ color: websiteStyles.accentColor }}
                >
                  {websiteStyles.embedIframeTitle}
                </h3>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setEditingStyleElement({ key: "embed", name: "Kandungan Terbenam (Iframe)" })}
                    className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                    title="Sunting Kandungan Terbenam"
                  >
                    <Palette size={10} />
                  </button>
                )}
              </div>
            )}
            
            {(() => {
              let src = "";
              const code = websiteStyles.embedIframeCode.trim();
              if (code.toLowerCase().includes("<iframe")) {
                const match = code.match(/src=["']([^"']+)["']/i);
                if (match && match[1]) {
                  src = match[1];
                }
              }
              if (!src) {
                src = code;
              }
              if (src.includes("drive.google.com") && src.includes("/view")) {
                src = src.replace("/view", "/preview");
              }
              
              if (websiteStyles.embedIframePlayOnly) {
                return (
                  <div className="flex flex-col items-center justify-center gap-2 select-none">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black/90 border-2 border-[#d7b9b9] hover:border-white shadow-[0_0_20px_rgba(215,185,185,0.25)] transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer group">
                      {/* Ambient pulse background */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black to-transparent z-0" />
                      <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none animate-pulse" />
                      <div className="absolute inset-0 rounded-full border border-[#d7b9b9]/30 pointer-events-none animate-ping opacity-50 duration-1000" />
                      
                      <iframe 
                        src={src} 
                        style={{
                          position: "absolute",
                          width: "600px",
                          height: "450px",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          border: "none",
                          pointerEvents: "auto",
                        }}
                        allow="autoplay"
                        referrerPolicy="no-referrer"
                        title={websiteStyles.embedIframeTitle || "Kandungan Terbenam"}
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono font-medium" style={{ color: websiteStyles.accentColor }}>
                      Mainkan Audio Pratonton
                    </span>
                  </div>
                );
              }

              return (
                <div className="w-full relative group flex justify-center">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d7b9b9]/10 to-transparent rounded-2xl blur opacity-30 transition duration-1000 group-hover:opacity-50" />
                  <div className="relative w-full rounded-2xl overflow-hidden bg-black/45 border border-[#d7b9b9]/20 shadow-2xl">
                    <iframe 
                      src={src} 
                      width="100%" 
                      style={{ height: websiteStyles.embedIframeHeight || "480px" }}
                      className="w-full border-0 rounded-2xl"
                      allow="autoplay"
                      referrerPolicy="no-referrer"
                      title={websiteStyles.embedIframeTitle || "Kandungan Terbenam"}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Cursive Vibe Indicator */}
        {websiteStyles.showCursiveVibe && (() => {
          const isCustomCursiveSize = websiteStyles.cursiveSize && (websiteStyles.cursiveSize.includes('px') || websiteStyles.cursiveSize.includes('rem') || websiteStyles.cursiveSize.includes('em') || websiteStyles.cursiveSize.includes('pt'));
          const finalCursiveClass = isCustomCursiveSize ? "" : (websiteStyles.cursiveSize || "text-5xl sm:text-6xl");
          return (
            <div 
              className={`animate-fade-in opacity-0 ${alignTextClass}`} 
              style={{ 
                animationDelay: "650ms",
                marginBottom: getResponsiveSpacing(websiteStyles.spacingCursive, "24px")
              }} 
              id="cursive-vibe"
            >
              {isEditMode ? (
                <div className="flex items-center justify-center gap-2" style={{ paddingLeft: "0px", paddingTop: "45px" }}>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange("cursiveVibe", sanitizeText(e.currentTarget.innerText || ""))}
                    className={`tracking-wide border-b border-dashed hover:bg-white/5 px-1 rounded focus:outline-none inline-block outline-none whitespace-pre-wrap ${finalCursiveClass}`}
                    style={{ 
                      fontFamily: websiteStyles.cursiveFont || "Allison",
                      fontSize: isCustomCursiveSize ? websiteStyles.cursiveSize : undefined,
                      color: websiteStyles.cursiveColor || websiteStyles.accentColor,
                      borderBottomColor: `${websiteStyles.accentColor}60`
                    }}
                    title="Klik untuk sunting getaran puitis"
                  >
                    {landingTexts.cursiveVibe}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingStyleElement({ key: "cursive", name: "Getaran Puitis" })}
                    className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                    title="Sunting Gaya Getaran Puitis"
                  >
                    <Palette size={10} />
                  </button>
                </div>
              ) : (
                <div 
                  className={`tracking-wide select-none inline-block whitespace-pre-wrap ${finalCursiveClass}`}
                  style={{ 
                    fontFamily: websiteStyles.cursiveFont || "Allison",
                    fontSize: isCustomCursiveSize ? websiteStyles.cursiveSize : undefined,
                    color: websiteStyles.cursiveColor || websiteStyles.accentColor,
                    paddingLeft: "0px",
                    paddingTop: "45px"
                  }}
                >
                  {landingTexts.cursiveVibe}
                </div>
              )}
            </div>
          );
        })()}

        {/* Logo/Lambang di bawah teks 'Iman. Cinta. Sastera' */}
        {(websiteStyles.logoUnderCursiveUrl || isEditMode) && websiteStyles.showCursiveVibe && (
          <div 
            className={`w-full flex flex-col items-center justify-center z-20 animate-fade-in`}
            style={{ 
              animationDelay: "700ms",
              marginBottom: "32px",
              marginTop: "-8px",
              paddingTop: "20px",
              paddingBottom: "20px"
            }}
            id="cursive-logo-container"
          >
            {websiteStyles.logoUnderCursiveUrl ? (
              <div className="relative group inline-block cursor-pointer" onClick={() => isEditMode && setEditingStyleElement({ key: "cursiveLogo", name: "Lambang Teks Puitis" })}>
                <img 
                  src={websiteStyles.logoUnderCursiveUrl} 
                  alt="Lambang Getaran Puitis" 
                  style={{ height: websiteStyles.logoUnderCursiveSize || "64px" }}
                  className={`object-contain max-w-full transition-all mx-auto ${isEditMode ? 'hover:scale-[1.02] border border-dashed border-[#d7b9b9]/25 hover:border-[#d7b9b9]/60 rounded p-1 bg-black/25' : ''}`}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : isEditMode ? (
              <div 
                onClick={() => setEditingStyleElement({ key: "cursiveLogo", name: "Lambang Teks Puitis" })}
                className="border border-dashed border-[#d7b9b9]/35 hover:border-[#d7b9b9]/60 hover:bg-white/5 rounded-lg p-3 font-serif text-[11px] text-white/50 max-w-xs text-center mx-auto cursor-pointer transition-all"
              >
                + Letakkan URL logo/lambang di bawah teks puitis di sini (Klik)
              </div>
            ) : null}
          </div>
        )}

      </main>

      {/* Footer */}
      {/* Footer */}
      <footer 
        className={`relative w-full z-40 text-xs text-white/60 animate-fade-in text-center ${websiteStyles.footerShowBorder !== false ? 'border-t' : ''}`} 
        style={{ 
          borderTopColor: websiteStyles.footerShowBorder !== false ? `${websiteStyles.accentColor}18` : undefined, 
          fontFamily: websiteStyles.serifFont,
          backgroundColor: websiteStyles.footerBgColor || "#000000"
        }}
        id="landing-footer"
      >
        <div 
          className="w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center gap-6"
          style={{
            paddingTop: "31px",
            paddingBottom: "31px",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
          <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto" id="footer-launch-info">
            {renderBrandIcon(
              websiteStyles.launchIcon, 
              "Scroll", 
              14, 
              websiteStyles.launchColor || websiteStyles.accentColor, 
              "opacity-70 shrink-0", 
              websiteStyles.launchIconUrl,
              websiteStyles.launchIconSize,
              websiteStyles.launchIconYOffset
            )}
            {isEditMode ? (
              <div className="flex items-center gap-1.5">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("launchText", sanitizeText(e.currentTarget.innerText || ""))}
                  className="tracking-wide border-b border-dashed hover:bg-white/5 px-1 rounded focus:outline-none inline-block outline-none whitespace-pre-wrap"
                  style={{ 
                    fontFamily: websiteStyles.launchFont || websiteStyles.serifFont,
                    fontSize: websiteStyles.launchSize || "11px",
                    color: websiteStyles.launchColor || websiteStyles.textColor,
                    borderBottomColor: `${websiteStyles.accentColor}50` 
                  }}
                >
                  {landingTexts.launchText}
                </div>
                <button
                  type="button"
                  onClick={() => setEditingStyleElement({ key: "launch", name: "Teks Pelancaran" })}
                  className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                  title="Sunting Gaya Teks Pelancaran"
                >
                  <Palette size={10} />
                </button>
              </div>
            ) : (
              <div 
                className="tracking-wide inline-block whitespace-pre-wrap"
                style={{ 
                  fontFamily: websiteStyles.launchFont || websiteStyles.serifFont,
                  fontSize: websiteStyles.launchSize || "11px",
                  color: websiteStyles.launchColor || websiteStyles.textColor
                }}
              >
                {landingTexts.launchText}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-4 sm:gap-4 w-full sm:w-auto" id="footer-actions">
            
            {/* Publisher Brand container */}
            <div className="flex items-center justify-center gap-2 order-1 sm:order-3" id="footer-publisher-wrapper">
              <div 
                onDoubleClick={handleAdminAccess}
                className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors select-none"
                title="Dwi-klik untuk akses pentadbir"
                id="brand-publisher"
              >
                {renderBrandIcon(
                  websiteStyles.publisherIcon, 
                  "Library", 
                  12, 
                  websiteStyles.publisherColor || websiteStyles.accentColor, 
                  "opacity-75 shrink-0", 
                  websiteStyles.publisherIconUrl,
                  websiteStyles.publisherIconSize,
                  websiteStyles.publisherIconYOffset
                )}
                {isEditMode ? (
                  <div className="flex items-center gap-1.5">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange("publisherName", sanitizeText(e.currentTarget.innerText || ""))}
                      className="font-medium border-b border-dashed hover:bg-white/5 px-1 rounded focus:outline-none inline-block outline-none whitespace-pre-wrap"
                      style={{ 
                        fontFamily: websiteStyles.publisherFont || websiteStyles.serifFont,
                        fontSize: websiteStyles.publisherSize || "11px",
                        color: websiteStyles.publisherColor || websiteStyles.accentColor,
                        borderBottomColor: `${websiteStyles.accentColor}50` 
                      }}
                    >
                      {landingTexts.publisherName}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingStyleElement({ key: "publisher", name: "Penerbit" })}
                      className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                      title="Sunting Gaya Penerbit"
                    >
                      <Palette size={10} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="font-medium inline-block whitespace-pre-wrap"
                    style={{ 
                      fontFamily: websiteStyles.publisherFont || websiteStyles.serifFont,
                      fontSize: websiteStyles.publisherSize || "11px",
                      color: websiteStyles.publisherColor || websiteStyles.accentColor
                    }}
                  >
                    {landingTexts.publisherName}
                  </div>
                )}
              </div>
            </div>

            {/* Separator - ONLY visible on desktop */}
            <span className="hidden sm:inline opacity-20 text-white/30 order-2">|</span>

            {/* Admin Controls container - Symmetrical Row */}
            <div className="flex items-center justify-center gap-3 order-2 sm:order-1" id="footer-admin-controls">
              {/* Fog Manual Toggle - ONLY show if isAdmin */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => setFogEnabled(!fogEnabled)}
                    className="flex items-center justify-center p-1.5 transition-colors cursor-pointer opacity-60 hover:opacity-100 hover:text-white rounded-full hover:bg-white/5"
                    style={{ color: websiteStyles.accentColor }}
                    title={fogEnabled ? "Singkirkan Kabus Misteri (Sapu Kabus)" : "Kembalikan Kabus Misteri (Pasang Kabus)"}
                    id="btn-visitor-fog-toggle"
                  >
                    <Cloud size={12} />
                  </button>
                  <span className="opacity-20 text-white/30 text-[9px]">•</span>
                </>
              )}

              {/* Discreet Admin Lock Button */}
              <button 
                onClick={handleAdminAccess}
                className="flex items-center justify-center p-1.5 hover:text-white transition-colors cursor-pointer opacity-60 hover:opacity-100 rounded-full hover:bg-white/5"
                title="Akses Urus Data"
                id="btn-admin-access"
              >
                <KeyRound size={12} className="opacity-80" style={{ color: websiteStyles.accentColor }} />
              </button>
            </div>

          </div>
        </div>

        {/* Clear and explicit centered copyright notice */}
        <div className="flex flex-col items-center justify-center gap-1.5 w-full pt-4 border-t" style={{ borderTopColor: websiteStyles.footerShowBorder !== false ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
          <div 
            className="tracking-wider text-center flex items-center justify-center gap-2 select-none" 
            id="copyright-notice" 
            style={{ 
              fontFamily: websiteStyles.copyrightFont || websiteStyles.bodyFont,
              fontSize: getResponsiveFontSize(websiteStyles.copyrightSize || "10px"),
              color: websiteStyles.copyrightColor || "rgba(255, 255, 255, 0.4)",
            }}
          >
            <span>Hak Cipta Terpelihara © 2026 {landingTexts.publisherName}</span>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setEditingStyleElement({ key: "copyright", name: "Hak Cipta Terpelihara" })}
                className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:text-white transition-all cursor-pointer shadow select-none"
                title="Sunting Gaya Hak Cipta"
              >
                <Palette size={10} />
              </button>
            )}
          </div>
        </div>
        </div>
      </footer>

      {/* Custom layout frame border to give high-end editorial book cover aesthetic */}
      {websiteStyles.showBorderFrame && (
        <div 
          className="fixed inset-0 pointer-events-none z-40 transition-all duration-300" 
          style={{ border: `${websiteStyles.borderThickness} solid ${websiteStyles.bgColor}` }}
        />
      )}

      {/* Hidden Management Dashboard Dialog */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        styles={websiteStyles}
        onStylesChange={handleStylesChange}
        onResetStyles={handleResetStyles}
        customBlocks={customBlocks}
        onCustomBlocksChange={handleCustomBlocksChange}
        isBetaPopupOpen={isBetaPopupOpen}
        setIsBetaPopupOpen={setIsBetaPopupOpen}
        landingTexts={landingTexts}
      />

      {/* Custom Admin Login & Configuration Dialog */}
      {isAdminPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" id="custom-admin-prompt">
          <div className="bg-[#1c0200] w-full max-w-md rounded-xl border border-[#d7b9b9]/25 shadow-2xl p-6 flex flex-col gap-5 text-white">
            
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#d7b9b9]/10 rounded-lg text-[#d7b9b9]">
                <KeyRound size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium tracking-wide text-white">Akses Pentadbir</h3>
                <p className="font-serif text-xs text-[#d7b9b9]/60">Sila masukkan kata laluan untuk menguruskan naskhah.</p>
              </div>
            </div>

            {/* Error Message */}
            {adminError && (
              <div className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs py-2.5 px-3 rounded font-serif flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>{adminError}</span>
              </div>
            )}

            {/* Password Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-serif text-[10px] uppercase tracking-[0.2em] text-[#d7b9b9]/80">Kata Laluan</label>
              <input
                type="password"
                placeholder="Masukkan kata laluan..."
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setAdminError("");
                }}
                className="w-full font-serif text-sm px-3 py-2.5 bg-[#430400]/40 border border-[#d7b9b9]/20 rounded text-white focus:outline-none focus:border-[#d7b9b9]/50 placeholder:text-white/25"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdminSubmit();
                }}
              />
            </div>

            {/* Action Choice / Mode Switch */}
            <div className="bg-black/25 border border-[#d7b9b9]/10 rounded-lg p-3.5 flex flex-col gap-3">
              <p className="font-serif text-[10px] uppercase tracking-[0.15em] text-[#d7b9b9]/75 border-b border-[#d7b9b9]/10 pb-1.5">Pilihan Akses</p>
              
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={adminLiveEditChoice}
                  onChange={(e) => setAdminLiveEditChoice(e.target.checked)}
                  className="rounded border-[#d7b9b9]/30 text-[#430400] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4 cursor-pointer"
                />
                <div className="text-left">
                  <p className="font-serif text-xs text-white/90 font-medium">Aktifkan Suntingan Teks Langsung</p>
                  <p className="font-serif text-[10px] text-white/50">Membolehkan anda menyunting sebarang teks secara langsung pada halaman</p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 font-serif mt-2">
              <button
                onClick={() => setIsAdminPromptOpen(false)}
                className="px-4 py-2 border border-[#d7b9b9]/30 hover:bg-white/5 text-white/80 rounded text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleAdminSubmit}
                className="px-4 py-2 bg-[#d7b9b9] hover:bg-[#c5a059] text-[#430400] font-semibold rounded text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span>Sahkan</span>
                <Check size={12} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Custom Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" id="custom-reset-confirm">
          <div className="bg-[#1c0200] w-full max-w-sm rounded-xl border border-red-500/20 shadow-2xl p-6 flex flex-col gap-4 text-white">
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 className="font-serif text-base font-medium tracking-wide text-white">Pulihkan Nilai Asal?</h3>
                <p className="font-serif text-xs text-white/60">Tindakan ini akan menetapkan semula semua data.</p>
              </div>
            </div>

            <p className="font-serif text-xs text-white/80 leading-relaxed bg-black/20 p-3 rounded border border-red-500/10 text-left">
              Adakah anda pasti mahu mengembalikan semua teks, warkah petikan, dan gaya laman kepada draf asal? Tindakan ini akan memadamkan semua perubahan langsung yang telah anda buat.
            </p>

            <div className="flex items-center justify-end gap-3 font-serif mt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white/80 rounded text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Pulihkan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Scroll-triggered Beta Registration Popup */}
      {isBetaPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 animate-fade-in animate-duration-300" id="beta-popup-overlay">
          <div 
            className="relative w-full max-w-lg rounded-sm overflow-hidden"
            style={{ 
              backgroundColor: "transparent",
              border: "none"
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsBetaPopupOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-all cursor-pointer"
              title="Tutup"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            {/* Registration Form Component */}
            <div className="p-1 max-h-[85vh] overflow-y-auto no-scrollbar">
              <BetaRegistration 
                title={landingTexts.betaTitle} 
                description={landingTexts.betaDesc} 
                isEditMode={isEditMode}
                onTitleChange={(val) => handleTextChange("betaTitle", val)}
                onDescChange={(val) => handleTextChange("betaDesc", val)}
                accentColor={websiteStyles.accentColor}
                formBgColor={websiteStyles.formBgColor}
                bodyFont={websiteStyles.bodyFont}
                serifFont={websiteStyles.serifFont}
                formNameLabel={landingTexts.formNameLabel}
                formEmailLabel={landingTexts.formEmailLabel}
                formPhoneLabel={landingTexts.formPhoneLabel}
                formReasonLabel={landingTexts.formReasonLabel}
                formBtnText={landingTexts.formBtnText}
                onNameLabelChange={(val) => handleTextChange("formNameLabel", val)}
                onEmailLabelChange={(val) => handleTextChange("formEmailLabel", val)}
                onPhoneLabelChange={(val) => handleTextChange("formPhoneLabel", val)}
                onReasonLabelChange={(val) => handleTextChange("formReasonLabel", val)}
                onBtnTextChange={(val) => handleTextChange("formBtnText", val)}
                formTitleFont={websiteStyles.formTitleFont}
                formTitleSize={websiteStyles.formTitleSize}
                formTitleColor={websiteStyles.formTitleColor}
                formDescFont={websiteStyles.formDescFont}
                formDescSize={websiteStyles.formDescSize}
                formDescColor={websiteStyles.formDescColor}
                onTitleStyleClick={() => setEditingStyleElement({ key: "formTitle", name: "Tajuk Borang Pendaftaran" })}
                onDescStyleClick={() => setEditingStyleElement({ key: "formDesc", name: "Huraian Borang Pendaftaran" })}
                googleSheetsWebhookUrl={websiteStyles.googleSheetsWebhookUrl}
              />
            </div>
          </div>
        </div>
      )}

      {/* Unified Style Customizer Modal */}
      {editingStyleElement && (() => {
        const key = editingStyleElement.key;
        const name = editingStyleElement.name;

        // Determine which style fields to edit based on key
        let fontKey: keyof WebsiteStyles | null = null;
        let sizeKey: keyof WebsiteStyles | null = null;
        let colorKey: keyof WebsiteStyles | null = null;
        let spacingKey: keyof WebsiteStyles | null = null;

        if (key === 'upperTag') {
          fontKey = 'upperTagFont'; sizeKey = 'upperTagSize'; colorKey = 'upperTagColor';
        } else if (key === 'aboveLogo') {
          fontKey = 'aboveLogoFont'; sizeKey = 'aboveLogoSize'; colorKey = 'aboveLogoColor'; spacingKey = 'spacingAboveLogo';
        } else if (key === 'logo') {
          fontKey = 'logoFont'; sizeKey = 'logoSize'; colorKey = 'logoColor'; spacingKey = 'spacingLogo';
        } else if (key === 'belowLogo') {
          fontKey = 'belowLogoFont'; sizeKey = 'belowLogoSize'; colorKey = 'belowLogoColor'; spacingKey = 'spacingBelowLogo';
        } else if (key === 'quote') {
          fontKey = 'quoteFont'; sizeKey = 'quoteSize'; colorKey = 'quoteColor'; spacingKey = 'spacingQuotes';
        } else if (key === 'cursive') {
          fontKey = 'cursiveFont'; sizeKey = 'cursiveSize'; colorKey = 'cursiveColor'; spacingKey = 'spacingCursive';
        } else if (key === 'launch') {
          fontKey = 'launchFont'; sizeKey = 'launchSize'; colorKey = 'launchColor';
        } else if (key === 'publisher') {
          fontKey = 'publisherFont'; sizeKey = 'publisherSize'; colorKey = 'publisherColor';
        } else if (key === 'countdown') {
          fontKey = 'countdownFont'; sizeKey = 'countdownSize'; colorKey = 'countdownColor';
        } else if (key === 'formTitle') {
          fontKey = 'formTitleFont'; sizeKey = 'formTitleSize'; colorKey = 'formTitleColor';
        } else if (key === 'formDesc') {
          fontKey = 'formDescFont'; sizeKey = 'formDescSize'; colorKey = 'formDescColor';
        } else if (key === 'copyright') {
          fontKey = 'copyrightFont'; sizeKey = 'copyrightSize'; colorKey = 'copyrightColor';
        }

        const currentFont = fontKey ? (websiteStyles[fontKey] as string) || "" : "";
        const currentSize = sizeKey ? (websiteStyles[sizeKey] as string) || "" : "";
        const currentColor = colorKey ? (websiteStyles[colorKey] as string) || "" : "";
        const currentSpacing = spacingKey ? (websiteStyles[spacingKey] as string) || "" : "";

        const handleFieldChange = (field: keyof WebsiteStyles, value: any) => {
          handleStylesChange({
            ...websiteStyles,
            [field]: value
          });
        };

        const colorPresets = [
          "#ffffff", "#f5ebe6", "#ecc3bf", "#d7b9b9", "#ffd700", "#b58d3d", "#eccfa8", 
          "#5a0600", "#1c0200", "#a16b60", "#c084fc", "#60a5fa", "#34d399", "#f87171"
        ];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" id="unified-style-customizer">
            <div className="bg-[#1c0200]/98 backdrop-blur-md border border-[#d7b9b9]/30 rounded-xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5 text-white animate-scale-up">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#d7b9b9]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-[#d7b9b9]" />
                  <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-[#d7b9b9]">
                    Rias Gaya: {name}
                  </h3>
                </div>
                <button 
                  onClick={() => setEditingStyleElement(null)}
                  className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                  title="Tutup"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin">
                
                {/* Specific logo fields */}
                {key === 'logo' && (
                  <>
                    {/* Logo Type Selector */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Jenis Logo Utama</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleFieldChange('logoType', 'text')}
                          className={`flex-1 py-1.5 rounded text-xs font-serif uppercase tracking-wider border transition-all cursor-pointer ${websiteStyles.logoType === 'text' ? 'bg-[#d7b9b9] text-[#430400] border-[#d7b9b9] font-semibold shadow' : 'border-white/15 text-white/70 hover:bg-white/5'}`}
                        >
                          Teks Sahaja
                        </button>
                        <button 
                          onClick={() => handleFieldChange('logoType', 'image')}
                          className={`flex-1 py-1.5 rounded text-xs font-serif uppercase tracking-wider border transition-all cursor-pointer ${websiteStyles.logoType === 'image' ? 'bg-[#d7b9b9] text-[#430400] border-[#d7b9b9] font-semibold shadow' : 'border-white/15 text-white/70 hover:bg-white/5'}`}
                        >
                          Imej Grafik
                        </button>
                      </div>
                    </div>

                    {websiteStyles.logoType === 'image' ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Pautan Imej Logo</span>
                        <input 
                          type="text"
                          value={websiteStyles.logoImageUrl || ""}
                          onChange={(e) => handleFieldChange('logoImageUrl', e.target.value)}
                          placeholder="Masukkan pautan gambar (cth: https://...)"
                          className="w-full bg-black/40 border border-[#d7b9b9]/20 rounded-md px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-[#d7b9b9]/50"
                        />
                        <p className="text-[10px] text-white/40 leading-relaxed italic">
                          Tips: Gunakan pautan gambar kekal. Elakkan pautan Discord sementara yang tamat tempoh.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Gaya Penulisan Teks Logo</span>
                        
                        {/* Font Weight */}
                        <div className="grid grid-cols-4 gap-1">
                          {(['normal', 'medium', 'semibold', 'bold'] as const).map((wt) => (
                            <button
                              key={wt}
                              onClick={() => handleFieldChange('logoWeight', wt)}
                              className={`px-1 py-1 rounded text-[10px] font-serif capitalize border transition-all cursor-pointer ${websiteStyles.logoWeight === wt ? 'bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]' : 'border-white/10 text-white/70 hover:bg-white/5'}`}
                            >
                              {wt === 'normal' ? 'Regular' : wt}
                            </button>
                          ))}
                        </div>

                        {/* Font Style Italic */}
                        <div className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5 mt-1">
                          <span className="text-[11px] text-white/70">Tulisan Condong (Italic)</span>
                          <button
                            onClick={() => handleFieldChange('logoStyle', websiteStyles.logoStyle === 'italic' ? 'normal' : 'italic')}
                            className={`px-3 py-0.5 rounded text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${websiteStyles.logoStyle === 'italic' ? 'bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]' : 'border-white/10 text-white/70 hover:bg-white/5'}`}
                          >
                            Condong
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Specific logo/lambang under cursive fields */}
                {key === 'cursiveLogo' && (
                  <div className="bg-black/25 p-3.5 rounded-lg border border-white/5 space-y-3.5">
                    <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#d7b9b9] border-b border-white/5 pb-1 flex items-center gap-1">
                      <Sparkles size={11} /> Lambang / Logo Di Bawah Teks Puitis
                    </h4>
                    
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-white/70 block">Pautan Imej Lambang (.png/jpg/svg)</span>
                      <input 
                        type="text"
                        value={websiteStyles.logoUnderCursiveUrl || ""}
                        onChange={(e) => handleFieldChange('logoUnderCursiveUrl', e.target.value)}
                        placeholder="Masukkan URL imej lambang"
                        className="w-full bg-black/40 border border-[#d7b9b9]/25 rounded px-2.5 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-[#d7b9b9]/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/70">Tinggi Lambang</span>
                        <span className="text-[10px] font-mono text-[#d7b9b9] bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{websiteStyles.logoUnderCursiveSize || "64px"}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-black/20 p-2 rounded border border-white/5">
                        <input 
                          type="range"
                          min="20"
                          max="250"
                          value={parseInt(websiteStyles.logoUnderCursiveSize || "64") || 64}
                          onChange={(e) => handleFieldChange('logoUnderCursiveSize', `${e.target.value}px`)}
                          className="flex-1 accent-[#d7b9b9] h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={websiteStyles.logoUnderCursiveSize || "64px"}
                          onChange={(e) => handleFieldChange('logoUnderCursiveSize', e.target.value)}
                          placeholder="64px"
                          className="w-14 bg-black/40 border border-white/10 rounded px-1 text-center font-mono text-[10px] py-0.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Specific Iframe Embed fields */}
                {key === 'embed' && (
                  <div className="bg-black/25 p-3.5 rounded-lg border border-white/5 space-y-3.5">
                    <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#d7b9b9] border-b border-white/5 pb-1 flex items-center gap-1.5">
                      <Scroll size={11} className="text-[#d7b9b9]" /> Kandungan Terbenam (Iframe Embed)
                    </h4>
                    
                    <div className="flex items-center justify-between bg-black/10 p-2 rounded border border-white/5">
                      <span className="text-[10px] text-white/70">Aktifkan Kandungan Terbenam</span>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('embedIframeEnabled', !websiteStyles.embedIframeEnabled)}
                        className={`px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider border font-semibold transition-all cursor-pointer ${
                          websiteStyles.embedIframeEnabled ? "bg-[#d7b9b9] text-[#430400] border-[#d7b9b9]" : "border-white/10 text-white/55 hover:bg-white/5"
                        }`}
                      >
                        {websiteStyles.embedIframeEnabled ? "Aktif" : "Mati"}
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-white/70">Tajuk Bahagian</span>
                      <input 
                        type="text"
                        value={websiteStyles.embedIframeTitle || ""}
                        onChange={(e) => handleFieldChange('embedIframeTitle', e.target.value)}
                        placeholder="Cth: Pratonton Karya"
                        className="w-full bg-black/40 border border-[#d7b9b9]/25 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d7b9b9]/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-white/70">Kelebaran (Width)</span>
                        <select
                          value={websiteStyles.embedIframeWidth || "max-w-2xl"}
                          onChange={(e) => handleFieldChange('embedIframeWidth', e.target.value)}
                          className="w-full bg-black/40 border border-[#d7b9b9]/25 rounded px-2 py-1 font-serif text-[11px] text-white focus:outline-none focus:border-[#d7b9b9]/50"
                        >
                          <option value="max-w-sm" className="bg-[#120101]">Kecil (max-w-sm)</option>
                          <option value="max-w-md" className="bg-[#120101]">Sederhana Kecil</option>
                          <option value="max-w-lg" className="bg-[#120101]">Sederhana</option>
                          <option value="max-w-xl" className="bg-[#120101]">Sederhana Luas</option>
                          <option value="max-w-2xl" className="bg-[#120101]">Lalai Seimbang</option>
                          <option value="max-w-3xl" className="bg-[#120101]">Lebar</option>
                          <option value="max-w-5xl" className="bg-[#120101]">Sangat Lebar</option>
                          <option value="max-w-full" className="bg-[#120101]">Penuh</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-white/70">Ketinggian (Height)</span>
                        <input 
                          type="text"
                          value={websiteStyles.embedIframeHeight || "480px"}
                          onChange={(e) => handleFieldChange('embedIframeHeight', e.target.value)}
                          placeholder="Cth: 480px"
                          className="w-full bg-black/40 border border-[#d7b9b9]/25 rounded px-2 py-1 font-mono text-[11px] text-white focus:outline-none focus:border-[#d7b9b9]/50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="embedIframePlayOnly"
                        checked={websiteStyles.embedIframePlayOnly || false}
                        onChange={(e) => handleFieldChange("embedIframePlayOnly", e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-black/40 border border-[#d7b9b9]/30 text-[#d7b9b9] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <label htmlFor="embedIframePlayOnly" className="text-xs text-white/90 cursor-pointer select-none font-serif">
                        Kecilkan pemain (Hanya tunjukkan butang PLAY bulat)
                      </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-white/70">Kod Iframe / Pautan Terus</span>
                      <textarea 
                        value={websiteStyles.embedIframeCode || ""}
                        onChange={(e) => handleFieldChange('embedIframeCode', e.target.value)}
                        placeholder='Cth: <iframe src="https://drive.google.com/.../preview"></iframe>'
                        rows={3}
                        className="w-full bg-black/40 border border-[#d7b9b9]/25 rounded px-2.5 py-1.5 font-mono text-[10px] text-white focus:outline-none focus:border-[#d7b9b9]/50 resize-none leading-normal"
                      />
                      <p className="text-[9px] text-[#d7b9b9]/60 leading-normal font-serif">
                        Tampal kod iframe atau URL fail Google Drive preview anda. Sistem menyelaraskan paparan automatik supaya sentiasa responsif di mobile.
                      </p>
                    </div>
                  </div>
                )}

                {/* Specific Icon Selectors for Launch & Publisher */}
                {key === 'launch' && (
                  <div className="flex flex-col gap-3 bg-black/25 p-3 rounded-lg border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Pautan Logo Imej Tersuai</span>
                      <input 
                        type="text"
                        value={websiteStyles.launchIconUrl || ""}
                        onChange={(e) => handleFieldChange('launchIconUrl', e.target.value)}
                        placeholder="Cth: https://pautan-logo-anda.png"
                        className="w-full bg-black/40 border border-[#d7b9b9]/25 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d7b9b9]/50 font-sans"
                      />
                      <p className="text-[9px] text-white/40 leading-normal font-serif">
                        Tampal URL gambar logo sah.malians.group anda (PNG telus disyorkan). Jika kosong, ia akan memapar semula ikon di bawah.
                      </p>
                    </div>

                    {/* Sizing & Offset Y */}
                    <div className="border-t border-white/5 pt-2 flex flex-col gap-2.5">
                      <span className="text-[10px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Ubah Saiz & Kedudukan Vertikal</span>
                      
                      {/* Size */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/50">Saiz / Tinggi Logo</span>
                          <span className="font-mono text-white/80 bg-black/30 px-1 py-0.5 rounded">{websiteStyles.launchIconSize || '24px'}</span>
                        </div>
                        <input 
                          type="range"
                          min="8"
                          max="80"
                          value={parseInt(websiteStyles.launchIconSize || "24") || 24}
                          onChange={(e) => handleFieldChange('launchIconSize', `${e.target.value}px`)}
                          className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Y-Offset */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/50">Kedudukan Vertikal (Saras)</span>
                          <span className="font-mono text-white/80 bg-black/30 px-1 py-0.5 rounded">{websiteStyles.launchIconYOffset || '0px'}</span>
                        </div>
                        <input 
                          type="range"
                          min="-25"
                          max="25"
                          value={parseInt(websiteStyles.launchIconYOffset || "0") || 0}
                          onChange={(e) => handleFieldChange('launchIconYOffset', `${e.target.value}px`)}
                          className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-2 flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Ikon Alternatif (Jika tiada Imej)</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: "Scroll", value: "Scroll" },
                          { name: "Feather", value: "Feather" },
                          { name: "Compass", value: "Compass" },
                          { name: "Globe", value: "Globe" },
                          { name: "Sparkles", value: "Sparkles" },
                          { name: "PenTool", value: "PenTool" },
                          { name: "BookOpen", value: "BookOpen" },
                          { name: "Book", value: "Book" }
                        ].map((ic) => (
                          <button
                            key={ic.value}
                            type="button"
                            onClick={() => handleFieldChange('launchIcon', ic.value)}
                            className={`flex flex-col items-center justify-center p-2 rounded border gap-1 transition-all cursor-pointer ${
                              (websiteStyles.launchIcon || "Scroll") === ic.value
                                ? 'bg-[#d7b9b9]/20 border-[#d7b9b9] text-[#d7b9b9]'
                                : 'border-white/5 text-white/60 hover:bg-white/5'
                            }`}
                            title={ic.name}
                          >
                            {renderBrandIcon(ic.value, "Scroll", 16, (websiteStyles.launchIcon || "Scroll") === ic.value ? websiteStyles.accentColor : "#ffffff")}
                            <span className="text-[8px] tracking-tight">{ic.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {key === 'publisher' && (
                  <div className="flex flex-col gap-3 bg-black/25 p-3 rounded-lg border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Pautan Logo Imej Tersuai</span>
                      <input 
                        type="text"
                        value={websiteStyles.publisherIconUrl || ""}
                        onChange={(e) => handleFieldChange('publisherIconUrl', e.target.value)}
                        placeholder="Cth: https://pautan-logo-anda.png"
                        className="w-full bg-black/40 border border-[#d7b9b9]/25 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d7b9b9]/50 font-sans"
                      />
                      <p className="text-[9px] text-white/40 leading-normal font-serif">
                        Tampal URL gambar logo Maktabah Kutawiyyah anda. Pada asalnya disetkan ke logo transparent daripada postimg.cc anda.
                      </p>
                    </div>

                    {/* Sizing & Offset Y */}
                    <div className="border-t border-white/5 pt-2 flex flex-col gap-2.5">
                      <span className="text-[10px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Ubah Saiz & Kedudukan Vertikal</span>
                      
                      {/* Size */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/50">Saiz / Tinggi Logo</span>
                          <span className="font-mono text-white/80 bg-black/30 px-1 py-0.5 rounded">{websiteStyles.publisherIconSize || '24px'}</span>
                        </div>
                        <input 
                          type="range"
                          min="8"
                          max="80"
                          value={parseInt(websiteStyles.publisherIconSize || "24") || 24}
                          onChange={(e) => handleFieldChange('publisherIconSize', `${e.target.value}px`)}
                          className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Y-Offset */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/50">Kedudukan Vertikal (Saras)</span>
                          <span className="font-mono text-white/80 bg-black/30 px-1 py-0.5 rounded">{websiteStyles.publisherIconYOffset || '0px'}</span>
                        </div>
                        <input 
                          type="range"
                          min="-25"
                          max="25"
                          value={parseInt(websiteStyles.publisherIconYOffset || "0") || 0}
                          onChange={(e) => handleFieldChange('publisherIconYOffset', `${e.target.value}px`)}
                          className="w-full accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-2 flex flex-col gap-1.5">
                      <span className="text-[10px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Ikon Alternatif (Jika tiada Imej)</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: "Library", value: "Library" },
                          { name: "Book", value: "Book" },
                          { name: "BookOpen", value: "BookOpen" },
                          { name: "Bookmark", value: "Bookmark" },
                          { name: "Award", value: "Award" },
                          { name: "Heart", value: "Heart" },
                          { name: "Globe", value: "Globe" },
                          { name: "Sparkles", value: "Sparkles" }
                        ].map((ic) => (
                          <button
                            key={ic.value}
                            type="button"
                            onClick={() => handleFieldChange('publisherIcon', ic.value)}
                            className={`flex flex-col items-center justify-center p-2 rounded border gap-1 transition-all cursor-pointer ${
                              (websiteStyles.publisherIcon || "Library") === ic.value
                                ? 'bg-[#d7b9b9]/20 border-[#d7b9b9] text-[#d7b9b9]'
                                : 'border-white/5 text-white/60 hover:bg-white/5'
                            }`}
                            title={ic.name}
                          >
                            {renderBrandIcon(ic.value, "Library", 16, (websiteStyles.publisherIcon || "Library") === ic.value ? websiteStyles.accentColor : "#ffffff")}
                            <span className="text-[8px] tracking-tight">{ic.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Font Selector */}
                {fontKey && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Pilih Jenis Fon</span>
                    <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                      {AVAILABLE_FONTS.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => handleFieldChange(fontKey!, font.value)}
                          className={`px-2 py-1.5 rounded text-[10px] font-serif text-left border transition-all cursor-pointer ${
                            currentFont === font.value 
                              ? 'bg-[#d7b9b9] text-[#430400] border-[#d7b9b9] font-medium shadow' 
                              : 'border-white/10 text-white/80 hover:bg-white/5'
                          }`}
                          style={{ fontFamily: font.value }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {sizeKey && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">
                         Saiz Tulisan / Saiz Logo
                      </span>
                      <span className="font-mono text-xs text-white/60 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">
                        {currentSize || '16px'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded border border-white/5">
                      <input 
                        type="range"
                        min="8"
                        max="140"
                        value={parseInt(currentSize) || 16}
                        onChange={(e) => handleFieldChange(sizeKey!, `${e.target.value}px`)}
                        className="flex-1 accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={currentSize}
                        onChange={(e) => handleFieldChange(sizeKey!, e.target.value)}
                        placeholder="16px"
                        className="w-14 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 font-mono text-[10px] text-center focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {colorKey && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">Pilih Warna Elemen</span>
                    
                    {/* Presets */}
                    <div className="grid grid-cols-7 gap-1 bg-black/20 p-2 rounded border border-white/5">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => handleFieldChange(colorKey!, preset)}
                          className={`w-full aspect-square rounded-full border border-black/40 transition-transform relative ${currentColor.toLowerCase() === preset.toLowerCase() ? 'scale-110 shadow-lg border-white/50' : 'hover:scale-105'}`}
                          style={{ backgroundColor: preset }}
                          title={preset}
                        >
                          {currentColor.toLowerCase() === preset.toLowerCase() && (
                            <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold drop-shadow">✓</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Color Input */}
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-white/5">
                      <span className="text-[10px] text-white/50 font-serif">Warna Tersuai (Custom Color)</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color"
                          value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : "#ffffff"}
                          onChange={(e) => handleFieldChange(colorKey!, e.target.value)}
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={currentColor}
                          onChange={(e) => handleFieldChange(colorKey!, e.target.value)}
                          placeholder="#ffffff"
                          className="w-20 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 font-mono text-xs text-center focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}

                 {/* Spacing Selector */}
                {spacingKey && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">
                        {key === 'aboveLogo' ? "Jarak Bawah ke Logo (Margin Bawah)" : "Jarak Sempadan (Margin Spacing)"}
                      </span>
                      <span className="font-mono text-xs text-white/60 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">
                        {currentSpacing || "24px"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded border border-white/5">
                      <input 
                        type="range"
                        min="0"
                        max="160"
                        value={parseInt(currentSpacing) || 24}
                        onChange={(e) => handleFieldChange(spacingKey!, `${e.target.value}px`)}
                        className="flex-1 accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={currentSpacing}
                        onChange={(e) => handleFieldChange(spacingKey!, e.target.value)}
                        placeholder="24px"
                        className="w-14 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 font-mono text-[10px] text-center focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tambahan khas untuk aboveLogo: Jarak ke Kepala Halaman (spacingPageTop) */}
                {key === 'aboveLogo' && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#d7b9b9]/80 uppercase tracking-wider font-semibold">
                        Jarak Atas ke Kepala Halaman / Tab
                      </span>
                      <span className="font-mono text-xs text-white/60 bg-[#1c0200]/50 px-1.5 py-0.5 rounded border border-white/5">
                        {websiteStyles.spacingPageTop || "112px"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded border border-white/5">
                      <input 
                        type="range"
                        min="10"
                        max="320"
                        value={parseInt(websiteStyles.spacingPageTop || "112") || 112}
                        onChange={(e) => handleFieldChange('spacingPageTop', `${e.target.value}px`)}
                        className="flex-1 accent-[#d7b9b9] h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={websiteStyles.spacingPageTop || "112px"}
                        onChange={(e) => handleFieldChange('spacingPageTop', e.target.value)}
                        placeholder="112px"
                        className="w-14 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 font-mono text-[10px] text-center focus:outline-none"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-[#d7b9b9]/15 pt-4 font-serif">
                <button
                  onClick={() => setEditingStyleElement(null)}
                  className="w-full py-2 bg-[#d7b9b9] hover:bg-[#c5a059] text-[#430400] font-semibold rounded text-xs uppercase tracking-wider transition-all text-center cursor-pointer shadow-lg"
                >
                  Selesai & Simpan
                </button>
              </div>

            </div>
          </div>
        );
      })()}
      {/* Background Ambient Audio Player */}
      {websiteStyles.audioEnabled && websiteStyles.audioUrl && (
        <AmbientAudioPlayer 
          audioUrl={websiteStyles.audioUrl}
          audioTitle={websiteStyles.audioTitle}
          audioEnabled={websiteStyles.audioEnabled}
          accentColor={websiteStyles.accentColor}
          bodyFont={websiteStyles.bodyFont}
        />
      )}
      
    </div>
  );
}
