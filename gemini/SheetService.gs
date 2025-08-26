// SheetService.gs
// Tệp này chứa các hàm để tương tác với Google Sheet.
const SheetService = {};

/**
 * Tìm kiếm sản phẩm trong Google Sheet dựa trên thông tin được trích xuất.
 * @param {string} spreadsheetId ID của Google Sheet.
 * @param {object} productInfo Thông tin sản phẩm từ Gemini.
 * @return {object|null} Thông tin sản phẩm từ Sheet hoặc null nếu không tìm thấy.
 */
SheetService.findProduct = function(spreadsheetId, productInfo) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Sản phẩm");
  if (!sheet) {
    throw new Error("Không tìm thấy sheet có tên 'Sản phẩm'.");
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  const productNameCol = headers.indexOf("Tên sản phẩm");
  const dungTichCol = headers.indexOf("Dung tích");
  const mauSacCol = headers.indexOf("Màu sắc");
  const priceCol = headers.indexOf("Giá");
  const quantityCol = headers.indexOf("Số lượng");
  const shortDescriptionCol = headers.indexOf("Mô tả ngắn");
  const imageUrlCol = headers.indexOf("Hình ảnh");

  const parsedProductName = productInfo.productName === "null" ? null : productInfo.productName;
  const parsedDungTich = productInfo.dungTich === "null" ? null : productInfo.dungTich;
  const parsedMauSac = productInfo.mauSac === "null" ? null : productInfo.mauSac;
  const parsedShortDescription = productInfo.shortDescription === "null" ? null : productInfo.shortDescription;

  let bestMatch = null;
  let highestScore = 0;

  for (const row of rows) {
    let currentScore = 0;
    const productName = row[productNameCol];
    const dungTich = row[dungTichCol];
    const mauSac = row[mauSacCol];
    const shortDescription = (shortDescriptionCol !== -1) ? row[shortDescriptionCol] : null;
    const imageUrl = (imageUrlCol !== -1) ? row[imageUrlCol] : null;

    if (parsedProductName && productName && productName.toLowerCase().includes(parsedProductName.toLowerCase())) {
        currentScore += 10;
    }
    
    if (parsedDungTich && dungTich) {
      const dungTichFromSheet = dungTich.toString().toLowerCase().replace(/\s/g, '');
      const dungTichFromGemini = parsedDungTich.toLowerCase().replace(/\s/g, '');
      if (dungTichFromSheet.includes(dungTichFromGemini) || dungTichFromGemini.includes(dungTichFromSheet)) {
        currentScore += 5;
      }
    }
    
    if (parsedMauSac && mauSac) {
      if (mauSac.toLowerCase().includes(parsedMauSac.toLowerCase())) {
        currentScore += 5;
      }
    }
    
    if (parsedShortDescription && shortDescription && shortDescription.toLowerCase().includes(parsedShortDescription.toLowerCase())) {
        currentScore += 3;
    }

    if (currentScore > highestScore) {
      highestScore = currentScore;
      bestMatch = {
        productName: productName,
        dungTich: dungTich,
        mauSac: mauSac,
        price: row[priceCol],
        quantity: row[quantityCol],
        shortDescription: shortDescription,
        imageUrl: imageUrl
      };
    }
  }
  
  return bestMatch;
};

