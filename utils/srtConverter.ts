const formatTime = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeString = date.toISOString().substr(11, 12);
  return timeString.replace('.', ',');
};

export const textToSrt = (text: string): string => {
  const LONG_SENTENCE_WORD_THRESHOLD = 15; // Words per subtitle line
  const DURATION_PER_WORD = 0.4; // Average reading speed in seconds per word
  const MIN_DURATION = 2.0; // Minimum time a subtitle is displayed
  const GAP_BETWEEN_SUBTITLES = 0.2; // A small pause between subtitles

  // This regex splits the text after '.', ',', '!', or '?' while keeping the delimiter.
  // It looks for the punctuation, and any whitespace after it, and uses a unique separator.
  const separator = '|||';
  const sentences = text
    .replace(/([.,!?])(\s*)/g, `$1$2${separator}`)
    .split(separator)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // If no punctuation is found, treat the whole text as one block to be processed.
  if (sentences.length === 0 && text.trim()) {
      sentences.push(text.trim());
  }

  const finalChunks: string[] = [];

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    if (words.length > LONG_SENTENCE_WORD_THRESHOLD) {
      // For long sentences, split them in the middle.
      const midPoint = Math.ceil(words.length / 2);
      const firstHalf = words.slice(0, midPoint).join(' ');
      const secondHalf = words.slice(midPoint).join(' ');
      finalChunks.push(firstHalf);
      finalChunks.push(secondHalf);
    } else {
      finalChunks.push(sentence);
    }
  }

  let srtContent = '';
  let chunkIndex = 1;
  let startTime = 0;

  for (const chunk of finalChunks) {
    const wordCount = chunk.split(/\s+/).length;
    // Estimate duration based on word count, but not shorter than MIN_DURATION.
    const duration = Math.max(MIN_DURATION, wordCount * DURATION_PER_WORD);
    const endTime = startTime + duration;

    srtContent += `${chunkIndex}\n`;
    srtContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    srtContent += `${chunk}\n\n`;

    startTime = endTime + GAP_BETWEEN_SUBTITLES;
    chunkIndex++;
  }

  return srtContent.trim();
};
