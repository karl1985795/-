import React, { useState, useEffect } from 'react';
import { Home, Calculator, Clock, Wrench, HelpCircle, Calendar, Sparkles } from 'lucide-react';
import { LotteryResult, Color } from '../types';
import { getBallAttributes } from '../utils/lotteryLogic';

interface HeaderProps {
    latestResult: LotteryResult | null;
    onHomeClick: () => void;
    onHistoryClick: () => void;
    onHelpClick: () => void;
    onMenuAction: (action: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ latestResult, onHomeClick, onHistoryClick, onHelpClick, onMenuAction }) => {
  const btnClass = "flex flex-col items-center justify-center p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer group focus:outline-none select-none active:scale-95";
  const iconClass = "w-5 h-5 mb-0.5 group-hover:-translate-y-0.5 transition-transform duration-300";
  const textClass = "text-[10px] font-medium";

  // System Date State
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
      const timer = setInterval(() => setCurrentDate(new Date()), 1000);
      return () => clearInterval(timer);
  }, []);

  const formatSystemDate = (date: Date) => {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const d = date.getDate().toString().padStart(2, '0');
      const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
      return `${y}年${m}月${d}日 星期${week}`;
  };

  const getYearFromTime = (timeStr: string) => {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) return date.getFullYear();
      return new Date().getFullYear();
  };

  const getBallStyle = (color: Color) => {
    switch (color) {
        case Color.RED: return "bg-gradient-to-br from-red-500 to-red-600 border-red-200 shadow-red-200";
        case Color.BLUE: return "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-200 shadow-blue-200";
        case Color.GREEN: return "bg-gradient-to-br from-green-500 to-green-600 border-green-200 shadow-green-200";
        default: return "bg-gray-500 border-gray-600";
    }
  };
  
  const getTextColor = (color: Color) => {
      switch (color) {
        case Color.RED: return "text-red-600";
        case Color.BLUE: return "text-blue-600";
        case Color.GREEN: return "text-green-600";
        default: return "text-gray-600";
      }
  };

  const resultNumbers = latestResult ? latestResult.openCode.split(',') : [];
  const resultYear = latestResult ? getYearFromTime(latestResult.openTime) : new Date().getFullYear();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        {/* Top Bar: Title & Date - Centered Layout */}
        <div className="relative flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
             {/* Centered Title */}
             <div className="flex items-center gap-2 transform hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                <h1 className="text-2xl font-bold tracking-wide text-shadow-sm">加多宝挑码助手 PRO</h1>
             </div>
             
             {/* Absolute Positioned Time (Right) */}
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-end hidden sm:flex">
                <div className="flex items-center gap-1 text-xs opacity-90 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{currentDate.toLocaleTimeString('en-GB', { hour12: false })}</span>
                </div>
                <div className="text-[10px] opacity-75">{formatSystemDate(currentDate)}</div>
             </div>
        </div>

        {/* Lottery Result Section - Centered & Larger */}
        {latestResult && (
            <div className="px-4 py-4 bg-blue-50 border-b border-blue-100 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-600 text-white text-base font-bold px-3 py-1 rounded shadow-sm">
                        第 {latestResult.issue} 期
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1 font-medium">
                        <Calendar className="w-4 h-4" />
                        {latestResult.openTime}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-3 overflow-x-auto pb-1 no-scrollbar w-full">
                    {resultNumbers.map((numStr, index) => {
                        const num = parseInt(numStr, 10);
                        const isSpecial = index === resultNumbers.length - 1;
                        const attrs = getBallAttributes(num, resultYear);
                        
                        return (
                            <div key={index} className="flex flex-col items-center shrink-0 relative">
                                {isSpecial && index > 0 && (
                                    <div className="absolute -left-4 top-3 text-gray-400 font-bold text-xl">+</div>
                                )}
                                <div className={`
                                    w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md border-2
                                    ${getBallStyle(attrs.color)}
                                    ${isSpecial ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
                                `}>
                                    {numStr}
                                </div>
                                <span className={`text-xs font-bold mt-1 ${getTextColor(attrs.color)}`}>
                                    {attrs.zodiac}/{attrs.element}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Navigation Bar */}
        <div className="grid grid-cols-5 gap-1 px-2 py-1 bg-white">
            <button onClick={onHomeClick} className={btnClass} title="首页复位">
                <Home className={iconClass} />
                <span className={textClass}>首页</span>
            </button>
            <button onClick={onHistoryClick} className={btnClass} title="往期开奖">
                <Clock className={iconClass} />
                <span className={textClass}>往期</span>
            </button>
            <button onClick={() => onMenuAction('calc')} className={btnClass} title="筛选计算">
                <Calculator className={iconClass} />
                <span className={textClass}>筛选</span>
            </button>
            <button onClick={() => onMenuAction('tools')} className={btnClass} title="工具箱">
                <Wrench className={iconClass} />
                <span className={textClass}>工具</span>
            </button>
            <button onClick={onHelpClick} className={btnClass} title="使用说明">
                <HelpCircle className={iconClass} />
                <span className={textClass}>说明</span>
            </button>
        </div>
    </div>
  );
};