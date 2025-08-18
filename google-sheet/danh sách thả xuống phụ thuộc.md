## danh sách thả xuống phụ thuộc

function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var col = range.getColumn();
  var row = range.getRow();

  // Kiểm tra nếu thay đổi ở cột E (cột Danh mục)
  if (col == 5 && sheet.getName() == "Danh_sach_khach_hang") {
    // Lấy giá trị của ô Danh mục vừa thay đổi
    var category = e.value;

    if (category) {
      // Tìm dải ô được đặt tên tương ứng với danh mục
      try {
        var namedRange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(category);
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
  }
}