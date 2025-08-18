function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var col = range.getColumn();
  var row = range.getRow();

  // Kiểm tra nếu thay đổi ở cột E (cột Danh mục)
  if (col == 5 && sheet.getName() == "Danh_sach_khach_hang") {
    // Lấy giá trị của ô Danh mục vừa thay đổi
    var category = e.value;
    Logger.log(category);
    if (category) {
      // BƯỚC MỚI: Xử lý chuỗi để khớp với tên dải ô
      // 1. Chuyển thành chữ thường
      var processedCategory = category.toLowerCase();
      // 2. Thay thế dấu cách bằng dấu gạch dưới
      processedCategory = processedCategory.replaceAll(' ', '_');
      // 3. Xử lý dấu tiếng Việt
      processedCategory = processedCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Tìm dải ô được đặt tên tương ứng
      try {
        var namedRange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(processedCategory);
        if (namedRange) {
          var products = namedRange.getValues().flat();
          var productCell = sheet.getRange(row, 6); // Cột F là cột 6

          // Tạo và áp dụng quy tắc xác thực dữ liệu mới
          var rule = SpreadsheetApp.newDataValidation()
            .requireValueInList(products)
            .setAllowInvalid(false)
            .setHelpText("Vui lòng chọn sản phẩm phù hợp.")
            .build();
          
          productCell.setDataValidation(rule);
        }
      } catch (error) {
        // Nếu không tìm thấy dải ô, xóa xác thực dữ liệu
        sheet.getRange(row, 6).clearDataValidations();
      }
    } else {
      // Nếu ô Danh mục trống, xóa xác thực dữ liệu
      sheet.getRange(row, 6).clearDataValidations();
    }

    // xử lý thêm hàng

    // Thêm đoạn code này vào cuối hàm onEdit, bên trong if (col == 5...)
// Điều này sẽ xử lý việc thêm hàng mới
// ... (các dòng code phía trên không thay đổi)

// ---
// Đoạn code mới để sao chép hàng tương tự Ctrl+D
// Chỉ sao chép khi ô vừa sửa có giá trị và không phải hàng tiêu đề (hàng 1)
if (e.range.getValue() && row > 1) {
  // them hàng mới với copy nội dung
  // Sao chép toàn bộ các thuộc tính của hàng trên xuống hàng mới
  //sourceRange.copyTo(targetRange, {contentsOnly: false});

  // Nếu sử dụng -->> không copy nội dung
  // BƯỚC 1: Chèn một hàng trống mới ngay bên dưới hàng hiện tại
  sheet.insertRowAfter(row);

  // BƯỚC 2: Xác định dải ô nguồn (hàng vừa sửa)
  var sourceRange = sheet.getRange(row, 1, 1, sheet.getLastColumn());
  
  // BƯỚC 3: Xác định dải ô đích (hàng mới vừa được chèn)
  var targetRange = sheet.getRange(row + 1, 1, 1, sheet.getLastColumn());

  // BƯỚC 4: Sao chép các thuộc tính mong muốn
  // Sao chép chỉ các quy tắc xác thực dữ liệu
  sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.DATA_VALIDATION, false);
  
  // Sao chép chỉ các công thức
  //sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
  
  // Sao chép chỉ định dạng
  //sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
}

    // Xác định dải ô nguồn (hàng phía trên)
    // Lấy toàn bộ hàng phía trên (từ cột A đến cột cuối cùng có dữ liệu)
    // var sourceRange = sheet.getRange(row + 1, 1, 1, sheet.getLastColumn()); 
    
    // // Xác định dải ô đích (hàng hiện tại)
    // // Lấy toàn bộ hàng hiện tại (từ cột A đến cột cuối cùng có dữ liệu)
    // var targetRange = sheet.getRange(row, 1, 1, sheet.getLastColumn());   

    // // Sao chép chỉ các quy tắc xác thực dữ liệu từ hàng trên xuống hàng hiện tại
    // // Điều này sẽ giữ nguyên dropdown cho các cột B, C, D, E và các cột khác nếu chúng có quy tắc xác thực.
    // sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.DATA_VALIDATION, false);
    
    // // Sao chép chỉ các công thức từ hàng trên xuống hàng hiện tại
    // // Nếu có bất kỳ công thức nào trong hàng trên, chúng sẽ được sao chép xuống hàng mới.
    // sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    
    // // Tùy chọn: Sao chép định dạng (màu nền, font, border, ...)
    // sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  }
}