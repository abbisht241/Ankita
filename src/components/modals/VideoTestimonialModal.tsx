import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Star, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface VideoTestimonialModalProps {
  isOpen: boolean;
  name: string;
  exam: string;
  onClose: () => void;
  onOpenDemo: () => void;
}

export const VideoTestimonialModal: React.FC<VideoTestimonialModalProps> = ({
  isOpen,
  name,
  exam,
  onClose,
  onOpenDemo
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-800 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Box */}
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center mb-4 group shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
            alt="Student interview video preview"
            className="w-full h-full object-cover opacity-75"
          />

          {/* Playing Simulation Animation Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 flex flex-col justify-between p-4">
            
            {/* Top Video Header */}
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                INTERVIEW
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {name || 'Dr. Priya Sharma'} — Success Journey &amp; Strategy
              </span>
            </div>

            {/* Center Play/Pause Overlay */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-brand-600/90 hover:bg-brand-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="space-y-2">
              {/* Progress Bar */}
              <div 
                className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setProgress(Math.round(pos * 100));
                }}
              >
                <div 
                  className="bg-brand-500 h-full rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="cursor-pointer">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} className="cursor-pointer">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-[11px]">01:24 / 03:45</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">1080p HD</span>
                  <Maximize className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Student Details & Transcript Highlights */}
        <div className="space-y-3 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">
                {name || 'Dr. Priya Sharma'}
              </h4>
              <p className="text-xs text-amber-300 font-semibold">
                {exam || 'UGC NET JRF AIR 12 (Education & Paper 1)'}
              </p>
            </div>
            <div className="flex items-center text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interview Summary:</span>
            </div>
            <p className="leading-relaxed">
              "How I moved from 46 marks to 88 marks in Paper 1 using Dr. Ankita Bisht's 10-Unit Framework and daily NTA CBT mock test practice."
            </p>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Start your preparation journey with Dr. Ankita Bisht
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenDemo();
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Book Free Live Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
