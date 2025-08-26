
// GeminiService.gs
// Tệp này chứa các hàm để tương tác với Gemini API một cách độc lập.
const GeminiService = {};

/**
 * Gửi yêu cầu đến API Gemini để trích xuất thông tin sản phẩm và trả về JSON.
 * @param {string} customerQuery Câu hỏi của khách hàng.
 * @param {string} apiKey Khóa API Gemini.
 * @return {string} Chuỗi JSON chứa thông tin sản phẩm.
 */
GeminiService.extractProductInfo = function(customerQuery, apiKey) {
  const prompt = `Dựa vào câu hỏi của khách hàng, hãy phân tích và trích xuất Tên sản phẩm, Dung tích, Màu sắc và Mô tả ngắn. Nếu không có thông tin nào, hãy để giá trị là 'null'. Trả về kết quả ở dạng JSON.

  Câu hỏi: ${customerQuery}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          "productName": { "type": "STRING" },
          "dungTich": { "type": "STRING" },
          "mauSac": { "type": "STRING" },
          "shortDescription": { "type": "STRING" }
        },
        "propertyOrdering": ["productName", "dungTich", "mauSac", "shortDescription"]
      }
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: {
      'X-goog-api-key': apiKey
    }
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
    return result.candidates[0].content.parts[0].text;
  }
  
  throw new Error("Không thể trích xuất văn bản từ phản hồi của API.");
};

/**
 * Gửi prompt đã được tạo sẵn để lấy phản hồi cuối cùng.
 * @param {string} finalPrompt Prompt đã có thông tin từ Google Sheet.
 * @param {string} apiKey Khóa API Gemini.
 * @return {string} Phản hồi văn bản từ Gemini.
 */
GeminiService.getFinalResponse = function(finalPrompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
  const payload = {
    contents: [{
      parts: [{
        text: finalPrompt
      }]
    }]
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: {
      'X-goog-api-key': apiKey
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
    return result.candidates[0].content.parts[0].text;
  }
  
  throw new Error("Không thể trích xuất văn bản từ phản hồi của API.");
};
