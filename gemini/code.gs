// code.gs
// Đây là file chính, xử lý các yêu cầu từ client và điều phối các tác vụ.

// Thay thế chuỗi dưới đây bằng Khóa API Gemini của bạn.
const GEMINI_API_KEY = "AIzaSyBpQFaLgBvojVnguDc-Kys5xpPE1DklsZU";
const SPREADSHEET_ID = "1Gi2zVHGhib-XOQXizfhki7YT6x356blL3gkA_KGNGGM"; // Thay thế bằng ID Google Sheet của bạn

/**
 * Phục vụ tệp HTML khi ứng dụng web được truy cập.
 * @return {HtmlOutput} Nội dung HTML của tệp index.html.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}

/**
 * Xử lý yêu cầu của người dùng theo mô hình nâng cao:
 * 1. Trích xuất thông tin sản phẩm từ câu hỏi bằng Gemini API.
 * 2. Tìm kiếm dữ liệu sản phẩm trong Google Sheet.
 * 3. Dùng dữ liệu tìm được để tạo prompt mới cho Gemini.
 * 4. Trả về phản hồi cuối cùng cho người dùng.
 * @param {string} customerQuery Câu hỏi của khách hàng.
 * @return {string} Phản hồi cuối cùng từ Gemini.
 */
function handleUserQuery(customerQuery) {
  try {
    Logger.log("Nhận được câu hỏi từ người dùng: " + customerQuery);
    
    // Bước 1: Trích xuất thông tin sản phẩm từ câu hỏi của khách hàng
    const productInfoJson = GeminiService.extractProductInfo(customerQuery, GEMINI_API_KEY);
    const productInfo = JSON.parse(productInfoJson);
    
    Logger.log("Thông tin sản phẩm được trích xuất: " + JSON.stringify(productInfo));

    // Kiểm tra nếu có lỗi từ API
    if (productInfo.error) {
      return JSON.stringify({ error: productInfo.error });
    }

    // Bước 2: Tìm kiếm sản phẩm trong Google Sheet
    const hasProductInfo = productInfo.productName !== "null" || productInfo.dungTich !== "null" || productInfo.mauSac !== "null" || productInfo.shortDescription !== "null";
    
    if (!hasProductInfo) {
        return JSON.stringify({ text: "Xin lỗi, tôi không thể tìm thấy thông tin sản phẩm trong câu hỏi của bạn. Vui lòng thử lại." });
    }
    
    const productData = SheetService.findProduct(SPREADSHEET_ID, productInfo);

    if (!productData) {
      return JSON.stringify({ text: "Xin lỗi, tôi không tìm thấy sản phẩm phù hợp với yêu cầu của bạn trong kho." });
    }

    // Bước 3: Tạo prompt mới với dữ liệu sản phẩm và gửi đến Gemini
    const newPrompt = `Một khách hàng đang hỏi về sản phẩm "${productData.productName}" có dung tích "${productData.dungTich}" và màu sắc "${productData.mauSac}". Giá của sản phẩm là "${productData.price}" và số lượng còn lại trong kho là "${productData.quantity}". Đây là mô tả ngắn của sản phẩm: "${productData.shortDescription}". Hãy viết một câu trả lời thân thiện và cung cấp thông tin chi tiết về sản phẩm này cho khách hàng.`;
    
    Logger.log("Prompt mới được tạo: " + newPrompt);

    // Bước 4: Lấy phản hồi cuối cùng từ Gemini và kết hợp với URL hình ảnh
    const finalResponse = GeminiService.getFinalResponse(newPrompt, GEMINI_API_KEY);
    
    Logger.log("Phản hồi cuối cùng từ Gemini: " + finalResponse);
    
    return JSON.stringify({ 
      text: finalResponse,
      imageUrl: productData.imageUrl
    });

  } catch (e) {
    Logger.log("Đã xảy ra lỗi trong quá trình xử lý: " + e.message);
    return JSON.stringify({ error: `Đã xảy ra lỗi: ${e.message}` });
  }
}
