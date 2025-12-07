
import { Color, ElementType } from './types';

export const ZODIACS = [
  '鼠', '牛', '虎', '兔', '龙', '蛇', 
  '马', '羊', '猴', '鸡', '狗', '猪'
];

export const NUMBER_COLORS: Record<number, Color> = {
  1: Color.RED, 2: Color.RED, 7: Color.RED, 8: Color.RED, 12: Color.RED, 13: Color.RED,
  18: Color.RED, 19: Color.RED, 23: Color.RED, 24: Color.RED, 29: Color.RED, 30: Color.RED,
  34: Color.RED, 35: Color.RED, 40: Color.RED, 45: Color.RED, 46: Color.RED,
  
  3: Color.BLUE, 4: Color.BLUE, 9: Color.BLUE, 10: Color.BLUE, 14: Color.BLUE, 15: Color.BLUE,
  20: Color.BLUE, 25: Color.BLUE, 26: Color.BLUE, 31: Color.BLUE, 36: Color.BLUE, 37: Color.BLUE,
  41: Color.BLUE, 42: Color.BLUE, 47: Color.BLUE, 48: Color.BLUE,
  
  5: Color.GREEN, 6: Color.GREEN, 11: Color.GREEN, 16: Color.GREEN, 17: Color.GREEN, 21: Color.GREEN,
  22: Color.GREEN, 27: Color.GREEN, 28: Color.GREEN, 32: Color.GREEN, 33: Color.GREEN, 38: Color.GREEN,
  39: Color.GREEN, 43: Color.GREEN, 44: Color.GREEN, 49: Color.GREEN
};

export const NUMBER_ELEMENTS: Record<number, ElementType> = {
  1: ElementType.FIRE, 2: ElementType.FIRE, 3: ElementType.EARTH, 4: ElementType.EARTH,
  5: ElementType.WOOD, 6: ElementType.WOOD, 7: ElementType.GOLD, 8: ElementType.GOLD,
  9: ElementType.WATER, 10: ElementType.WATER, 11: ElementType.FIRE, 12: ElementType.FIRE,
  13: ElementType.EARTH, 14: ElementType.EARTH, 15: ElementType.WOOD, 16: ElementType.WOOD,
  17: ElementType.GOLD, 18: ElementType.GOLD, 19: ElementType.WATER, 20: ElementType.WATER,
  21: ElementType.FIRE, 22: ElementType.FIRE, 23: ElementType.EARTH, 24: ElementType.EARTH,
  25: ElementType.WOOD, 26: ElementType.WOOD, 27: ElementType.GOLD, 28: ElementType.GOLD,
  29: ElementType.WATER, 30: ElementType.WATER, 31: ElementType.FIRE, 32: ElementType.FIRE,
  33: ElementType.EARTH, 34: ElementType.EARTH, 35: ElementType.WOOD, 36: ElementType.WOOD,
  37: ElementType.GOLD, 38: ElementType.GOLD, 39: ElementType.WATER, 40: ElementType.WATER,
  41: ElementType.FIRE, 42: ElementType.FIRE, 43: ElementType.EARTH, 44: ElementType.EARTH,
  45: ElementType.WOOD, 46: ElementType.WOOD, 47: ElementType.GOLD, 48: ElementType.GOLD,
  49: ElementType.WATER
};

// --- Zodiac Attributes ---
// These are static properties of the Zodiac animals.

export const ZODIAC_ATTRS: Record<string, {
  skyGround: 'sky' | 'ground';
  domesticWild: 'domestic' | 'wild';
  yinYang: 'yin' | 'yang';
  frontBack: 'front' | 'back';
  lucky: 'lucky' | 'unlucky';
  strokes: number;
}> = {
  '鼠': { skyGround: 'ground', domesticWild: 'wild', yinYang: 'yang', frontBack: 'front', lucky: 'unlucky', strokes: 13 },
  '牛': { skyGround: 'sky', domesticWild: 'domestic', yinYang: 'yin', frontBack: 'front', lucky: 'unlucky', strokes: 4 },
  '虎': { skyGround: 'ground', domesticWild: 'wild', yinYang: 'yang', frontBack: 'front', lucky: 'unlucky', strokes: 8 },
  '兔': { skyGround: 'sky', domesticWild: 'wild', yinYang: 'yin', frontBack: 'front', lucky: 'lucky', strokes: 8 },
  '龙': { skyGround: 'sky', domesticWild: 'wild', yinYang: 'yang', frontBack: 'front', lucky: 'lucky', strokes: 5 },
  '蛇': { skyGround: 'ground', domesticWild: 'wild', yinYang: 'yin', frontBack: 'front', lucky: 'lucky', strokes: 11 },
  '马': { skyGround: 'sky', domesticWild: 'domestic', yinYang: 'yang', frontBack: 'back', lucky: 'lucky', strokes: 3 },
  '羊': { skyGround: 'ground', domesticWild: 'domestic', yinYang: 'yin', frontBack: 'back', lucky: 'lucky', strokes: 6 },
  '猴': { skyGround: 'sky', domesticWild: 'wild', yinYang: 'yang', frontBack: 'back', lucky: 'lucky', strokes: 12 },
  '鸡': { skyGround: 'ground', domesticWild: 'domestic', yinYang: 'yin', frontBack: 'back', lucky: 'lucky', strokes: 7 },
  '狗': { skyGround: 'ground', domesticWild: 'domestic', yinYang: 'yang', frontBack: 'back', lucky: 'unlucky', strokes: 8 },
  '猪': { skyGround: 'sky', domesticWild: 'domestic', yinYang: 'yin', frontBack: 'back', lucky: 'unlucky', strokes: 11 },
};
// Note: Lucky/Unlucky classification varies by region/book. 
// Standard "Lucky" (吉): 兔, 龙, 蛇, 马, 羊, 鸡. "Unlucky" (凶): 鼠, 牛, 虎, 猴, 狗, 猪.
// Sky (天): 牛, 兔, 龙, 马, 猴, 猪. Ground (地): 鼠, 虎, 蛇, 羊, 鸡, 狗.
// Domestic (家): 牛, 马, 羊, 鸡, 狗, 猪. Wild (野): 鼠, 虎, 兔, 龙, 蛇, 猴.
