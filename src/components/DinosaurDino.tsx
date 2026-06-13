import React from 'react';
import { motion } from 'motion/react';

interface DinosaurDinoProps {
  state: 'unread' | 'correct' | 'incorrect';
  customBubbleText?: string | null;
  dinoType?: 't-rex' | 'triceratops' | 'stegosaurus' | 'pterodactyl' | 'brachiosaurus' | 'ankylosaurus';
  scale?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export default function DinosaurDino({
  state,
  customBubbleText,
  dinoType = 't-rex',
  scale = 1,
  interactive = false,
  onClick
}: DinosaurDinoProps) {
  
  // Decide rendering parameters based on states
  const isSmile = state === 'correct';
  const isShake = state === 'incorrect';
  const isIdle = state === 'unread';

  // Head shaking animation for incorrect
  const shakeAnimation = {
    x: isShake ? [0, -12, 12, -12, 12, -8, 8, 0] : 0,
    transition: { duration: 0.6, ease: 'easeInOut' }
  };

  // Bouncing/jumping animation for success
  const bounceAnimation = {
    y: isSmile ? [0, -25, 0, -15, 0] : [0, -4, 0],
    rotate: isSmile ? [0, -5, 5, -5, 0] : 0,
    transition: isSmile 
      ? { duration: 0.8, ease: 'easeInOut' }
      : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  };

  const renderDinosaurSVG = () => {
    switch (dinoType) {
      case 'triceratops':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Frill/Shield */}
            <path d="M 40 100 C 30 70, 70 30, 100 30 C 130 30, 170 70, 160 100 C 175 120, 170 140, 140 150 C 110 160, 90 160, 60 150 C 30 140, 25 120, 40 100 Z" fill="#6BCB77" />
            
            {/* Frill spikes */}
            <circle cx="50" cy="65" r="8" fill="#4D96FF" />
            <circle cx="75" cy="40" r="8" fill="#4D96FF" />
            <circle cx="100" cy="30" r="8" fill="#4D96FF" />
            <circle cx="125" cy="40" r="8" fill="#4D96FF" />
            <circle cx="150" cy="65" r="8" fill="#4D96FF" />

            {/* Back Body & Feet */}
            <path d="M 120 120 Q 170 120 180 150 L 165 170 L 140 170 L 130 155 Z" fill="#59B565" />
            {/* Tail */}
            <path d="M 175 145 C 195 140, 205 160, 195 165 C 185 170, 170 160, 170 155 Z" fill="#59B565" />

            {/* Head */}
            <circle cx="100" cy="110" r="45" fill="#6BCB77" />

            {/* Horns */}
            {/* Left Horn */}
            <path d="M 75 80 L 55 50 Q 75 60 81 76 Z" fill="#F9F5EB" stroke="#59B565" strokeWidth="2" />
            {/* Right Horn */}
            <path d="M 125 80 L 145 50 Q 125 60 119 76 Z" fill="#F9F5EB" stroke="#59B565" strokeWidth="2" />
            {/* Nose Horn */}
            <path d="M 100 130 L 100 145 Q 105 138 108 132 Z" fill="#F9F5EB" stroke="#59B565" strokeWidth="2" />

            {/* Eyes */}
            {isSmile ? (
              <>
                {/* Happy eyes */}
                <path d="M 73 105 Q 83 95 93 105" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
                <path d="M 107 105 Q 117 95 127 105" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Round big eyes */}
                <circle cx="83" cy="105" r="8" fill="#2C3E50" />
                <circle cx="81" cy="103" r="3" fill="#FFFFFF" />
                <circle cx="117" cy="105" r="8" fill="#2C3E50" />
                <circle cx="115" cy="103" r="3" fill="#FFFFFF" />
              </>
            )}

            {/* Cheeks blush */}
            <circle cx="72" cy="115" r="6" fill="#FF8B8B" opacity="0.6" />
            <circle cx="128" cy="115" r="6" fill="#FF8B8B" opacity="0.6" />

            {/* Mouth */}
            {isSmile ? (
              <path d="M 90 125 Q 100 140 110 125" fill="#E74C3C" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            ) : isShake ? (
              <path d="M 92 128 Q 100 120 108 128" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <path d="M 93 126 Q 100 132 107 126" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            )}
            
            {/* Front feet */}
            <rect x="75" y="150" width="18" height="25" rx="9" fill="#59B565" />
            <rect x="107" y="150" width="18" height="25" rx="9" fill="#59B565" />
          </svg>
        );

