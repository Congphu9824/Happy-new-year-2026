import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini client
// We check for the API key availability in the component layer to show appropriate UI
const ai = new GoogleGenAI({ apiKey });

export const generateNewYearWish = async (): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  try {
    const prompt = `
      Bạn là một nhà thơ và chuyên gia văn hóa Việt Nam.
      Hãy viết một lời chúc Tết ngắn gọn, ý nghĩa, hiện đại nhưng vẫn mang đậm bản sắc văn hóa cho năm 2026 (Năm Bính Ngọ - Con Ngựa).
      Lời chúc nên tập trung vào sự thành công, sức khỏe và may mắn.
      Độ dài khoảng 2-3 câu.
      Chỉ trả về nội dung lời chúc, không thêm dẫn dắt.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Chúc mừng năm mới Bính Ngọ 2026! Vạn sự như ý, tỷ sự như mơ.";
  } catch (error) {
    console.error("Error generating wish:", error);
    throw error;
  }
};