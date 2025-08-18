// Hàm test để mô phỏng một sự kiện onEdit
function testOnEdit() {
  // Tạo một đối tượng sự kiện giả
  var e = {
    range: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Danh_sach_khach_hang").getRange("E2"),
    value: "danh_muc_test",
    source: SpreadsheetApp.getActiveSpreadsheet()
  };

  // Gọi hàm onEdit với đối tượng sự kiện giả
  onEdit(e);
}