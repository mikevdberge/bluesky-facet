import { getUtf8BytePositions } from './textEncoding';

export function processFacets(text: string): { text: string; facets: any[] } {
  const facets: any[] = [];
  const bytePositions = getUtf8BytePositions(text);
  
  // Process mentions (@username)
  const mentionRegex = /@([a-zA-Z0-9.-]+)/g;
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    const byteStart = bytePositions[match.index].start;
    const byteEnd = bytePositions[match.index + match[0].length - 1].end;
    
    facets.push({
      index: { byteStart, byteEnd },
      features: [{
        $type: "app.bsky.richtext.facet#mention",
        did: match[1]
      }]
    });
  }

  // Process links (http/https URLs)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  while ((match = urlRegex.exec(text)) !== null) {
    const byteStart = bytePositions[match.index].start;
    const byteEnd = bytePositions[match.index + match[0].length - 1].end;
    
    facets.push({
      index: { byteStart, byteEnd },
      features: [{
        $type: "app.bsky.richtext.facet#link",
        uri: match[0]
      }]
    });
  }

  return {
    text,
    facets: facets.sort((a, b) => a.index.byteStart - b.index.byteStart)
  };
}