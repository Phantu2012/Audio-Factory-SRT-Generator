
import { useContext } from 'react';
import { AppContext, Locale } from '../contexts/AppContext';

const translations = {
  en: {
    "header": {
      "title": "Audio Factory",
      "subtitle": "Automated SRT Subtitle Generator",
      "changeApiKey": "Change API Key"
    },
    "tabs": {
      "generator": "Generator",
      "history": "History"
    },
    "apiKey": {
      "title": "Gemini API Key Required",
      "description": "Please enter your Google Gemini API key to activate the Audio Factory. Your key will be stored locally in your browser.",
      "placeholder": "Enter your API key here",
      "ariaLabel": "Gemini API Key",
      "button": "Authorize and Start Production",
      "helpText": "You can get your API key from Google AI Studio."
    },
    "fileUpload": {
      "titleAudio": "Step 1: Upload Audio Material",
      "descriptionAudio": "The machine requires an audio source file (.mp3, .wav, .m4a).",
      "invalidType": "Please select a valid audio file (e.g., MP3, WAV, M4A).",
      "dragDrop": "Drag & drop your audio file here",
      "or": "or",
      "browse": "Browse Files",
      "loadedAudio": "Audio material loaded.",
      "chooseDifferent": "Choose a different file",
      "titleScript": "Step 2: Upload Script File",
      "descriptionScript": "Provide the original script (.txt) to be synchronized with the audio.",
      "invalidScriptType": "Please select a valid text file (.txt).",
      "dragDropScript": "Drag & drop your script file here",
      "loadedScript": "Script material loaded.",
      "chooseDifferentScript": "Choose a different script"
    },
    "settings": {
      "generationLanguage": "Generation Language",
      "maxChars": "Max Characters per Subtitle Line",
      "maxCharsAria": "Maximum characters per subtitle line",
      "maxCharsDescription": "Adjust to split long sentences into new subtitle entries."
    },
    "buttons": {
      "startProduction": "Start Production (Generate SRT)"
    },
    "loader": {
      "title": "Production In Progress",
      "message1": "Engaging transcription protocols...",
      "message2": "Robot is analyzing audio waves...",
      "message3": "Calibrating phonetic synthesizers...",
      "message4": "Assembling text fragments...",
      "message5": "Finalizing production...",
      "message6": "Running quality assurance checks..."
    },
    "transcript": {
      "title": "Synchronization Complete!",
      "description": "Generated SRT for",
      "downloadButton": "Download Package (.srt)",
      "newButton": "Start New Production"
    },
    "history": {
      "title": "Production History",
      "description": "Review, copy, or re-download previously generated subtitle files.",
      "empty": "No items in your history yet.",
      "emptyDescription": "Successfully generated subtitles will appear here.",
      "clearButton": "Clear History",
      "viewButton": "View",
      "downloadButton": "Download",
      "copyButton": "Copy",
      "copied": "Copied!"
    },
    "error": {
      "title": "System Malfunction",
      "restartButton": "Restart Production Line",
      "emptyScript": "The script file appears to be empty.",
      "readScript": "Failed to read the script file.",
      "apiKeyMissing": "API Key is missing. Please re-authorize.",
      "noAudio": "Please select an audio file first.",
      "noScript": "Please provide the script file.",
      "unknown": "An unknown error occurred during SRT generation.",
      "newKeyPrompt": "You will be prompted for a new key.",
      "productionHalt": "Production halt!"
    },
    "footer": {
      "text": "Audio Factory Inc. All rights reserved."
    }
  },
  vi: {
    "header": {
      "title": "Xưởng Âm Thanh",
      "subtitle": "Trình tạo phụ đề SRT tự động",
      "changeApiKey": "Đổi khóa API"
    },
    "tabs": {
      "generator": "Trình tạo",
      "history": "Lịch sử"
    },
    "apiKey": {
      "title": "Yêu cầu khóa API Gemini",
      "description": "Vui lòng nhập khóa API Google Gemini của bạn để kích hoạt Xưởng Âm Thanh. Khóa của bạn sẽ được lưu trữ cục bộ trong trình duyệt.",
      "placeholder": "Nhập khóa API của bạn tại đây",
      "ariaLabel": "Khóa API Gemini",
      "button": "Ủy quyền và Bắt đầu sản xuất",
      "helpText": "Bạn có thể lấy khóa API của mình từ Google AI Studio."
    },
    "fileUpload": {
      "titleAudio": "Bước 1: Tải lên tệp âm thanh",
      "descriptionAudio": "Máy yêu cầu một tệp nguồn âm thanh (.mp3, .wav, .m4a).",
      "invalidType": "Vui lòng chọn một tệp âm thanh hợp lệ (ví dụ: MP3, WAV, M4A).",
      "dragDrop": "Kéo và thả tệp âm thanh của bạn vào đây",
      "or": "hoặc",
      "browse": "Duyệt tệp",
      "loadedAudio": "Đã tải tệp âm thanh.",
      "chooseDifferent": "Chọn một tệp khác",
      "titleScript": "Bước 2: Tải lên tệp kịch bản",
      "descriptionScript": "Cung cấp kịch bản gốc (.txt) để đồng bộ hóa với âm thanh.",
      "invalidScriptType": "Vui lòng chọn một tệp văn bản hợp lệ (.txt).",
      "dragDropScript": "Kéo và thả tệp kịch bản của bạn vào đây",
      "loadedScript": "Đã tải tệp kịch bản.",
      "chooseDifferentScript": "Chọn một kịch bản khác"
    },
    "settings": {
      "generationLanguage": "Ngôn ngữ tạo",
      "maxChars": "Số ký tự tối đa mỗi dòng phụ đề",
      "maxCharsAria": "Số ký tự tối đa mỗi dòng phụ đề",
      "maxCharsDescription": "Điều chỉnh để chia các câu dài thành các mục phụ đề mới."
    },
    "buttons": {
      "startProduction": "Bắt đầu sản xuất (Tạo SRT)"
    },
    "loader": {
      "title": "Đang tiến hành sản xuất",
      "message1": "Đang kích hoạt giao thức phiên âm...",
      "message2": "Robot đang phân tích sóng âm...",
      "message3": "Đang hiệu chỉnh bộ tổng hợp âm vị...",
      "message4": "Đang lắp ráp các đoạn văn bản...",
      "message5": "Hoàn tất sản xuất...",
      "message6": "Đang chạy kiểm tra đảm bảo chất lượng..."
    },
    "transcript": {
      "title": "Đồng bộ hóa hoàn tất!",
      "description": "Tệp SRT đã tạo cho",
      "downloadButton": "Tải xuống gói (.srt)",
      "newButton": "Bắt đầu sản xuất mới"
    },
    "history": {
      "title": "Lịch sử sản xuất",
      "description": "Xem lại, sao chép hoặc tải xuống lại các tệp phụ đề đã tạo trước đây.",
      "empty": "Chưa có mục nào trong lịch sử của bạn.",
      "emptyDescription": "Các phụ đề được tạo thành công sẽ xuất hiện ở đây.",
      "clearButton": "Xóa lịch sử",
      "viewButton": "Xem",
      "downloadButton": "Tải xuống",
      "copyButton": "Sao chép",
      "copied": "Đã sao chép!"
    },
    "error": {
      "title": "Hệ thống gặp sự cố",
      "restartButton": "Khởi động lại dây chuyền sản xuất",
      "emptyScript": "Tệp kịch bản dường như trống.",
      "readScript": "Không thể đọc tệp kịch bản.",
      "apiKeyMissing": "Thiếu khóa API. Vui lòng ủy quyền lại.",
      "noAudio": "Vui lòng chọn một tệp âm thanh trước.",
      "noScript": "Vui lòng cung cấp tệp kịch bản.",
      "unknown": "Đã xảy ra lỗi không xác định trong quá trình tạo SRT.",
      "newKeyPrompt": "Bạn sẽ được yêu cầu nhập khóa mới.",
      "productionHalt": "Sản xuất bị tạm dừng!"
    },
    "footer": {
      "text": "Công ty Xưởng Âm Thanh. Mọi quyền được bảo lưu."
    }
  }
};

const get = (obj: any, path: string): string | undefined => {
  const keys = path.split('.');
  return keys.reduce((res, key) => res?.[key], obj);
};

export const useTranslation = () => {
  const { locale } = useContext(AppContext);

  const t = (key: string): string => {
    const activeTranslations = translations[locale] || translations.en;
    const translation = get(activeTranslations, key);
    
    if (translation === undefined) {
      console.warn(`Translation key not found for locale '${locale}': ${key}`);
      return key;
    }

    return translation;
  };

  return { t, locale };
};
