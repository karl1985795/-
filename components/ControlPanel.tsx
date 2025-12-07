
import React from 'react';
import { FilterState, ToggleFilterFn, ElementType, Color } from '../types';

interface ControlPanelProps {
  filters: FilterState;
  onToggle: ToggleFilterFn;
  resetFilters: () => void;
  copyRemaining: () => void;
  filteredCount: number;
  customInput: string;
  setCustomInput: (val: string) => void;
  onApplyCustom: () => void;
  onClearCustom: () => void;
}

const Checkbox: React.FC<{ 
  label: string; 
  checked: boolean; 
  onChange: () => void;
  className?: string;
  labelClass?: string;
}> = ({ label, checked, onChange, className = "", labelClass = "text-gray-700" }) => (
  <label className={`flex items-center space-x-1 cursor-pointer hover:bg-gray-50 rounded select-none ${className}`}>
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={onChange}
      className="w-3 h-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
    />
    <span className={`text-[11px] ${labelClass}`}>{label}</span>
  </label>
);

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`border border-gray-200 rounded p-1.5 bg-white shadow-sm ${className}`}>
    <h3 className="text-[11px] font-bold text-blue-800 mb-1 border-b border-gray-100 pb-0.5">{title}</h3>
    <div className="flex flex-wrap gap-y-1 gap-x-2">
      {children}
    </div>
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  filters, 
  onToggle, 
  customInput,
  setCustomInput,
  onApplyCustom,
  onClearCustom
}) => {

  const renderGrid = (items: any[], category: keyof FilterState, labelFn: (i: any) => string) => {
    return (
        <div className="grid grid-cols-5 gap-y-1 gap-x-1 w-full">
            {items.map(item => (
                <Checkbox 
                    key={item}
                    label={labelFn(item)}
                    checked={(filters[category] as Set<any>).has(item)}
                    onChange={() => onToggle(category, item)}
                />
            ))}
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 p-1.5 bg-gray-50 text-xs">
      
      {/* === LEFT COLUMN === */}
      <div className="flex flex-col gap-1.5">
        
        {/* 1. Tail Filters */}
        <Section title="杀大尾、尾数">
          <div className="w-full mb-1 flex gap-3">
             <Checkbox label="大尾(5-9)" checked={filters.tailSize.has('big')} onChange={() => onToggle('tailSize', 'big')} />
             <Checkbox label="小尾(0-4)" checked={filters.tailSize.has('small')} onChange={() => onToggle('tailSize', 'small')} />
          </div>
          {renderGrid([0,1,2,3,4,5,6,7,8,9], 'tails', i => `${i}尾`)}
        </Section>

        {/* 2. Sum Filters (Digit Sum) */}
        <Section title="杀合数">
           <div className="w-full flex flex-wrap gap-2 mb-1">
              <Checkbox label="合单" checked={filters.sumParity.has('odd')} onChange={() => onToggle('sumParity', 'odd')} />
              <Checkbox label="合双" checked={filters.sumParity.has('even')} onChange={() => onToggle('sumParity', 'even')} />
              <Checkbox label="合大" checked={filters.sumSize.has('big')} onChange={() => onToggle('sumSize', 'big')} />
              <Checkbox label="合小" checked={filters.sumSize.has('small')} onChange={() => onToggle('sumSize', 'small')} />
              <Checkbox label="13点" checked={filters.digitSums.has(13)} onChange={() => onToggle('digitSums', 13)} />
           </div>
           {renderGrid([1,2,3,4,5,6,7,8,9,10,11,12], 'digitSums', i => `${i}点`)}
        </Section>

        {/* 3. Big/Small & Half Wave */}
        <Section title="杀大小、半波">
           <div className="w-full flex gap-3 mb-1">
              <Checkbox label="大数" checked={filters.size.has('big')} onChange={() => onToggle('size', 'big')} />
              <Checkbox label="小数" checked={filters.size.has('small')} onChange={() => onToggle('size', 'small')} />
           </div>
           <div className="grid grid-cols-4 gap-1 w-full">
              <Checkbox label="红单" checked={filters.compositeHalfWave.has('RED_odd')} onChange={() => onToggle('compositeHalfWave', 'RED_odd')} labelClass="text-red-600" />
              <Checkbox label="蓝单" checked={filters.compositeHalfWave.has('BLUE_odd')} onChange={() => onToggle('compositeHalfWave', 'BLUE_odd')} labelClass="text-blue-600" />
              <Checkbox label="绿单" checked={filters.compositeHalfWave.has('GREEN_odd')} onChange={() => onToggle('compositeHalfWave', 'GREEN_odd')} labelClass="text-green-600" />
              <Checkbox label="红双" checked={filters.compositeHalfWave.has('RED_even')} onChange={() => onToggle('compositeHalfWave', 'RED_even')} labelClass="text-red-600" />
              <Checkbox label="蓝双" checked={filters.compositeHalfWave.has('BLUE_even')} onChange={() => onToggle('compositeHalfWave', 'BLUE_even')} labelClass="text-blue-600" />
              <Checkbox label="绿双" checked={filters.compositeHalfWave.has('GREEN_even')} onChange={() => onToggle('compositeHalfWave', 'GREEN_even')} labelClass="text-green-600" />
           </div>
        </Section>

        {/* 4. Half Head */}
        <Section title="杀半头">
           <div className="grid grid-cols-4 gap-x-1 gap-y-1 w-full">
              {[0,1,2,3,4].map(h => (
                  <React.Fragment key={h}>
                    <Checkbox label={`${h}头单`} checked={filters.compositeHalfHead.has(`${h}_odd`)} onChange={() => onToggle('compositeHalfHead', `${h}_odd`)} />
                    <Checkbox label={`${h}头双`} checked={filters.compositeHalfHead.has(`${h}_even`)} onChange={() => onToggle('compositeHalfHead', `${h}_even`)} />
                  </React.Fragment>
              ))}
           </div>
        </Section>
      </div>

      {/* === CENTER COLUMN === */}
      <div className="flex flex-col gap-1.5">
        
        {/* 1. Sum Tail */}
        <Section title="杀合尾">
           {renderGrid([0,1,2,3,4,5,6,7,8,9], 'sumTails', i => `${i}合`)}
        </Section>

        {/* 2. Elements */}
        <Section title="杀五行">
           <div className="grid grid-cols-5 gap-1 w-full">
            {Object.values(ElementType).map(elm => (
                <Checkbox key={elm} label={elm} checked={filters.elements.has(elm)} onChange={() => onToggle('elements', elm)} />
            ))}
           </div>
        </Section>

        {/* 3. Parity, Domestic/Wild, Size Parity */}
        <Section title="杀单双、家野、半单双">
           <div className="grid grid-cols-4 gap-1 w-full mb-1">
              <Checkbox label="单数" checked={filters.parity.has('odd')} onChange={() => onToggle('parity', 'odd')} />
              <Checkbox label="双数" checked={filters.parity.has('even')} onChange={() => onToggle('parity', 'even')} />
              <Checkbox label="家禽" checked={filters.zodiacDomesticWild.has('domestic')} onChange={() => onToggle('zodiacDomesticWild', 'domestic')} />
              <Checkbox label="野兽" checked={filters.zodiacDomesticWild.has('wild')} onChange={() => onToggle('zodiacDomesticWild', 'wild')} />
           </div>
           <div className="grid grid-cols-4 gap-1 w-full">
              <Checkbox label="小单" checked={filters.compositeHalfParity.has('small_odd')} onChange={() => onToggle('compositeHalfParity', 'small_odd')} />
              <Checkbox label="小双" checked={filters.compositeHalfParity.has('small_even')} onChange={() => onToggle('compositeHalfParity', 'small_even')} />
              <Checkbox label="大单" checked={filters.compositeHalfParity.has('big_odd')} onChange={() => onToggle('compositeHalfParity', 'big_odd')} />
              <Checkbox label="大双" checked={filters.compositeHalfParity.has('big_even')} onChange={() => onToggle('compositeHalfParity', 'big_even')} />
           </div>
        </Section>

        {/* 4. Color & Heads */}
        <Section title="杀波色、头数">
            <div className="flex gap-3 mb-1">
                <Checkbox label="红波" checked={filters.colors.has(Color.RED)} onChange={() => onToggle('colors', Color.RED)} labelClass="text-red-600 font-bold" />
                <Checkbox label="蓝波" checked={filters.colors.has(Color.BLUE)} onChange={() => onToggle('colors', Color.BLUE)} labelClass="text-blue-600 font-bold" />
                <Checkbox label="绿波" checked={filters.colors.has(Color.GREEN)} onChange={() => onToggle('colors', Color.GREEN)} labelClass="text-green-600 font-bold" />
            </div>
            {renderGrid([0,1,2,3,4], 'heads', i => `${i}头`)}
        </Section>

        {/* 5. Zodiac Misc */}
        <Section title="杀阴阳肖、吉凶、笔画">
           <div className="grid grid-cols-4 gap-1 w-full">
              <Checkbox label="阴肖" checked={filters.zodiacYinYang.has('yin')} onChange={() => onToggle('zodiacYinYang', 'yin')} />
              <Checkbox label="阳肖" checked={filters.zodiacYinYang.has('yang')} onChange={() => onToggle('zodiacYinYang', 'yang')} />
              <Checkbox label="吉肖" checked={filters.zodiacLuck.has('lucky')} onChange={() => onToggle('zodiacLuck', 'lucky')} />
              <Checkbox label="凶肖" checked={filters.zodiacLuck.has('unlucky')} onChange={() => onToggle('zodiacLuck', 'unlucky')} />
              <Checkbox label="单笔画" checked={filters.zodiacStrokes.has('odd')} onChange={() => onToggle('zodiacStrokes', 'odd')} />
              <Checkbox label="双笔画" checked={filters.zodiacStrokes.has('even')} onChange={() => onToggle('zodiacStrokes', 'even')} />
           </div>
        </Section>
      </div>

      {/* === RIGHT COLUMN === */}
      <div className="flex flex-col gap-1.5">
        
        {/* 1. Custom Numbers */}
        <div className="border border-blue-200 rounded p-1.5 bg-blue-50 shadow-sm">
           <div className="flex items-center justify-between mb-1">
             <span className="text-[11px] font-bold text-blue-800">杀码 / 出码</span>
             <div className="flex gap-2">
                 <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" checked={filters.customMode === 'exclude'} onChange={() => onToggle('customMode', 'exclude')} className="text-red-600"/><span className="text-[10px]">杀码</span></label>
                 <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" checked={filters.customMode === 'keep'} onChange={() => onToggle('customMode', 'keep')} className="text-green-600"/><span className="text-[10px]">出码</span></label>
             </div>
           </div>
           <div className="flex gap-1">
              <input value={customInput} onChange={e => setCustomInput(e.target.value)} className="flex-grow p-1 text-xs border border-gray-300 rounded" placeholder="如: 01 02" />
              <button onClick={onApplyCustom} className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] rounded whitespace-nowrap">确定</button>
              <button onClick={onClearCustom} className="px-1.5 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] rounded whitespace-nowrap">清空</button>
           </div>
        </div>

        {/* 2. Segments & Zodiac Position */}
        <Section title="杀段数、天地肖、前后肖">
           {renderGrid([1,2,3,4,5,6,7], 'segments', i => `${i}段`)}
           <div className="grid grid-cols-4 gap-1 w-full mt-1">
              <Checkbox label="天肖" checked={filters.zodiacSkyGround.has('sky')} onChange={() => onToggle('zodiacSkyGround', 'sky')} />
              <Checkbox label="地肖" checked={filters.zodiacSkyGround.has('ground')} onChange={() => onToggle('zodiacSkyGround', 'ground')} />
              <Checkbox label="前肖" checked={filters.zodiacFrontBack.has('front')} onChange={() => onToggle('zodiacFrontBack', 'front')} />
              <Checkbox label="后肖" checked={filters.zodiacFrontBack.has('back')} onChange={() => onToggle('zodiacFrontBack', 'back')} />
           </div>
        </Section>

        {/* 3. Modulos */}
        <Section title="杀模三、模四">
           <div className="flex flex-wrap gap-x-2 gap-y-1 mb-0.5">
             {[0,1,2].map(i => <Checkbox key={i} label={`3余${i}`} checked={filters.mod3.has(i)} onChange={() => onToggle('mod3', i)} />)}
           </div>
           <div className="flex flex-wrap gap-x-2 gap-y-1">
             {[0,1,2,3].map(i => <Checkbox key={i} label={`4余${i}`} checked={filters.mod4.has(i)} onChange={() => onToggle('mod4', i)} />)}
           </div>
        </Section>
        <Section title="杀模六">
            <div className="grid grid-cols-3 gap-1">
              {[0,1,2,3,4,5].map(i => <Checkbox key={i} label={`6余${i}`} checked={filters.mod6.has(i)} onChange={() => onToggle('mod6', i)} />)}
            </div>
        </Section>
        <Section title="杀模七">
            <div className="grid grid-cols-4 gap-1">
              {[0,1,2,3,4,5,6].map(i => <Checkbox key={i} label={`7余${i}`} checked={filters.mod7.has(i)} onChange={() => onToggle('mod7', i)} />)}
            </div>
        </Section>

      </div>

    </div>
  );
};
