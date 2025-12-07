
import { ZODIACS, NUMBER_COLORS, NUMBER_ELEMENTS, ZODIAC_ATTRS } from '../constants';
import { BallData, FilterState, Color } from '../types';

// Helper to calculate the zodiac index for a given year
const getZodiacIndex = (year: number) => {
  const referenceYear = 2024;
  const referenceZodiacIndex = 4; // Dragon
  
  const yearDiff = year - referenceYear;
  let currentYearZodiacIndex = (referenceZodiacIndex + yearDiff) % 12;
  if (currentYearZodiacIndex < 0) currentYearZodiacIndex += 12;
  return currentYearZodiacIndex;
};

export const getBallData = (year: number): BallData[] => {
  const currentYearZodiacIndex = getZodiacIndex(year);
  const balls: BallData[] = [];

  for (let num = 1; num <= 49; num++) {
    let zodiacIndex = (currentYearZodiacIndex - (num - 1)) % 12;
    if (zodiacIndex < 0) zodiacIndex += 12;

    balls.push({
      number: num,
      color: NUMBER_COLORS[num],
      zodiac: ZODIACS[zodiacIndex],
      element: NUMBER_ELEMENTS[num]
    });
  }

  return balls;
};

// New helper to get attributes for a single number in a specific year
export const getBallAttributes = (num: number, year: number) => {
    const currentYearZodiacIndex = getZodiacIndex(year);
    let zodiacIndex = (currentYearZodiacIndex - (num - 1)) % 12;
    if (zodiacIndex < 0) zodiacIndex += 12;
    
    return {
        number: num,
        color: NUMBER_COLORS[num],
        zodiac: ZODIACS[zodiacIndex],
        element: NUMBER_ELEMENTS[num]
    };
};

export const filterBalls = (balls: BallData[], filters: FilterState): BallData[] => {
  return balls.filter(ball => {
    const num = ball.number;
    const tail = num % 10;
    const head = Math.floor(num / 10);
    const sum = tail + head;
    const sumTail = sum % 10;
    
    // --- 1. Custom Manual Filter (Highest Priority) ---
    if (filters.customNumbers.size > 0) {
      if (filters.customMode === 'keep') {
        if (!filters.customNumbers.has(num)) return false;
      } else if (filters.customMode === 'exclude') {
        if (filters.customNumbers.has(num)) return false;
      }
    } else if (filters.customMode === 'keep') {
        // If keep mode is strictly ON but no numbers entered, result is empty
        return false;
    }

    // --- 2. Basic Attribute Kill Filters ---
    if (filters.tails.has(tail)) return false;
    if (filters.heads.has(head)) return false;
    if (filters.zodiacs.has(ball.zodiac)) return false;
    if (filters.colors.has(ball.color)) return false;
    if (filters.elements.has(ball.element)) return false;

    // --- 3. Number Property Filters ---
    const isOdd = num % 2 !== 0;
    const isBig = num >= 25; // 25-49 is Big, 1-24 is Small
    
    // Parity
    if (filters.parity.has('odd') && isOdd) return false;
    if (filters.parity.has('even') && !isOdd) return false;

    // Size
    if (filters.size.has('big') && isBig) return false;
    if (filters.size.has('small') && !isBig) return false;

    // Tail Size
    // Big Tail: 5,6,7,8,9. Small Tail: 0,1,2,3,4.
    const isBigTail = tail >= 5;
    if (filters.tailSize.has('big') && isBigTail) return false;
    if (filters.tailSize.has('small') && !isBigTail) return false;

    // --- 4. Sum Filters (Digit Sum) ---
    // Specific sums (1, 2, ..., 13)
    if (filters.digitSums.has(sum)) return false;
    
    // Sum Parity/Size
    const isSumOdd = sum % 2 !== 0;
    const isSumBig = sum >= 7; // Usually 7-13 is Big, 1-6 is Small for Sum
    if (filters.sumParity.has('odd') && isSumOdd) return false;
    if (filters.sumParity.has('even') && !isSumOdd) return false;
    if (filters.sumSize.has('big') && isSumBig) return false;
    if (filters.sumSize.has('small') && !isSumBig) return false;

    // Sum Tail (0-9)
    if (filters.sumTails.has(sumTail)) return false;

    // --- 5. Composite Filters ---
    
    // Half Wave (Color + Parity)
    // Keys: RED_odd, RED_even, BLUE_odd, etc.
    const colorKey = ball.color.toString(); // RED, BLUE, GREEN
    const parityKey = isOdd ? 'odd' : 'even';
    const halfWaveKey = `${colorKey}_${parityKey}`;
    if (filters.compositeHalfWave.has(halfWaveKey)) return false;

    // Half Head (Head + Parity)
    // Keys: 0_odd, 0_even, etc.
    const halfHeadKey = `${head}_${parityKey}`;
    if (filters.compositeHalfHead.has(halfHeadKey)) return false;

    // Half Parity (Size + Parity)
    // Keys: big_odd, big_even, small_odd, small_even
    const sizeKey = isBig ? 'big' : 'small';
    const halfParityKey = `${sizeKey}_${parityKey}`;
    if (filters.compositeHalfParity.has(halfParityKey)) return false;

    // --- 6. Zodiac Attribute Filters ---
    const attrs = ZODIAC_ATTRS[ball.zodiac];
    if (attrs) {
      if (filters.zodiacSkyGround.has(attrs.skyGround)) return false;
      if (filters.zodiacDomesticWild.has(attrs.domesticWild)) return false;
      if (filters.zodiacFrontBack.has(attrs.frontBack)) return false;
      if (filters.zodiacYinYang.has(attrs.yinYang)) return false;
      if (filters.zodiacLuck.has(attrs.lucky)) return false;
      
      const isStrokeOdd = attrs.strokes % 2 !== 0;
      if (filters.zodiacStrokes.has('odd') && isStrokeOdd) return false;
      if (filters.zodiacStrokes.has('even') && !isStrokeOdd) return false;
    }

    // --- 7. Modulo Filters ---
    if (filters.mod3.has(num % 3)) return false;
    if (filters.mod4.has(num % 4)) return false;
    if (filters.mod6.has(num % 6)) return false;
    if (filters.mod7.has(num % 7)) return false;

    // --- 8. Segments ---
    // 1: 01-07, 2: 08-14, ... 7: 43-49
    const segment = Math.ceil(num / 7);
    if (filters.segments.has(segment)) return false;

    return true;
  });
};
