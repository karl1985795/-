
export enum Color {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
}

export enum ElementType {
  GOLD = '金',
  WOOD = '木',
  WATER = '水',
  FIRE = '火',
  EARTH = '土',
}

export interface BallData {
  number: number;
  color: Color;
  zodiac: string;
  element: ElementType;
}

export interface LotteryResult {
  issue: string;
  openCode: string; // "01,02,03..."
  openTime: string;
  wave?: string;
  zodiac?: string;
}

export interface FilterState {
  // --- 1. Basic Number Properties ---
  tails: Set<number>;      // 0-9
  heads: Set<number>;      // 0-4
  zodiacs: Set<string>;    // Rat..Pig
  colors: Set<Color>;      // Red, Blue, Green
  elements: Set<ElementType>; // Gold..Earth

  // --- 2. Calculated Properties ---
  digitSums: Set<number>;   // Sum of digits (1-13)
  sumTails: Set<number>;    // (Head + Tail) % 10 (0-9)
  mod3: Set<number>;        // 0-2
  mod4: Set<number>;        // 0-3
  mod6: Set<number>;        // 0-5
  mod7: Set<number>;        // 0-6
  segments: Set<number>;    // 1-7 (Groups of 7 numbers)

  // --- 3. Boolean/Binary Properties (Check to Kill) ---
  // Using Sets of strings for flexible toggles. 
  // e.g. 'odd', 'even', 'big', 'small'
  
  // Parity & Size
  parity: Set<'odd' | 'even'>;
  size: Set<'big' | 'small'>;
  
  // Tail Properties
  tailSize: Set<'big' | 'small'>; // Big Tail (5-9), Small Tail (0-4)
  
  // Sum Properties
  sumParity: Set<'odd' | 'even'>; // Sum Odd/Even
  sumSize: Set<'big' | 'small'>;  // Sum Big/Small
  
  // Zodiac Attributes
  zodiacSkyGround: Set<'sky' | 'ground'>;
  zodiacDomesticWild: Set<'domestic' | 'wild'>;
  zodiacFrontBack: Set<'front' | 'back'>;
  zodiacYinYang: Set<'yin' | 'yang'>;
  zodiacLuck: Set<'lucky' | 'unlucky'>;
  zodiacStrokes: Set<'odd' | 'even'>; // Stroke count of Zodiac char

  // --- 4. Composite Filters (Half Wave, Half Head, Half Parity) ---
  // Stored as specific string keys, e.g. "red_odd", "0_odd", "big_odd"
  compositeHalfWave: Set<string>; // color_parity (e.g. red_odd)
  compositeHalfHead: Set<string>; // head_parity (e.g. 0_odd)
  compositeHalfParity: Set<string>; // size_parity (e.g. small_odd)
  
  // --- 5. Manual ---
  customMode: 'exclude' | 'keep'; 
  customNumbers: Set<number>; 
}

export type ToggleFilterFn = (category: keyof FilterState, value: any) => void;
