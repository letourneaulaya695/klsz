import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pinyin } from 'pinyin-pro';
import { 
  DINO_LEVELS, 
  DINO_STICKERS_DATA, 
  DINO_QUIZ_PROMPTS, 
  GENTLE_ENCOURAGEMENTS, 
  WIN_CELEBRATIONS,
  CharacterItem
} from './data';
import DinosaurDino from './components/DinosaurDino';
import DinoPark from './components/DinoPark';
import { 
  Sparkles, 
  Volume2, 
  Mic, 
  MicOff, 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Info, 
  Award,
  HelpCircle,
  ChevronDown,
  LayoutGrid,
  MapPin,
  Trophy,
  Flame,
  Search,
  ListFilter
} from 'lucide-react';

export interface ReviewItem {
  word: string;
  levelNumber: number;
  wordIndex: number;
  pinyin: string;
  failures: number;
}

export default function App() {
  // Level & Word navigation State
  const [currentLevelNum, setCurrentLevelNum] = useState<number>(1); // 1 to 10
  const [currentWordIndexInLevel, setCurrentWordIndexInLevel] = useState<number>(0); // 0 to 299

  // Learning states
  const [learningState, setLearningState] = useState<'unread' | 'correct' | 'incorrect'>('unread');
  const [unlockedStickers, setUnlockedStickers] = useState<string[]>(['sticker-1']); // Start with T-Rex unlocked!
  const [score, setScore] = useState<number>(0);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizBubble, setQuizBubble] = useState<string | null>("哈啰！我是迪诺！今天我们一起来学汉字宝贝吧！");

  // Track correct characters inside each level for progress calculation
  // Key: word, Value: boolean
  const [masteredWords, setMasteredWords] = useState<Record<string, boolean>>({});

  // Review Book States
  const [reviewWords, setReviewWords] = useState<ReviewItem[]>([]);

  // Search and Map Overlays
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mic assessment & audio states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recogResult, setRecogResult] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [unlockedJustNow, setUnlockedJustNow] = useState<string | null>(null);
  const [alwaysShowPinyin, setAlwaysShowPinyin] = useState<boolean>(false);

  // References
  const recognitionRef = useRef<any>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load local state on Mount
  useEffect(() => {
    try {
      const storedMastered = localStorage.getItem('dino_mastered_words');
      if (storedMastered) {
        setMasteredWords(JSON.parse(storedMastered));
      }
      const storedReview = localStorage.getItem('dino_review_words');
      if (storedReview) {
        setReviewWords(JSON.parse(storedReview));
      }
      const storedScore = localStorage.getItem('dino_score');
      if (storedScore) {
        setScore(parseInt(storedScore, 10) || 0);
      }
      const storedStickers = localStorage.getItem('dino_unlocked_stickers');
      if (storedStickers) {
        setUnlockedStickers(JSON.parse(storedStickers));
      }
      const storedLevel = localStorage.getItem('dino_current_level');
      if (storedLevel) {
        setCurrentLevelNum(parseInt(storedLevel, 10) || 1);
      }
      const storedWordIdx = localStorage.getItem('dino_current_word_idx');
      if (storedWordIdx) {
        setCurrentWordIndexInLevel(parseInt(storedWordIdx, 10) || 0);
      }
    } catch (e) {
      console.warn("Failed to load local storage state:", e);
    }
  }, []);

  // Save local state on change
  useEffect(() => {
    try {
      if (Object.keys(masteredWords).length > 0) {
        localStorage.setItem('dino_mastered_words', JSON.stringify(masteredWords));
      }
    } catch (e) {}
  }, [masteredWords]);

  useEffect(() => {
    try {
      localStorage.setItem('dino_review_words', JSON.stringify(reviewWords));
    } catch (e) {}
  }, [reviewWords]);

  useEffect(() => {
    try {
      if (score > 0) {
        localStorage.setItem('dino_score', score.toString());
      }
    } catch (e) {}
  }, [score]);

  useEffect(() => {
    try {
      if (unlockedStickers.length > 1) {
        localStorage.setItem('dino_unlocked_stickers', JSON.stringify(unlockedStickers));
      }
    } catch (e) {}
  }, [unlockedStickers]);

  useEffect(() => {
    try {
      localStorage.setItem('dino_current_level', currentLevelNum.toString());
    } catch (e) {}
  }, [currentLevelNum]);

  useEffect(() => {
    try {
      localStorage.setItem('dino_current_word_idx', currentWordIndexInLevel.toString());
    } catch (e) {}
  }, [currentWordIndexInLevel]);

  // Derive active level configuration
  const activeLevel = DINO_LEVELS[currentLevelNum - 1] || DINO_LEVELS[0];

  // Helper: Extract character details dynamically with tone support and child-appealing phrase tags
  const getCharacterItem = (levelNum: number, indexInLevel: number): CharacterItem => {
    const level = DINO_LEVELS[levelNum - 1] || DINO_LEVELS[0];
    let char = '龙';
    if (level && level.charSource) {
      const cleanStr = level.charSource.replace(/\s+/g, ''); // strip spaces
      char = cleanStr[indexInLevel % cleanStr.length] || '龙';
    }

    // Dynamic standard pinyin generated via pinyin-pro package
    let pinyinStr = '';
    try {
      pinyinStr = pinyin(char, { toneType: 'symbol' }) || 'lóng';
    } catch (e) {
      pinyinStr = 'lóng';
    }

    // Classify category on unicode hash
    const categories: Array<'nature' | 'human' | 'animal' | 'action' | 'direction'> = [
      'nature', 'human', 'animal', 'action', 'direction'
    ];
    const charCode = char.charCodeAt(0);
    const characterType = categories[charCode % categories.length];

    // Child-friendly description template
    let phrase = `宝贝字词「${char}」，大声跟迪诺一起读“${char}”吧！✨`;
    if (characterType === 'nature') {
      phrase = `神奇的大自然「${char}」，绿油油、亮晶晶，大声跟着念出来！🌍`;
    } else if (characterType === 'human') {
      phrase = `关于我们自己的「${char}」，指指小手、动动脑筋，一起读一声！🧒`;
    } else if (characterType === 'animal') {
      phrase = `可爱动物宝贝的「${char}」，蹦蹦跳跳、飞向高空，跟着我读！🦖`;
    } else if (characterType === 'action') {
      phrase = `快乐动一动的「${char}」，学着画面做动作，大声说！⚡`;
    } else if (characterType === 'direction') {
      phrase = `代表方位和大小的「${char}」，指天踩地，宝贝自信来读！🗺️`;
    }

    return {
      id: (levelNum - 1) * 300 + indexInLevel + 1,
      word: char,
      pinyin: pinyinStr,
      phrase,
      characterType
    };
  };

  const currentWord = getCharacterItem(currentLevelNum, currentWordIndexInLevel);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'zh-CN';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setRecogResult('正在倾听您的发音...');
      };

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setRecogResult(text);
        evaluateToddlerSpeech(text);
      };

      rec.onerror = (e: any) => {
        setIsListening(false);
        setRecogResult('没有听清哦，请靠近一些再读一遍吧~');
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentLevelNum, currentWordIndexInLevel]);

  // Read active character on changing current word
  useEffect(() => {
    setLearningState('unread');
    setRecogResult('');

    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    // Auto-read standard sound with kid pitch after brief transition delay
    const autoPlayTimer = setTimeout(() => {
      speakStandardWord();
    }, 450);

    // Dynamic question bubble prompt for kids
    if (quizMode) {
      const idx = Math.floor(Math.random() * DINO_QUIZ_PROMPTS.length);
      setQuizBubble(DINO_QUIZ_PROMPTS[idx]);
    } else {
      setQuizBubble(`跟我读—— “${currentWord.word}”！`);
    }

    return () => clearTimeout(autoPlayTimer);
  }, [currentLevelNum, currentWordIndexInLevel, quizMode]);

  // Standard Voice Synthesis
  const speakStandardWord = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(currentWord.word);
    utter.lang = 'zh-CN';
    utter.rate = 0.6; // slow, clear for toddlers
    utter.pitch = 1.35; // warm, cute pitch

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => 
      v.lang.includes('ZH') || 
      v.lang.includes('zh') || 
      v.name.includes('Xiaoxiao') || 
      v.name.includes('Huihui')
    );
    if (targetVoice) utter.voice = targetVoice;

    window.speechSynthesis.speak(utter);
    setAudioEnabled(true);
  };

  // Sound Synth Feedback
  const playWebAudioBeep = (type: 'correct' | 'incorrect' | 'click') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'correct') {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.4);
        });
      } else if (type === 'incorrect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const speakNarratorText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = 0.75;
    utter.pitch = 1.25;
    window.speechSynthesis.speak(utter);
  };

  const evaluateToddlerSpeech = (spoken: string) => {
    const cleanWord = currentWord.word.trim();
    const cleanSpoken = spoken.trim();
    if (cleanSpoken.includes(cleanWord) || cleanWord.includes(cleanSpoken)) {
      handleCorrectAction();
    } else {
      handleIncorrectAction();
    }
  };

  // Score loop & success
  const handleCorrectAction = () => {
    setLearningState('correct');
    playWebAudioBeep('correct');

    // Register correct answer in master list
    setMasteredWords(prev => ({
      ...prev,
      [currentWord.word]: true
    }));

    // Automatically remove from review list upon mastering!
    setReviewWords(prev => prev.filter(item => item.word !== currentWord.word));
    
    setQuizBubble(`⭐ 读对啦！汉字拼音是 [${currentWord.pinyin}]！`);
    speakNarratorText(`太棒啦！正确拼音为 ${currentWord.pinyin}。恭喜小朋友读对了！`);

    // Increment points
    setScore(prev => prev + 1);
    setShowConfetti(true);

    // Progress reward sticker unlocking
    evaluateStickersUnlock();

    // Auto-advance loop: move forward after standard 2.8 seconds
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    autoPlayTimeoutRef.current = setTimeout(() => {
      setShowConfetti(false);
      setUnlockedJustNow(null);
      handleMoveNext(true); 
    }, 2800);
  };

  const handleIncorrectAction = () => {
    setLearningState('incorrect');
    playWebAudioBeep('incorrect');

    // Track in review list automatically
    setReviewWords(prev => {
      const exists = prev.find(item => item.word === currentWord.word);
      if (exists) {
        return prev.map(item => item.word === currentWord.word ? { ...item, failures: item.failures + 1 } : item);
      } else {
        return [...prev, {
          word: currentWord.word,
          levelNumber: currentLevelNum,
          wordIndex: currentWordIndexInLevel,
          pinyin: currentWord.pinyin,
          failures: 1
        }];
      }
    });

    const encourageTxt = GENTLE_ENCOURAGEMENTS[Math.floor(Math.random() * GENTLE_ENCOURAGEMENTS.length)];
    setQuizBubble(`💡 ${encourageTxt}`);
    speakNarratorText(encourageTxt);
  };

  const evaluateStickersUnlock = () => {
    const locked = DINO_STICKERS_DATA.filter(s => !unlockedStickers.includes(s.id));
    if (locked.length > 0) {
      const randomSticker = locked[Math.floor(Math.random() * locked.length)];
      setUnlockedStickers(prev => [...prev, randomSticker.id]);
      setUnlockedJustNow(randomSticker.name);
    }
  };

  // Mic assessment controls
  const toggleListening = () => {
    playWebAudioBeep('click');
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        setRecogResult('正在准备麦克风环境...');
        recognitionRef.current?.start();
      } catch (e) {
        setRecogResult('麦克风忙，您可以点击下方的“模拟按钮”来体验跟读反馈哦！');
      }
    }
  };

  // Navigation handlers across 300 words
  const handleMovePrev = () => {
    playWebAudioBeep('click');
    setShowConfetti(false);
    setUnlockedJustNow(null);
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

    setCurrentWordIndexInLevel(prev => (prev === 0 ? 299 : prev - 1));
  };

  const handleMoveNext = (isAuto = false) => {
    if (!isAuto) playWebAudioBeep('click');
    setShowConfetti(false);
    setUnlockedJustNow(null);
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

    setCurrentWordIndexInLevel(prev => (prev === 299 ? 0 : prev + 1));
  };

  // Parent easy fast jump indices helpers
  const handleJumpIndex = (steps: number) => {
    playWebAudioBeep('click');
    setShowConfetti(false);
    setUnlockedJustNow(null);
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

    setCurrentWordIndexInLevel(prev => {
      const next = prev + steps;
      if (next >= 300) return next % 300;
      if (next < 0) return 299;
      return next;
    });
  };

  const toggleQuizMode = () => {
    playWebAudioBeep('click');
    const nextQuizState = !quizMode;
    setQuizMode(nextQuizState);
    if (nextQuizState) {
      const idx = Math.floor(Math.random() * DINO_QUIZ_PROMPTS.length);
      const text = DINO_QUIZ_PROMPTS[idx];
      setQuizBubble(text);
      speakNarratorText(text);
    } else {
      setQuizBubble(`跟我读—— “${currentWord.word}”！`);
    }
  };

  const handleEnableAudio = () => {
    setAudioEnabled(true);
    playWebAudioBeep('click');
    speakStandardWord();
  };

  // Get current Level mastered word count
  const getLevelMasteryCount = (lvlNum: number) => {
    const levelStr = DINO_LEVELS[lvlNum - 1]?.charSource.replace(/\s+/g, '') || '';
    let count = 0;
    for (let i = 0; i < levelStr.length; i++) {
      if (masteredWords[levelStr[i]]) {
        count++;
      }
    }
    return count;
  };

  // Map words types to colors
  const getBadgeColors = (type: string) => {
    switch (type) {
      case 'nature': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'human': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'animal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'action': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-emerald-150 text-emerald-800 border-emerald-300';
    }
  };

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'nature': return '🌍 大自然';
      case 'human': return '🧒 我们自己';
      case 'animal': return '🦖 动物宝贝';
      case 'action': return '⚡ 动作词';
      case 'direction': return '🗺️ 方向方位';
      default: return '📖 常用类';
    }
  };

  // All 300 characters of current stage
  const currentLevelChars = (activeLevel.charSource.replace(/\s+/g, '')).split('');

  // Handle Level Switch
  const selectLevelNum = (num: number) => {
    playWebAudioBeep('click');
    setCurrentLevelNum(num);
    setCurrentWordIndexInLevel(0);
    setShowMapModal(false);
    speakNarratorText(`已进入第${num}关！关卡名称：${DINO_LEVELS[num-1].name}`);
  };

  return (
    <div className="min-h-screen grid-bg-pattern font-sans flex flex-col p-3 sm:p-5 md:p-8 text-neutral-800 relative overflow-x-hidden">
      
      {/* Dynamic confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex flex-wrap justify-between">
            {[...Array(35)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: -40, 
                  scale: 0.5 + Math.random() * 1.2, 
                  rotate: 0 
                }}
                animate={{ 
                  y: window.innerHeight + 100, 
                  rotate: 360,
                  x: `calc(${Math.random() * window.innerWidth}px + ${(Math.random() - 0.5) * 100}px)`
                }}
                transition={{ 
                  duration: 2.2 + Math.random() * 2, 
                  ease: 'easeInOut', 
                  repeat: Infinity 
                }}
                style={{
                  backgroundColor: ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD56F', '#FF7B54', '#9772FB'][Math.floor(Math.random() * 6)],
                  width: '16px',
                  height: '16px',
                  borderRadius: Math.random() > 0.5 ? '50%' : '20%',
                  opacity: 0.8
                }}
                className="absolute"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col gap-6">
        
        {/* Child-Friendly Top Navbar */}
        <header className="bg-white px-5 py-4 rounded-3xl shadow-sm border-4 border-amber-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce">🦖</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-amber-500 font-sans tracking-wide">
                恐龙识字乐园
              </h1>
              <p className="text-xs text-neutral-500 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                3-6岁幼儿专属 · Q版明亮卡通 · 10大关卡学齐3000字！
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold bg-amber-100 text-amber-800 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-600" />
                识字之星: {score} 个
              </span>
              <span className="text-sm font-extrabold bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-sm">
                📚 进度: 第{currentLevelNum}关第 {currentWordIndexInLevel + 1} / 300字
              </span>
            </div>
          </div>
        </header>

        {/* 10 Level Quick Map Bar (Direct Tap to switch Level) */}
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl border-4 border-amber-100 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-amber-50 pb-2">
            <h3 className="text-sm font-extrabold text-amber-800 flex items-center gap-1.5">
              <LayoutGrid className="w-4.5 h-4.5 text-orange-500" />
              10大恐龙关卡选择 (直接点击可跨关卡学汉字哦！共3000字)：
            </h3>
            <span className="text-xs font-semibold text-neutral-400">每关300字</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {DINO_LEVELS.map((lvl) => {
              const isActive = lvl.levelNumber === currentLevelNum;
              const lvlMastery = getLevelMasteryCount(lvl.levelNumber);
              return (
                <button
                  key={lvl.levelNumber}
                  onClick={() => selectLevelNum(lvl.levelNumber)}
                  className={`relative p-2 rounded-2xl border-3 flex flex-col items-center justify-between transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 text-white border-amber-300 scale-105 shadow-md font-bold' 
                      : 'bg-orange-50/50 hover:bg-orange-50 border-orange-100 text-orange-950 font-medium'
                  }`}
                >
                  <span className="text-xs font-sans tracking-tight truncate w-full text-center">
                    {lvl.emoji} {lvl.name}
                  </span>
                  
                  {/* Mastery count badge under but extremely neat */}
                  <span className={`text-[9px] mt-1 px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-850'
                  } font-extrabold`}>
                    ⭐ {lvlMastery}字
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio activation alert (Required by standard browser policies) */}
        {!audioEnabled && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-50 border-4 border-amber-300 p-5 rounded-3xl text-center flex flex-col items-center justify-center shadow-lg"
          >
            <p className="text-amber-800 font-extrabold text-lg mb-3 flex items-center gap-2">
              🔊 欢迎开启奇妙恐龙语音！请先帮小朋友开启发音哦！
            </p>
            <button
              onClick={handleEnableAudio}
              className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-lg hover:shadow-md active:scale-95 transition-transform flex items-center gap-2 cursor-pointer border-b-4 border-orange-600"
            >
              <Volume2 className="w-6 h-6 animate-bounce" />
              开启声音并听发音
            </button>
          </motion.div>
        )}

        {/* Level Banner Context */}
        <div className={`rounded-3xl p-4 bg-gradient-to-r ${activeLevel.colorClass} text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold flex items-center gap-1.5">
              <span>{activeLevel.emoji}</span>
              第 {activeLevel.levelNumber} 关：{activeLevel.name}
              <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-md ml-1.5 font-bold">
                {activeLevel.theme}
              </span>
            </h2>
            <p className="text-xs opacity-90 font-medium max-w-2xl mt-0.5">
              {activeLevel.description}
            </p>
          </div>
          <button
            onClick={() => {
              playWebAudioBeep('click');
              setShowMapModal(true);
            }}
            className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2.5 rounded-2xl font-black text-xs shadow-sm flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <LayoutGrid className="w-4.5 h-4.5 text-orange-500" />
            🗺️ 查看字形大地图 (300字列表)
          </button>
        </div>

        {/* Main single word learning screen block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Character View Blackboard Panel */}
          <div className="md:col-span-8 bg-white border-8 border-amber-100 rounded-[38px] p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            
            {/* Top decorative leaves and word type badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-amber-50 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-4 py-1.5 text-xs font-bold rounded-full border-2 shadow-sm ${getBadgeColors(currentWord.characterType)}`}>
                  {getBadgeLabel(currentWord.characterType)}
                </span>
                
                {/* Parents settings block */}
                <button
                  type="button"
                  onClick={() => {
                    playWebAudioBeep('click');
                    setAlwaysShowPinyin(!alwaysShowPinyin);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all flex items-center gap-1 cursor-pointer ${
                    alwaysShowPinyin 
                      ? 'bg-amber-100 border-amber-300 text-amber-800 font-extrabold' 
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-500'
                  }`}
                  title="开启动态拼音展示"
                >
                  {alwaysShowPinyin ? '📖 总是显示拼音' : '🤫 读对再现拼音'}
                </button>

                {/* Parents manual review bookmark button */}
                <button
                  type="button"
                  onClick={() => {
                    playWebAudioBeep('click');
                    const exists = reviewWords.some(item => item.word === currentWord.word);
                    if (exists) {
                      setReviewWords(p => p.filter(item => item.word !== currentWord.word));
                      speakNarratorText(`已从生字复习本移出“${currentWord.word}”`);
                    } else {
                      setReviewWords(p => [...p, {
                        word: currentWord.word,
                        levelNumber: currentLevelNum,
                        wordIndex: currentWordIndexInLevel,
                        pinyin: currentWord.pinyin,
                        failures: 0
                      }]);
                      speakNarratorText(`“${currentWord.word}”已记入生字复习本`);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all flex items-center gap-1 cursor-pointer ${
                    reviewWords.some(item => item.word === currentWord.word) 
                      ? 'bg-rose-100 border-rose-300 text-rose-800 font-extrabold' 
                      : 'bg-neutral-50 hover:bg-rose-100 border-neutral-200 text-neutral-500'
                  }`}
                  title="加入或移出生字复习本"
                >
                  {reviewWords.some(item => item.word === currentWord.word) ? '❤️ 已在生字本' : '⭐ 放入生字本'}
                </button>
              </div>
              
              {/* Dynamic Action Status */}
              <div className="flex items-center gap-1.5">
                {masteredWords[currentWord.word] && (
                  <span className="px-2.5 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-extrabold text-[10px] rounded-full border border-amber-300">
                    ⭐ 本字已通关
                  </span>
                )}
                
                {learningState === 'unread' && (
                  <span className="px-3 py-1 bg-yellow-105 hover:bg-yellow-200 text-yellow-800 font-extrabold text-xs rounded-full border border-yellow-300 flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                    未认读
                  </span>
                )}
                {learningState === 'correct' && (
                  <motion.span 
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    className="px-3.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-300 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    正确 ✅
                  </motion.span>
                )}
                {learningState === 'incorrect' && (
                  <motion.span 
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    className="px-3.5 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-full border border-rose-300 flex items-center gap-1 animate-pulse"
                  >
                    <X className="w-3.5 h-3.5" />
                    再发一次音 ❌
                  </motion.span>
                )}
              </div>
            </div>

            {/* Blackboard display inside school grid standard (Tian Zi Ge watermarks) */}
            <div className="w-full h-80 flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border-4 border-dashed border-rose-200 relative mb-4">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20">
                <div className="border-r border-b border-rose-400 border-dashed" />
                <div className="border-b border-rose-400 border-dashed" />
                <div className="border-r border-rose-400 border-dashed" />
                <div />
              </div>

              {/* Dynamic high quality Pinyin area loaded dynamically via pinyin-pro package with tone markers */}
              <div className="h-14 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {(learningState === 'correct' || alwaysShowPinyin) ? (
                    <motion.div
                      key="active-pinyin"
                      initial={{ scale: 0, y: 15 }}
                      animate={{ scale: 1.1, y: 0 }}
                      exit={{ scale: 0 }}
                      className="bg-amber-100 border-2 border-amber-300 text-amber-800 px-6 py-1.5 rounded-full font-bold text-2.5xl tracking-wide shadow-sm flex items-center gap-1.5"
                    >
                      <span className="font-sans font-bold text-2xl">{currentWord.pinyin}</span>
                      {alwaysShowPinyin && learningState !== 'correct' && (
                        <span className="text-[10px] bg-amber-200 text-amber-700 px-1.5 py-0.5 rounded-md font-extrabold font-sans">提示</span>
                      )}
                    </motion.div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        playWebAudioBeep('click');
                        setAlwaysShowPinyin(true);
                      }}
                      className="text-neutral-400 hover:text-amber-600 font-extrabold text-xs text-center border-2 border-dashed border-neutral-300 px-4 py-2 rounded-full bg-neutral-50/40 cursor-pointer active:scale-95 transition-all"
                    >
                      📢 读对自动显示拼音 🔑 或点击直接显示
                    </button>
                  )}
                </AnimatePresence>
              </div>

              {/* Giant clean beautiful display text */}
              <motion.div
                key={`${currentLevelNum}-${currentWordIndexInLevel}`}
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={speakStandardWord}
                className="text-8xl md:text-9xl font-black text-amber-950 select-none cursor-pointer filter drop-shadow-sm active:scale-95 transition-all text-center mt-2 font-sans"
                title="点击听大声音发音"
              >
                {currentWord.word}
              </motion.div>

              {/* Associated cute toddler phrase */}
              <div className="text-center px-4 mt-4 h-10">
                <p className="text-xs md:text-sm font-extrabold text-neutral-500 bg-white/70 px-4 py-1.5 rounded-full shadow-sm inline-block leading-tight">
                  {currentWord.phrase}
                </p>
              </div>
            </div>

            {/* Assess interact details */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={speakStandardWord}
                  className="flex-1 bg-sky-100 hover:bg-sky-200 text-sky-800 font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer border-b-4 border-sky-300 transition-colors"
                >
                  <Volume2 className="w-5.5 h-5.5 text-sky-600" />
                  听迪诺发音
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`flex-1 font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer border-b-4 transition-all ${
                    isListening 
                      ? 'bg-red-400 hover:bg-red-500 text-white border-red-500 animate-pulse' 
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {isListening ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-100"></span>
                      </span>
                      停止听读
                    </>
                  ) : (
                    <>
                      <Mic className="w-5.5 h-5.5 text-emerald-600" />
                      点击跟读字音
                    </>
                  )}
                </motion.button>
              </div>

              {/* Simulation toolbox */}
              <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 flex flex-col gap-1.5">
                <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1 justify-center">
                  <Info className="w-3.5 h-3.5" />
                  小朋友模拟跟读辅助（点击可立即模拟发音通过，解锁动态拼音）：
                </span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCorrectAction}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    发音标准 (成功解锁)
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleIncorrectAction}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    含糊不清 (重读提示)
                  </motion.button>
                </div>
              </div>

              {/* Speech recognition feedback indicator */}
              {recogResult && (
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-150 text-center text-xs font-semibold text-amber-900 leading-tight">
                  🐾 倾听到小朋友的声音：
                  <span className="text-amber-700 font-extrabold text-sm ml-1 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                    {recogResult}
                  </span>
                </div>
              )}
            </div>

            {/* Sticker unlocked modal notification */}
            {unlockedJustNow && (
              <motion.div 
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute inset-[10px] bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white flex flex-col items-center justify-center text-center shadow-xl z-30"
              >
                <div className="bg-white/20 p-4 rounded-full mb-3 animate-spin">
                  <Award className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold mb-1">🎁 获得新恐龙贴纸勋章！</h3>
                <p className="text-sm font-semibold opacity-90 max-w-sm mb-4">
                  恭喜小朋友解锁了「<span className="font-extrabold text-[#F7FF93]">{unlockedJustNow}</span>」！贴纸已经送达底部的恐龙乐园，快去快乐互玩吧！
                </p>
                <button
                  onClick={() => setUnlockedJustNow(null)}
                  className="bg-white text-orange-600 px-6 py-2 rounded-full text-sm font-extrabold hover:bg-orange-50 shadow-md cursor-pointer pointer-events-auto"
                >
                  开心收下并放进乐园 🐾
                </button>
              </motion.div>
            )}

          </div>

          {/* Right Companion and Dinosaur Guide */}
          <div className="md:col-span-4 bg-white border-8 border-amber-150 rounded-[38px] p-5 shadow-md flex flex-col items-center justify-between min-h-[350px]">
            <DinosaurDino 
              state={learningState} 
              customBubbleText={quizBubble}
              dinoType={DINO_STICKERS_DATA[currentWordIndexInLevel % DINO_STICKERS_DATA.length].svgType}
              scale={1.05}
            />

            <div className="w-full space-y-3 mt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleQuizMode}
                className={`w-full py-3 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-sm border-2 transition-all cursor-pointer ${
                  quizMode 
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-400' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                }`}
              >
                <HelpCircle className="w-4.5 h-4.5 text-indigo-500" />
                {quizMode ? '关闭 🔍 恐龙提问模式' : '开启 ❓ 迪诺提问跟读'}
              </motion.button>

              <div className="text-[10px] text-center text-gray-400 leading-tight font-sans">
                恐龙每次会随机引导新提问，指导小朋友大胆跟着读汉字哦！
              </div>
            </div>
          </div>

        </div>

        {/* 300 page big direct controller navigation buttons */}
        <div className="bg-white p-4 rounded-3xl border-4 border-amber-100 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleJumpIndex(-30)}
              className="px-3 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-xl text-xs font-bold font-sans cursor-pointer"
              title="向上快速跳转30字"
            >
              ⏪ -30字
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMovePrev}
              className="bg-neutral-100 hover:bg-neutral-200 border-b-4 border-neutral-300 text-neutral-700 font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-500" />
              上一个
            </motion.button>
          </div>

          <div className="text-center font-extrabold text-neutral-500 text-sm">
            第 {currentLevelNum} 关 · 第 <span className="text-orange-500 font-bold text-lg">{currentWordIndexInLevel + 1}</span> / 300 个汉字 (ID: {currentWord.id})
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoveNext(false)}
              className={`font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm cursor-pointer border-b-4 transition-all ${
                learningState === 'incorrect' 
                  ? 'bg-amber-400 hover:bg-amber-500 text-white border-amber-600 animate-bounce' 
                  : 'bg-neutral-100 hover:bg-neutral-200 border-b-4 border-neutral-300 text-neutral-700'
              }`}
            >
              下一个字
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleJumpIndex(30)}
              className="px-3 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-xl text-xs font-bold font-sans cursor-pointer"
              title="向下快速跳转30字"
            >
              +30字 ⏩
            </motion.button>
          </div>
        </div>

        {/* Dinosaur Review Notebook widget */}
        <div className="bg-white p-6 rounded-3xl border-8 border-rose-100 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-rose-50 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl animate-pulse">📓</span>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-rose-800 tracking-wide">
                  我的生字复习本
                </h2>
                <p className="text-xs text-neutral-400 font-bold">
                  这些是宝贝最近读错过，或者家长特别收藏的生字词宝贝哦！多复习可以牢牢记住它们！🦕
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full border border-rose-150">
                难字数量: {reviewWords.length} 个
              </span>
              {reviewWords.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playWebAudioBeep('click');
                    if (window.confirm('小宝贝，确认要清空你的生字本重新开始吗？')) {
                      setReviewWords([]);
                      speakNarratorText('生字本已清空，宝贝加油！');
                    }
                  }}
                  className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-500 font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  🧹 全部清除
                </button>
              )}
            </div>
          </div>

          {reviewWords.length === 0 ? (
            <div className="py-10 text-center bg-rose-50/20 rounded-2xl border-4 border-dashed border-rose-100 flex flex-col items-center justify-center gap-2 p-4">
              <span className="text-5xl animate-bounce">🦖</span>
              <h3 className="font-extrabold text-rose-700 text-base">超级棒！目前没有记录任何字宝宝哦</h3>
              <p className="text-xs text-neutral-500 font-medium max-w-md">
                当发音不标准时系统会自动记录，您也可以随时点击大字右上方的 “⭐ 放入生字本” 按钮来主动收藏它，方便小朋友反复进行跟读练习！
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {reviewWords.map((item) => {
                  const isCurrent = currentLevelNum === item.levelNumber && currentWordIndexInLevel === item.wordIndex;
                  return (
                    <div
                      key={`${item.levelNumber}-${item.wordIndex}`}
                      className={`relative group p-2.5 rounded-2xl border-3 flex flex-col items-center justify-between transition-all ${
                        isCurrent 
                          ? 'bg-rose-100 border-rose-400 scale-105 shadow' 
                          : 'bg-white hover:bg-rose-50/50 border-rose-100 hover:scale-102'
                      }`}
                    >
                      {/* Active click area to jump to word */}
                      <button
                        type="button"
                        onClick={() => {
                          playWebAudioBeep('click');
                          setCurrentLevelNum(item.levelNumber);
                          setCurrentWordIndexInLevel(item.wordIndex);
                          speakNarratorText(`已为您载入生字本中的 “${item.word}”，大声跟着迪诺念吧！`);
                        }}
                        className="w-full flex flex-col items-center cursor-pointer"
                        title={`点击回到该字 (第${item.levelNumber}关第${item.wordIndex+1}字)`}
                      >
                        {/* Word string */}
                        <span className="text-3xl font-black text-rose-900 group-hover:text-rose-600 transition-colors">
                          {item.word}
                        </span>
                        
                        {/* Pinyin */}
                        <span className="text-[10px] text-rose-600 font-bold tracking-tight">
                          {item.pinyin}
                        </span>

                        {/* Fail count tag if recorded */}
                        {item.failures > 0 ? (
                          <span className="text-[8px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded-full mt-1">
                            读错 {item.failures} 次
                          </span>
                        ) : (
                          <span className="text-[8px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-full mt-1">
                            自主收藏
                          </span>
                        )}
                        
                        <span className="text-[8px] mt-1 text-gray-400 font-medium">
                          第 {item.levelNumber} 关
                        </span>
                      </button>

                      {/* Small remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Stop trigger jump click
                          playWebAudioBeep('click');
                          setReviewWords(p => p.filter(x => !(x.levelNumber === item.levelNumber && x.wordIndex === item.wordIndex)));
                          speakNarratorText(`生字 “${item.word}” 已从复习本移出`);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-xs hover:scale-110 transition-all shadow shadow-red-200 cursor-pointer animate-none"
                        title="移出生字本"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Directly test review mode! */}
              <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="font-extrabold text-rose-800 flex items-center gap-1.5 text-center sm:text-left">
                  <span>🎯 宝贝复习训练营：</span>
                  <span className="text-neutral-500 font-bold">点击生字卡片可以直接把汉字重新载入大卡片，大声念对后，该字便会自动从生字本中完美过关啦！</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playWebAudioBeep('click');
                    if (reviewWords.length > 0) {
                      // Grab a random review item and load it
                      const randomWord = reviewWords[Math.floor(Math.random() * reviewWords.length)];
                      setCurrentLevelNum(randomWord.levelNumber);
                      setCurrentWordIndexInLevel(randomWord.wordIndex);
                      speakNarratorText(`挑战生字复习中！跟读开始，请拼读“${randomWord.word}”！`);
                    }
                  }}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-2xl shadow-sm hover:shadow active:scale-95 transition-all font-black flex items-center gap-1 cursor-pointer shrink-0"
                >
                  🎲 随机抽取复习
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dino Lock Land Interactive sandbox */}
        <div className="mt-2">
          <DinoPark 
            unlockedStickers={unlockedStickers}
            onPlaySound={speakNarratorText}
          />
        </div>

        {/* Level Paginator and Map Modal Grid Dialog */}
        <AnimatePresence>
          {showMapModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[32px] border-8 border-amber-100 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col p-6 shadow-2xl relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b-4 border-amber-50 pb-4 mb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-amber-900 flex items-center gap-1.5">
                      <span>{activeLevel.emoji}</span>
                      第 {activeLevel.levelNumber} 关汉学大地图 ({activeLevel.name} - 300字列表)
                    </h2>
                    <p className="text-xs text-neutral-400 font-bold mt-1">
                      点击其中任意一个汉字, 即可使迪诺教学此汉字的发音与拼音哦！
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playWebAudioBeep('click');
                      setShowMapModal(false);
                    }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full p-2 font-bold cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 mb-4 bg-amber-50/50 p-2 rounded-2xl border-2 border-amber-100">
                  <Search className="w-5 h-5 text-amber-500 ml-2" />
                  <input
                    type="text"
                    placeholder="输入想要查询学习的汉字 (支持模糊拼音过滤)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-neutral-800 w-full font-bold placeholder-neutral-400 focus:ring-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-neutral-401 bg-white hover:bg-amber-100 px-2.5 py-1 rounded-full font-bold cursor-pointer border border-amber-200"
                    >
                      清空输入
                    </button>
                  )}
                </div>

                {/* Big character grids list */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2 p-1.5">
                    {currentLevelChars.map((char, index) => {
                      // Filter if query specified
                      const charPinyin = pinyin(char, { toneType: 'none' }) || '';
                      const charTonePinyin = pinyin(char, { toneType: 'symbol' }) || '';
                      if (searchQuery) {
                        const q = searchQuery.toLowerCase().trim();
                        if (!char.includes(q) && !charPinyin.includes(q) && !charTonePinyin.includes(q)) {
                          return null;
                        }
                      }

                      const valMastered = masteredWords[char] === true;
                      const isActive = index === currentWordIndexInLevel;

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            playWebAudioBeep('click');
                            setCurrentWordIndexInLevel(index);
                            setShowMapModal(false);
                            speakNarratorText(`为您读：${char}`);
                          }}
                          className={`p-2 rounded-xl text-center border-2 transition-all cursor-pointer relative flex flex-col items-center justify-center ${
                            isActive 
                              ? 'bg-amber-400 text-white border-amber-500 font-extrabold scale-110 shadow-md z-10' 
                              : valMastered 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' 
                                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700 hover:scale-105'
                          }`}
                        >
                          <span className="text-xl font-bold font-sans">{char}</span>
                          <span className="text-[9px] opacity-75 font-sans leading-none mt-0.5">{charTonePinyin}</span>

                          {/* Mastered Star icon */}
                          {valMastered && (
                            <span className="absolute -top-1.5 -right-1 bg-amber-400 text-white rounded-full p-0.5 text-[8px] leading-none" title="已熟练掌握">
                              ⭐
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer instructions inside Map modal dialog */}
                <div className="border-t border-amber-100 pt-4 mt-4 text-center text-xs font-bold text-neutral-400">
                  小提示：在 300 字大地图里随时可以看到认读学习历史进度哦！🌱
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <footer className="text-center py-4 text-xs font-semibold text-neutral-400 flex flex-col gap-1">
          <p>🦕 恐龙学字好习惯：每天10分钟通一关，轻松认读初学3000字！🏆</p>
          <p>© 恐龙识字乐园 · 基于 pinyin-pro 专业全声调拼音识别与语音合成系统</p>
        </footer>

      </div>
    </div>
  );
}
