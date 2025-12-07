import React, { useMemo } from 'react';
import { BallData, Color } from '../types';
import { RotateCcw, Copy, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface BallGridProps {
  balls: BallData[];
  filteredBalls: Set<number>;
  onBallClick: (num: number) => void;
  onZodiacClick: (zodiac: string) => void;
  excludedZodiacs: Set<string>;
  onCopy: () => void;
  onReset: () => void;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  remainingCount: number;
}

export const BallGrid: React.FC<BallGridProps> = ({ 
  balls, 
  filteredBalls, 
  onBallClick, 
  onZodiacClick,
  excludedZodiacs,
  onCopy,
  onReset,
  year,
  setYear,
  remainingCount
}) => {
  
  const getColorClass = (color: Color, isInactive: boolean) => {
    if (isInactive) return "bg-gray-100 text-gray-300 border-gray-200 shadow-inner";
    switch (color) {
      case Color.RED: return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200 border-red-700 hover:bg-red-700 hover:shadow-red-300";
      case Color.BLUE: return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200 border-blue-700 hover:bg-blue-700 hover:shadow-blue-300";
      case Color.GREEN: return "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200 border-green-700 hover:bg-green-700 hover:shadow-green-300";
      default: return "bg-gray-500";
    }
  };

  const headers = balls.slice(0, 12);

  const resultString = useMemo(() => {
      return Array.from(filteredBalls)
        .sort((a, b) => a - b)
        .map(n => n.toString().padStart(2, '0'))
        .join(' ');
  }, [filteredBalls]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
        {/* Header Section */}
        <div className="bg-gray-50 p-3 border-b border-gray-200 flex gap-3 items-stretch">
            
            {/* 1. Year Card - Modern Widget */}
            <div className="bg-white border border-gray-200 border-t-4 border-t-blue-500 rounded-lg shadow-sm flex flex-col items-center justify-center py-2 px-4 min-w-[110px] shrink-0">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">年份</div>
                <div className="flex items-center gap-1 w-full justify-between">
                    <button onClick={() => setYear(y => y - 1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors active:scale-90">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-black text-gray-800 font-mono tracking-tighter">{year}</span>
                    <button onClick={() => setYear(y => y + 1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors active:scale-90">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 2. Result Display & Copy */}
            <div className="flex-grow bg-white border border-gray-200 rounded-lg shadow-inner flex overflow-hidden ring-1 ring-black/5 group focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                {/* Number Display Area */}
                <div className="flex-grow p-4 font-mono text-base text-gray-700 leading-relaxed overflow-y-auto min-h-[80px] flex items-start content-start flex-wrap gap-2">
                     {remainingCount > 0 ? (
                        <>
                            <span className="tracking-wide break-all">{resultString}</span>
                            <span className="inline-flex items-center justify-center bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 whitespace-nowrap select-none mt-0.5">
                                (共{remainingCount}个号码)
                            </span>
                        </>
                     ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-300 italic gap-2 text-sm select-none">
                             <Info className="w-5 h-5" /> 暂无筛选结果
                         </div>
                     )}
                </div>
                
                {/* Large Vertical Copy Button */}
                <button 
                    onClick={onCopy}
                    className="w-20 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex flex-col items-center justify-center gap-1.5 border-l border-blue-700 transition-all active:bg-blue-800 shrink-0 shadow-lg relative overflow-hidden group/btn"
                    title="复制所有结果"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    <Copy className="w-6 h-6" />
                    <span className="text-sm font-bold writing-mode-vertical">复制</span>
                </button>
            </div>
        </div>

        {/* Grid Section */}
        <div className="p-4 overflow-x-auto bg-slate-50/30">
            <div className="min-w-[700px]">
                {/* 12-Column Grid */}
                <div className="grid grid-cols-12 gap-y-3 gap-x-2">
                    
                    {/* Headers (Zodiacs) */}
                    {headers.map((ball) => {
                        const isZodiacExcluded = excludedZodiacs.has(ball.zodiac);
                        return (
                            <div key={ball.zodiac} className="flex justify-center px-0.5">
                                <button 
                                    onClick={() => onZodiacClick(ball.zodiac)}
                                    className={`
                                        font-bold text-sm py-1 rounded-full transition-all duration-200 w-full text-center select-none shadow-sm border
                                        ${isZodiacExcluded 
                                        ? 'bg-gray-100 text-gray-300 border-transparent' 
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'}
                                    `}
                                    title={isZodiacExcluded ? "点击恢复该生肖" : "点击排除该生肖"}
                                >
                                    {ball.zodiac}
                                </button>
                            </div>
                        );
                    })}

                    {/* Balls 1-49 */}
                    {balls.map((ball) => {
                        const isFiltered = !filteredBalls.has(ball.number);
                        return (
                            <div key={ball.number} className="flex justify-center">
                                <button 
                                    onClick={() => onBallClick(ball.number)}
                                    className={`
                                        w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base border-2 transition-all duration-200 cursor-pointer shadow-sm select-none
                                        ${getColorClass(ball.color, isFiltered)}
                                        ${isFiltered ? 'scale-90 opacity-40 grayscale' : 'scale-100 hover:scale-110 hover:z-10'}
                                    `}
                                >
                                    {ball.number}
                                </button>
                            </div>
                        );
                    })}

                    {/* Footer Buttons (Cols 9-12) */}
                    <div className="col-start-9 col-span-2 flex items-center pl-2 pt-2">
                         <button onClick={onCopy} className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg shadow text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                            <Copy className="w-3.5 h-3.5" /> 复制剩余
                        </button>
                    </div>
                    <div className="col-span-2 flex items-center pt-2">
                         <button onClick={onReset} className="w-full py-2 bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white font-bold rounded-lg shadow text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                            <RotateCcw className="w-3.5 h-3.5" /> 复位
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};