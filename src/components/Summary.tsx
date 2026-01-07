import { Volume2 } from "lucide-react";

export const Summary = ({ text }: { text: string }) => {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Mate's Summary</h3>
        <p className="text-lg text-slate-200 italic">"{text}"</p>
      </div>
      <button 
        onClick={speak}
        className="p-4 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-all active:scale-95"
      >
        <Volume2 className="w-6 h-6" />
      </button>
    </div>
  );
};
