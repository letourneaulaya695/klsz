import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DinoSticker, DINO_STICKERS_DATA } from '../data';
import DinosaurDino from './DinosaurDino';
import { Sparkles, Trash2, Award, Volume2, Cloud, RotateCcw } from 'lucide-react';

interface DinoParkProps {
  unlockedStickers: string[]; // list of unlocked sticker IDs
  onPlaySound: (text: string) => void;
}

interface PlacedSticker {
  uniqueId: string;
  sticker: DinoSticker;
  x: number; // percentage width
  y: number; // percentage height
  scale: number;
}

export default function DinoPark({ unlockedStickers, onPlaySound }: DinoParkProps) {
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [selectedInPark, setSelectedInPark] = useState<string | null>(null);

  // Default to unlock Dino T-Rex for everybody so the user has something to play with immediately!
  const currentUnlocked = unlockedStickers.length > 0 ? unlockedStickers : ['sticker-1'];

  const addStickerToPark = (sticker: DinoSticker) => {
    const newItem: PlacedSticker = {
      uniqueId: `placed-${Date.now()}-${Math.random()}`,
      sticker,
      x: 20 + Math.random() * 60, // random center area
      y: 40 + Math.random() * 40,
      scale: 0.8 + Math.random() * 0.4
    };
    setPlacedStickers(prev => [...prev, newItem]);
    
    // Play roar/encouragement standard voice
    onPlaySound(`${sticker.name}来啦！${sticker.roarText}`);
  };

  const removeSticker = (uniqueId: string) => {
    setPlacedStickers(prev => prev.filter(s => s.uniqueId !== uniqueId));
    setSelectedInPark(null);
  };

  const clearPark = () => {
    setPlacedStickers([]);
    setSelectedInPark(null);
  };

  const speakStickerInfo = (sticker: DinoSticker) => {
    onPlaySound(`${sticker.name}。${sticker.description}`);
  };

  return (
    <div className="bg-gradient-to-b from-sky-100 to-emerald-50 rounded-3xl border-8 border-emerald-200 overflow-hidden shadow-xl p-5 relative select-none">
      
      {/* Title & Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3 border-b-2 border-emerald-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 p-2.5 rounded-2xl shadow-sm animate-bounce">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-emerald-800 tracking-wide font-sans">
              🦖 我的恐龙乐园 (Sticker Park)
            </h2>
            <p className="text-xs text-emerald-600 font-medium">
              学完字奖励贴纸！点击贴纸放进乐园，双击或者选定小恐龙可以听它们说话哦！
            </p>
          </div>
        </div>
        
        {/* Statistics and Clean Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            已收集 ✨ {currentUnlocked.length} / {DINO_STICKERS_DATA.length} 个图鉴
          </span>
          {placedStickers.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={clearPark}
              className="flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-full border border-rose-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              清空乐园
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Interactive Sandbox Stage Canvas */}
      <div className="w-full h-80 md:h-[400px] bg-gradient-to-b from-sky-200 via-indigo-50 to-emerald-100 rounded-2xl relative overflow-hidden border-4 border-white shadow-inner mb-6">
        
        {/* Nice nature elements built using simple styles and SVGs */}
        {/* Fluffy clouds drifting */}
        <motion.div 
          animate={{ x: [-40, 420] }} 
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} 
          className="absolute top-8 left-10 text-white/50 pointer-events-none"
        >
          <Cloud className="w-10 h-10 fill-white/30" />
        </motion.div>
        
        <motion.div 
          animate={{ x: [360, -80] }} 
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} 
          className="absolute top-16 right-16 text-white/40 pointer-events-none"
        >
          <Cloud className="w-14 h-14 fill-white/20" />
        </motion.div>

        {/* Big cartoon Volcano of Dinosaur land */}
        <div className="absolute bottom-16 right-12 w-32 h-28 pointer-events-none opacity-80">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            <polygon points="50,10 10,80 90,80" fill="#CD7F32" />
            <ellipse cx="50" cy="15" rx="10" ry="5" fill="#E74C3C" />
            {/* Lava stream */}
            <path d="M 45 15 Q 40 40 45 60 Q 50 60 48 30 Z" fill="#FF5733" />
            <path d="M 50 15 Q 55 35 52 50 Q 56 45 54 20 Z" fill="#FFC300" />
          </svg>
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-full blur-sm animate-ping" />
        </div>

        {/* Cute primeval lake river */}
        <div className="absolute bottom-0 left-0 w-1/3 h-16 bg-sky-300 rounded-tr-full opacity-60 pointer-events-none">
          <div className="w-full h-full bg-sky-200 rounded-tr-full animate-pulse opacity-40" />
        </div>

        {/* Soft Green grass fields/clover layers */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-emerald-400 border-t-4 border-emerald-300 pointer-events-none">
          <div className="absolute top-2 left-6 bg-lime-300 w-12 h-4 rounded-full opacity-60" />
          <div className="absolute top-5 right-24 bg-lime-300 w-16 h-5 rounded-full opacity-60" />
          <div className="absolute top-8 left-1/3 bg-lime-300 w-14 h-4 rounded-full opacity-60" />
        </div>

        {/* Placed dinosaur stickers with drag / interact capabilities */}
        {placedStickers.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-amber-500 opacity-60 text-5xl mb-3"
            >
              🦕
            </motion.div>
            <p className="text-gray-500 text-sm font-semibold">
              这里是你的小乐园！快点击下方的恐龙贴纸，
            </p>
            <p className="text-emerald-600 text-xs font-bold mt-1">
              把它们放进树林里玩耍吧！
            </p>
          </div>
        ) : (
          placedStickers.map((ps) => {
            const isSelected = selectedInPark === ps.uniqueId;
            return (
              <motion.div
                key={ps.uniqueId}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: ps.scale, opacity: 1 }}
                style={{ 
                  left: `${ps.x}%`, 
                  top: `${ps.y}%`,
                  zIndex: isSelected ? 40 : 10 
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInPark(ps.uniqueId);
                  speakStickerInfo(ps.sticker);
                }}
              >
                {/* Active selector box */}
                <div 
                  className={`p-1.5 rounded-3xl transition-all ${
                    isSelected 
                      ? 'bg-amber-100/90 border-4 border-amber-400 shadow-lg scale-110' 
                      : 'border-4 border-transparent hover:border-emerald-300/60'
                  }`}
                >
                  <DinosaurDino 
                    state="correct" 
                    dinoType={ps.sticker.svgType} 
                    scale={0.65} 
                    customBubbleText={isSelected ? ps.sticker.roarText : null}
                  />

                  {/* Immediate delete option if selected */}
                  {isSelected && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSticker(ps.uniqueId);
                      }}
                      className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1.5 hover:bg-rose-600 shadow-md border-2 border-white cursor-pointer z-50 pointer-events-auto"
                      title="取回贴纸"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Grid List of Earned/Unlocked Stickers */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-4 border-emerald-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5 justify-between">
          <span className="flex items-center gap-1.5 text-amber-700">
            <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
            我的恐龙收藏贴纸 (点击放入乐园进行互动)
          </span>
          <span className="text-xs text-gray-400 font-medium">解锁新贴纸，让乐园热闹起来吧！</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {DINO_STICKERS_DATA.map((sticker) => {
            const isUnlocked = currentUnlocked.includes(sticker.id);
            return (
              <motion.button
                key={sticker.id}
                whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                disabled={!isUnlocked}
                onClick={() => addStickerToPark(sticker)}
                className={`flex flex-col items-center justify-between p-3 rounded-2xl border-4 text-center transition-all relative ${
                  isUnlocked 
                    ? 'bg-emerald-50 hover:bg-emerald-100/50 border-emerald-200 cursor-pointer text-emerald-900 shadow-sm' 
                    : 'bg-gray-100 border-gray-200 text-gray-400 select-none opacity-60'
                }`}
              >
                {/* SVG avatar representation */}
                <div className="w-16 h-16 flex items-center justify-center p-0.5 pointer-events-none">
                  {isUnlocked ? (
                    <DinosaurDino state="correct" dinoType={sticker.svgType} scale={0.45} />
                  ) : (
                    // Lock icon over grayscale dino representation
                    <div className="relative w-full h-full flex items-center justify-center grayscale opacity-45">
                      <DinosaurDino state="unread" dinoType={sticker.svgType} scale={0.45} />
                      <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-extrabold text-2xl drop-shadow-sm">
                        🔒
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center w-full">
                  <span className={`block text-xs font-bold truncate ${isUnlocked ? 'text-gray-800' : 'text-gray-400 font-medium'}`}>
                    {sticker.name}
                  </span>
                  <span className="block text-[10px] text-gray-400 font-semibold truncate leading-3 mt-0.5">
                    {sticker.type}
                  </span>
                </div>

                {/* Sparkling tiny award element */}
                {isUnlocked && (
                  <div className="absolute top-1 right-1 bg-amber-400 text-white p-0.5 rounded-full" title="已解锁">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