      case 'stegosaurus':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Spikes/Plates on back - glowing red */}
            <path d="M 50 100 Q 60 70 70 90 Q 85 55 100 85 Q 115 50 130 90 Q 145 65 155 105" fill="#FF6B6B" />
            <path d="M 40 105 Q 45 80 55 100 Q 155 100 165 125" fill="#FFA4A4" />

            {/* Main Body */}
            <path d="M 45 130 C 45 90, 155 90, 155 130 C 155 145, 140 160, 100 163 C 60 160, 45 145, 45 130 Z" fill="#4D96FF" />

            {/* Tail & Tail Spikes */}
            <path d="M 150 135 Q 185 142 195 135 Q 180 155 150 150 Z" fill="#4D96FF" />
            <path d="M 180 132 L 195 120 L 184 138" fill="#F9F5EB" stroke="#4D96FF" strokeWidth="2" />
            <path d="M 188 140 L 202 145 L 188 147" fill="#F9F5EB" stroke="#4D96FF" strokeWidth="2" />

            {/* Head (reaching out horizontally) */}
            <path d="M 50 120 Q 20 115 25 135 Q 35 145 50 135 Z" fill="#4D96FF" />

            {/* Eyes */}
            {isSmile ? (
              <path d="M 28 126 Q 32 121 36 126" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="32" cy="126" r="4" fill="#2C3E50" />
                <circle cx="31" cy="125" r="1.5" fill="#FFFFFF" />
              </>
            )}

            {/* Mouth */}
            {isSmile ? (
              <path d="M 24 135 Q 29 139 32 134" fill="none" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <line x1="24" y1="135" x2="29" y2="135" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
            )}

            {/* Cheek blush */}
            <circle cx="35" cy="131" r="3" fill="#FF8B8B" opacity="0.6" />

            {/* Chubby feet */}
            <rect x="65" y="150" width="20" height="25" rx="8" fill="#3A82EE" />
            <rect x="115" y="150" width="20" height="25" rx="8" fill="#3A82EE" />
          </svg>
        );

      case 'pterodactyl':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Flying wings */}
            <path d="M 100 100 C 60 70, 20 70, 15 105 C 35 110, 65 115, 100 120 Z" fill="#FCD14D" />
            <path d="M 100 100 C 140 70, 180 70, 185 105 C 165 110, 135 115, 100 120 Z" fill="#FCD14D" />

            {/* Little Body */}
            <ellipse cx="100" cy="125" rx="18" ry="30" fill="#FFE17D" />

            {/* Tail */}
            <path d="M 100 155 L 96 168 L 100 172 L 104 168 Z" fill="#FCD14D" />

            {/* Head */}
            <circle cx="100" cy="75" r="22" fill="#FFE17D" />
            {/* Crest on back of head */}
            <path d="M 100 53 Q 115 35 110 58 Z" fill="#FCD14D" />

            {/* Large beak */}
            <path d="M 88 80 L 50 86 Q 80 94 92 88 Z" fill="#FFAD33" />

            {/* Eyes */}
            {isSmile ? (
              <>
                <path d="M 94 72 Q 100 64 104 72" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
                <path d="M 104 72 Q 110 64 114 72" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="98" cy="73" r="4.5" fill="#2C3E50" />
                <circle cx="97" cy="71" r="1.5" fill="#FFFFFF" />
                <circle cx="110" cy="73" r="4.5" fill="#2C3E50" />
                <circle cx="109" cy="71" r="1.5" fill="#FFFFFF" />
              </>
            )}

            {/* Blush */}
            <circle cx="92" cy="79" r="4" fill="#FF8B8B" opacity="0.6" />
            <circle cx="114" cy="79" r="4" fill="#FF8B8B" opacity="0.6" />

            {/* Cute feet hanging */}
            <rect x="91" y="152" width="6" height="15" rx="3" fill="#FFAD33" />
            <rect x="103" y="152" width="6" height="15" rx="3" fill="#FFAD33" />
          </svg>
        );

      case 'brachiosaurus':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Big sturdy body */}
            <path d="M 45 150 C 45 120, 130 110, 140 145 C 145 160, 135 175, 95 175 C 55 175, 45 165, 45 150 Z" fill="#9772FB" />
            {/* Tail */}
            <path d="M 46 150 Q 15 152 20 162 Q 35 165 52 153 Z" fill="#8456F8" />

            {/* Long Graceful Neck */}
            <path d="M 115 130 C 135 110, 145 70, 142 45 L 122 45 C 122 70, 120 105, 95 135 Z" fill="#9772FB" />

            {/* Head */}
            <circle cx="132" cy="40" r="16" fill="#9772FB" />
            {/* Cute crown bump */}
            <ellipse cx="132" cy="24" rx="8" ry="4" fill="#8456F8" />

            {/* Eyes */}
            {isSmile ? (
              <path d="M 124 38 Q 128 32 132 38" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="127" cy="38" r="3.5" fill="#2C3E50" />
                <circle cx="126" cy="36.5" r="1.2" fill="#FFFFFF" />
              </>
            )}

            {/* Blush */}
            <circle cx="134" cy="43" r="3" fill="#FF8B8B" opacity="0.6" />

            {/* Smile under beak area */}
            {isSmile ? (
              <path d="M 120 45 Q 126 50 130 44" fill="none" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M 121 44 Q 125 47 129 44" fill="none" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
            )}

            {/* Long feet */}
            <rect x="62" y="160" width="16" height="22" rx="6" fill="#8456F8" />
            <rect x="105" y="160" width="16" height="22" rx="6" fill="#8456F8" />
          </svg>
        );

      case 'ankylosaurus':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Shield and spikes */}
            <ellipse cx="100" cy="135" rx="55" ry="32" fill="#2EB005" />
            {/* Spiky scale bumps on back */}
            <circle cx="70" cy="120" r="5" fill="#F7FF93" />
            <circle cx="90" cy="115" r="6" fill="#F7FF93" />
            <circle cx="110" cy="115" r="6" fill="#F7FF93" />
            <circle cx="130" cy="120" r="5" fill="#F7FF93" />
            
            <circle cx="65" cy="135" r="5" fill="#F7FF93" />
            <circle cx="85" cy="135" r="6" fill="#F7FF93" />
            <circle cx="100" cy="135" r="6" fill="#F7FF93" />
            <circle cx="115" cy="135" r="6" fill="#F7FF93" />
            <circle cx="135" cy="135" r="5" fill="#F7FF93" />

            {/* Heavy Shield Shell */}
            <path d="M 45 135 Q 100 95 155 135 Z" fill="#3EC70B" />

            {/* Tail with massive stone hammer */}
            <path d="M 148 140 Q 180 148 190 145 Z" fill="#3EC70B" stroke="#2EB005" strokeWidth="3" />
            <circle cx="188" cy="144" r="12" fill="#7C8B9C" />
            <line x1="178" y1="144" x2="198" y2="144" stroke="#5F7F9C" strokeWidth="2" />

            {/* Snout with Head */}
            <path d="M 54 135 C 54 115, 25 120, 25 138 C 25 148, 48 148, 54 135 Z" fill="#3EC70B" />

            {/* Little horns on head back */}
            <path d="M 48 122 L 40 115 L 48 126 Z" fill="#F7FF93" />

            {/* Eyes */}
            {isSmile ? (
              <path d="M 28 132 Q 32 126 36 132" fill="none" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="32" cy="132" r="3.5" fill="#2C3E50" />
                <circle cx="31" cy="130.5" r="1.2" fill="#FFFFFF" />
              </>
            )}

            {/* Mouth */}
            <path d="M 26 140 Q 30 143 34 140" fill="none" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />

            {/* Blush */}
            <circle cx="36" cy="137" r="2.5" fill="#FF8B8B" opacity="0.6" />

            {/* Strong short feet */}
            <rect x="68" y="155" width="18" height="15" rx="4" fill="#2EB005" />
            <rect x="114" y="155" width="18" height="15" rx="4" fill="#2EB005" />
          </svg>
        );

      case 't-rex':
      default:
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Tail */}
            <path d="M 50 145 C 5 145, 10 185, 30 170 C 50 155, 60 150, 60 145 Z" fill="#FF6F3D" />
            <path d="M 40 140 Q 25 152 20 162 Q 35 160 48 145 Z" fill="#FF8E53" />

            {/* Back Spikes for T-Rex */}
            <path d="M 55 130 L 45 125 L 53 120 L 44 112 L 52 108" stroke="#FFE17D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Big sturdy body & Feet */}
            <ellipse cx="90" cy="142" rx="42" fill="#FF7B54" />
            
            {/* Left giant foot */}
            <rect x="65" y="165" width="22" height="20" rx="7" fill="#E2542B" />
            {/* Right giant foot */}
            <rect x="95" y="165" width="22" height="20" rx="7" fill="#E2542B" />
            
            {/* Head (Big cartoon jaw) */}
            <path d="M 85 106 C 85 60, 165 60, 160 106 C 158 126, 128 126, 110 126 C 92 126, 85 118, 85 106 Z" fill="#FF7B54" />

            {/* Chest color */}
            <ellipse cx="110" cy="142" rx="20" ry="14" fill="#FFD56F" />

            {/* Eyes */}
            {isSmile ? (
              <>
                {/* Happy arcs */}
                <path d="M 112 90 Q 122 80 132 90" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
                <path d="M 137 90 Q 147 80 157 90" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : isShake ? (
              <>
                {/* Dizzier/Worried eyes */}
                <path d="M 114 93 L 126 87 M 114 87 L 126 93" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
                <path d="M 138 93 L 150 87 M 138 87 L 150 93" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Shiny round eyes */}
                <circle cx="122" cy="88" r="9" fill="#2C3E50" />
                <circle cx="120" cy="85" r="3.5" fill="#FFFFFF" />
                <circle cx="147" cy="88" r="9" fill="#2C3E50" />
                <circle cx="145" cy="85" r="3.5" fill="#FFFFFF" />
              </>
            )}

            {/* Cheek blushing */}
            <circle cx="110" cy="100" r="7" fill="#FF8B8B" opacity="0.6" />
            <circle cx="156" cy="100" r="7" fill="#FF8B8B" opacity="0.6" />

            {/* Mouth & Cute teeth */}
            {isSmile ? (
              <>
                <path d="M 118 114 Q 130 126 142 114" fill="#E74C3C" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
                {/* Little teeth */}
                <polygon points="122,114 125,118 128,114" fill="#FFFFFF" stroke="#2C3E50" strokeWidth="1" />
                <polygon points="132,114 135,118 138,114" fill="#FFFFFF" stroke="#2C3E50" strokeWidth="1" />
              </>
            ) : isShake ? (
              <path d="M 120 114 Q 130 108 140 114" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <path d="M 121 113 Q 131 118 141 113" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            )}

            {/* Cute short tiny T-Rex hands */}
            <path d="M 103 130 Q 112 135 106 142" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 108 132 Q 116 137 111 144" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`relative select-none flex flex-col items-center justify-center ${interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      style={{ transform: `scale(${scale})` }}
      onClick={onClick}
    >
      {/* Dynamic Cute Speech Bubble with round borders, cartoon vibe */}
      {customBubbleText && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.6, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -top-16 bg-white border-4 border-amber-200 px-5 py-3 rounded-3xl shadow-md max-w-[210px] text-center z-20"
        >
          <p className="text-sm font-bold text-gray-700 leading-tight">
            {customBubbleText}
          </p>
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-amber-200 rotate-45" />
        </motion.div>
      )}

      {/* Dinosaur body */}
      <motion.div
        animate={isShake ? shakeAnimation : bounceAnimation}
        className="w-48 h-48 flex items-center justify-center"
      >
        {renderDinosaurSVG()}
      </motion.div>
    </div>
  );
}
