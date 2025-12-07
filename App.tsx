import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BallGrid } from './components/BallGrid';
import { ControlPanel } from './components/ControlPanel';
import { getBallData, filterBalls, getBallAttributes } from './utils/lotteryLogic';
import { fetchLotteryData, fetchRecentHistory } from './utils/api';
import { FilterState, ToggleFilterFn, LotteryResult } from './types';
import { X, HelpCircle, CheckCircle, Copy, AlertTriangle, RefreshCw } from 'lucide-react';

const smartParseNumbers = (input: string): number[] => {
  let clean = input.trim();
  if (!clean) return [];
  const splitBySep = clean.split(/[^0-9]+/).filter(s => s.length > 0);
  if (splitBySep.length > 1) {
    return splitBySep.map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n >= 1 && n <= 49);
  }
  const single = splitBySep[0];
  if (single.length >= 2 && single.length % 2 === 0) {
     const pairs = single.match(/.{1,2}/g) || [];
     const nums = pairs.map(p => parseInt(p, 10));
     const allValid = nums.every(n => n >= 1 && n <= 49);
     if (allValid) return nums;
  }
  const val = parseInt(single, 10);
  if (!isNaN(val) && val >= 1 && val <= 49) return [val];
  return [];
};

const App: React.FC = () => {
  const [year, setYear] = useState<number>(2025);
  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const controlPanelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to load data
    const loadData = async () => {
        try {
            const data = await fetchLotteryData();
            // Update state with new data
            setLotteryResults(data);
        } catch (e) {
            console.error("Failed to load lottery data", e);
        }
    };

    // 1. Initial Load
    loadData();

    // 2. Auto-Refresh every 60 seconds (1 minute)
    // This ensures the data "changes" automatically when new results come out
    const intervalId = setInterval(loadData, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const latestResult = lotteryResults.length > 0 ? lotteryResults[0] : null;

  const initialFilters = useMemo<FilterState>(() => ({
    tails: new Set(),
    heads: new Set(),
    zodiacs: new Set(),
    colors: new Set(),
    elements: new Set(),
    digitSums: new Set(),
    sumTails: new Set(),
    mod3: new Set(),
    mod4: new Set(),
    mod6: new Set(),
    mod7: new Set(),
    segments: new Set(),
    parity: new Set(),
    size: new Set(),
    tailSize: new Set(),
    sumParity: new Set(),
    sumSize: new Set(),
    zodiacSkyGround: new Set(),
    zodiacDomesticWild: new Set(),
    zodiacFrontBack: new Set(),
    zodiacYinYang: new Set(),
    zodiacLuck: new Set(),
    zodiacStrokes: new Set(),
    compositeHalfWave: new Set(),
    compositeHalfHead: new Set(),
    compositeHalfParity: new Set(),
    customMode: 'exclude',
    customNumbers: new Set()
  }), []);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [customInput, setCustomInput] = useState<string>('');

  const allBalls = useMemo(() => getBallData(year), [year]);
  const activeBalls = useMemo(() => filterBalls(allBalls, filters), [allBalls, filters]);
  const activeBallNumbers = useMemo(() => new Set(activeBalls.map(b => b.number)), [activeBalls]);

  const applyInputToState = (inputStr: string) => {
    const nums = smartParseNumbers(inputStr);
    setFilters(prev => ({ ...prev, customNumbers: new Set(nums) }));
  };

  const handleToggle: ToggleFilterFn = (category, value) => {
    setFilters(prev => {
      if (category === 'customMode') return { ...prev, [category]: value };
      const prevSet = prev[category] as Set<any>;
      const newSet = new Set(prevSet);
      if (newSet.has(value)) newSet.delete(value);
      else newSet.add(value);
      return { ...prev, [category]: newSet };
    });
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setCustomInput('');
    showToast("已重置所有条件");
  };
  
  const handleClearCustom = () => {
    setCustomInput('');
    setFilters(prev => ({ ...prev, customNumbers: new Set() }));
  };

  const handleCopy = () => {
    const numbers = activeBalls.map(b => b.number.toString().padStart(2, '0')).join(' ');
    // Format: "01 02 ... (共XX个号码)"
    const content = `${numbers} (共${activeBalls.length}个号码)`;
    
    navigator.clipboard.writeText(content).then(() => {
      showToast(`已复制 ${activeBalls.length} 个号码!`);
    });
  };

  const showToast = (msg: string) => {
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
  }

  const handleMenuAction = (action: string) => {
      switch(action) {
          case 'calc': controlPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
          case 'nav': gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
          case 'tools': copyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
          default: showToast("该功能即将上线，敬请期待！");
      }
  }

  const handleApplyCustom = () => {
    applyInputToState(customInput);
    showToast("号码已应用");
  };

  const handleBallToggle = (num: number) => {
    const ball = allBalls.find(b => b.number === num);
    const isZodiacExcluded = ball && filters.zodiacs.has(ball.zodiac);

    if (isZodiacExcluded) {
        const zodiacSiblings = allBalls
            .filter(b => b.zodiac === ball.zodiac && b.number !== num)
            .map(b => b.number);
            
        const newCustomNumbers = new Set(filters.customNumbers);
        zodiacSiblings.forEach(n => newCustomNumbers.add(n));
        newCustomNumbers.delete(num);
        
        const newZodiacs = new Set(filters.zodiacs);
        newZodiacs.delete(ball.zodiac);
        
        const sorted = Array.from(newCustomNumbers).sort((a, b) => a - b);
        const newStr = sorted.map(n => n.toString().padStart(2, '0')).join(' ');
        
        setCustomInput(newStr);
        setFilters(prev => ({
            ...prev,
            zodiacs: newZodiacs,
            customNumbers: newCustomNumbers,
            customMode: 'exclude'
        }));
        
        showToast(`已恢复 ${num} (解除 ${ball.zodiac}肖 屏蔽)`);
        return;
    }

    const currentNums = smartParseNumbers(customInput);
    const set = new Set(currentNums);
    if (set.has(num)) set.delete(num);
    else set.add(num);
    
    const sorted = Array.from(set).sort((a, b) => a - b);
    const newStr = sorted.map(n => n.toString().padStart(2, '0')).join(' ');
    setCustomInput(newStr);
    applyInputToState(newStr);
    if (filters.customMode !== 'exclude') {
        handleToggle('customMode', 'exclude');
    }
  };

  const handleZodiacToggle = (zodiac: string) => {
    const isZodiacExcluded = filters.zodiacs.has(zodiac);
    
    if (isZodiacExcluded && filters.customMode === 'exclude') {
        const zodiacNumbers = allBalls
            .filter(b => b.zodiac === zodiac)
            .map(b => b.number);
            
        const hasOverlap = zodiacNumbers.some(n => filters.customNumbers.has(n));
        
        if (hasOverlap) {
            const newCustomNumbers = new Set(filters.customNumbers);
            zodiacNumbers.forEach(n => newCustomNumbers.delete(n));
            
            const sorted = Array.from(newCustomNumbers).sort((a, b) => a - b);
            const newStr = sorted.map(n => n.toString().padStart(2, '0')).join(' ');
            setCustomInput(newStr);
            
            setFilters(prev => {
                const newZodiacs = new Set(prev.zodiacs);
                newZodiacs.delete(zodiac);
                return {
                    ...prev,
                    zodiacs: newZodiacs,
                    customNumbers: newCustomNumbers
                };
            });
            return;
        }
    }
    
    handleToggle('zodiacs', zodiac);
  };
  
  const HistoryModal = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<LotteryResult[]>([]);

    useEffect(() => {
        if (historyOpen) {
            loadHistory();
        }
    }, [historyOpen]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const results = await fetchRecentHistory();
            setData(results);
        } catch (e) {
            showToast("查询失败");
        } finally {
            setLoading(false);
        }
    };

    if (!historyOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md md:max-w-2xl h-[80vh] flex flex-col animate-scale-in overflow-hidden">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-800">往期查询 (近30期)</h3>
                        {loading && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
                    </div>
                    <button onClick={() => setHistoryOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5"/></button>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="flex-1 overflow-y-auto">
                        <div className="sticky top-0 bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center z-10">
                            <span className="text-xs font-bold text-blue-700">截止日期: {new Date().toLocaleDateString()}</span>
                            <span className="text-xs text-blue-600">共找到 {data.length} 条记录</span>
                        </div>
                        
                        {loading && data.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-48 text-gray-400 space-y-2">
                                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></span>
                                <p className="text-xs">正在从开奖网获取数据...</p>
                            </div>
                        )}
                        
                        {!loading && data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400 space-y-2">
                                <AlertTriangle className="w-8 h-8 opacity-50" />
                                <p>未找到相关记录</p>
                                <p className="text-xs text-gray-300 px-10 text-center">可能是网络访问受限(CORS)或API无响应。</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-white sticky top-[33px] z-10 shadow-sm">
                                    <tr className="text-gray-500 text-xs bg-gray-50">
                                        <th className="p-2 text-left w-20 pl-4">期数</th>
                                        <th className="p-2 text-left w-24">日期</th>
                                        <th className="p-2 text-left">号码</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.map((row) => {
                                        const resultDate = new Date(row.openTime);
                                        const resultYear = isNaN(resultDate.getFullYear()) ? new Date().getFullYear() : resultDate.getFullYear();
                                        return (
                                        <tr key={row.issue} className="hover:bg-blue-50 transition-colors">
                                            <td className="p-2 font-mono font-bold text-blue-600 text-xs pl-4">{row.issue}期</td>
                                            <td className="p-2 text-gray-400 font-mono text-xs">{row.openTime.split(' ')[0]}</td>
                                            <td className="p-2">
                                                <div className="flex gap-1 flex-wrap">
                                                    {row.openCode.split(',').map((n, i, arr) => {
                                                        const num = parseInt(n);
                                                        const isSpecial = i === arr.length - 1;
                                                        const attrs = getBallAttributes(num, resultYear);
                                                        return (
                                                            <div key={i} className="flex flex-col items-center">
                                                                <div className={`
                                                                    w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                                                                    ${isSpecial ? 'bg-red-500' : 
                                                                      attrs.color === 'RED' ? 'bg-red-500' : 
                                                                      attrs.color === 'BLUE' ? 'bg-blue-500' : 'bg-green-500'}
                                                                `}>
                                                                    {n}
                                                                </div>
                                                                <span className="text-[9px] text-gray-400 mt-0.5">{attrs.zodiac}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
  }
  
  const HelpModal = () => {
      if (!helpOpen) return null;
      return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-4 relative">
                 <button onClick={() => setHelpOpen(false)} className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full"><X className="w-4 h-4"/></button>
                 <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-600"/> 使用说明</h3>
                 <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
                     <p>1. <strong>杀码/去码</strong>: 点击网格中的号码，或在右下角输入框输入号码，该号码将被排除。</p>
                     <p>2. <strong>复位</strong>: 点击网格右下角的“复位”按钮，会清空所有输入并恢复49个号码。</p>
                     <p>3. <strong>历史记录</strong>: 顶部开奖栏右侧“往期查询”可查看最近30期数据。</p>
                 </div>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header 
        latestResult={latestResult} 
        onHomeClick={handleReset}
        onHistoryClick={() => setHistoryOpen(true)}
        onHelpClick={() => setHelpOpen(true)}
        onMenuAction={handleMenuAction}
      />

      {notification && (
          <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2 animate-bounce-in text-sm font-bold">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>{notification}</span>
          </div>
      )}

      <HistoryModal />
      <HelpModal />

      <main className="flex-grow max-w-5xl mx-auto p-2 space-y-2 w-full">
        
        {/* Ball Grid & Year Selector (Merged) */}
        <div ref={gridRef}>
            <BallGrid 
            balls={allBalls} 
            filteredBalls={activeBallNumbers} 
            onBallClick={handleBallToggle}
            onZodiacClick={handleZodiacToggle}
            excludedZodiacs={filters.zodiacs}
            onCopy={handleCopy}
            onReset={handleReset}
            year={year}
            setYear={setYear}
            remainingCount={activeBalls.length}
            />
        </div>

        {/* Control Panel - Compact */}
        <div ref={controlPanelRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                    筛选条件
                </h2>
            </div>
            <ControlPanel 
                filters={filters} 
                onToggle={handleToggle} 
                resetFilters={handleReset} 
                copyRemaining={handleCopy}
                filteredCount={activeBalls.length}
                customInput={customInput}
                setCustomInput={setCustomInput}
                onApplyCustom={handleApplyCustom}
                onClearCustom={handleClearCustom}
            />
        </div>

      </main>

      <footer className="bg-white border-t border-gray-200 py-2 text-center mt-2">
        <p className="text-[10px] text-gray-400">© {new Date().getFullYear()} 智选码师 Pro v2025.02</p>
      </footer>
    </div>
  );
};

export default App;