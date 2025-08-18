## Apps Script mô phỏng hành vi "Ctrl + D"

// Hàm chính: onEdit(e) - Tự động chạy khi có chỉnh sửa trên sheet
function onEdit(e) {
  var sheet = e.source.getActiveSheet(); // Lấy sheet hiện tại đang được chỉnh sửa
  var range = e.range; // Lấy dải ô (range) vừa được chỉnh sửa
  var row = range.getRow(); // Lấy số hàng của ô được chỉnh sửa
  var col = range.getColumn(); // Lấy số cột của ô được chỉnh sửa
  var sheetName = sheet.getName(); // Lấy tên của sheet hiện tại

  // Tên của sheet bạn muốn áp dụng script này
  var targetSheetName = "Danh_sach_khach_hang"; 

  // --- Phần 1: Cập nhật Dropdown động cho cột 'Sản phẩm' (cột F) ---
  // Điều kiện: Nếu chỉnh sửa ở cột E (cột 5) và trên sheet mục tiêu
  if (col == 5 && sheetName == targetSheetName) {
    var category = e.value; // Lấy giá trị mới của ô Danh mục (cột E)
    var productCell = sheet.getRange(row, 6); // Xác định ô Sản phẩm (cột F) tương ứng
    updateProductDropdown(productCell, category); // Gọi hàm để cập nhật dropdown sản phẩm
  }

  // --- Phần 2: Sao chép Quy tắc Xác thực dữ liệu và Công thức cho hàng mới (Giống Ctrl+D) ---
  // Điều kiện: Nếu chỉnh sửa ở cột A (cột 1) và trên sheet mục tiêu, và không phải hàng tiêu đề (row > 1)
  // Giả định rằng việc nhập liệu vào cột A là dấu hiệu bắt đầu một hàng mới.
  if (col == 1 && sheetName == targetSheetName && row > 1) {
    // Xác định dải ô nguồn (hàng phía trên)
    // Lấy toàn bộ hàng phía trên (từ cột A đến cột cuối cùng có dữ liệu)
    var sourceRange = sheet.getRange(row - 1, 1, 1, sheet.getLastColumn()); 
    
    // Xác định dải ô đích (hàng hiện tại)
    // Lấy toàn bộ hàng hiện tại (từ cột A đến cột cuối cùng có dữ liệu)
    var targetRange = sheet.getRange(row, 1, 1, sheet.getLastColumn());   

    // Sao chép chỉ các quy tắc xác thực dữ liệu từ hàng trên xuống hàng hiện tại
    // Điều này sẽ giữ nguyên dropdown cho các cột B, C, D, E và các cột khác nếu chúng có quy tắc xác thực.
    sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.DATA_VALIDATION, false);
    
    // Sao chép chỉ các công thức từ hàng trên xuống hàng hiện tại
    // Nếu có bất kỳ công thức nào trong hàng trên, chúng sẽ được sao chép xuống hàng mới.
    sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    
    // Tùy chọn: Sao chép định dạng (màu nền, font, border, ...)
    sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  }
}

// Hàm phụ trợ: updateProductDropdown() - Cập nhật danh sách thả xuống sản phẩm dựa trên danh mục
function updateProductDropdown(cell, category) {
  if (category) {
    try {
      // Xử lý chuỗi danh mục để khớp với tên dải ô đã đặt (ví dụ: "Thùng rác" -> "thung_rac")
      var processedCategory = category.toLowerCase().replaceAll(' ', '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // Tìm dải ô được đặt tên tương ứng với danh mục đã xử lý
      var namedRange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(processedCategory);
      
      if (namedRange) {
        var products = namedRange.getValues().flat(); // Lấy danh sách sản phẩm và làm phẳng mảng
        
        // Tạo quy tắc xác thực dữ liệu mới
        var rule = SpreadsheetApp.newDataValidation()
          .requireValueInList(products) // Yêu cầu giá trị phải có trong danh sách sản phẩm
          .setAllowInvalid(false) // Không cho phép nhập giá trị không hợp lệ
          .setHelpText("Vui lòng chọn sản phẩm phù hợp.") // Thiết lập văn bản trợ giúp
          .build(); // Hoàn thành việc xây dựng quy tắc
        
        cell.setDataValidation(rule); // Áp dụng quy tắc xác thực dữ liệu cho ô đích
      } else {
        // Nếu không tìm thấy dải ô, xóa nội dung và xác thực dữ liệu, thêm ghi chú lỗi
        cell.clearContent();
        cell.clearDataValidations();
        cell.setNote('Lỗi: Không tìm thấy dải ô đã đặt tên cho danh mục này. Vui lòng kiểm tra tên dải ô hoặc danh mục.');
      }
    } catch (error) {
      // Xử lý các lỗi khác xảy ra trong quá trình cập nhật dropdown
      cell.clearContent();
      cell.clearDataValidations();
      cell.setNote('Lỗi khi cập nhật dropdown: ' + error.message);
    }
  } else {
    // Nếu ô danh mục trống, xóa nội dung và xác thực dữ liệu của ô sản phẩm
    cell.clearDataValidations();
    cell.clearContent();
  }
}
