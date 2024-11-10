export function utf16ToUtf8ByteLength(str: string, start: number, end: number = str.length): number {
    let byteLength = 0;
    for (let i = start; i < end; i++) {
      const code = str.charCodeAt(i);
      if (code <= 0x7f) {
        byteLength += 1;
      } else if (code <= 0x7ff) {
        byteLength += 2;
      } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < str.length) {
        // High surrogate, and there is a next character
        const nextCode = str.charCodeAt(i + 1);
        if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
          // Low surrogate
          byteLength += 4;
          i++; // Skip next code point as it's part of the surrogate pair
        } else {
          byteLength += 3;
        }
      } else {
        byteLength += 3;
      }
    }
    return byteLength;
  }
  
  export function getUtf8BytePositions(text: string): { start: number; end: number }[] {
    const positions: { start: number; end: number }[] = [];
    let bytePos = 0;
  
    for (let i = 0; i < text.length; i++) {
      const start = bytePos;
      const charLength = utf16ToUtf8ByteLength(text, i, i + 1);
      bytePos += charLength;
      positions.push({ start, end: bytePos });
    }
  
    return positions;
  }