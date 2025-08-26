## Chọn và Sao chép hàng.

Có, một tác vụ đơn giản hơn là sử dụng **hộp thoại tùy chỉnh (custom dialog)** để hiển thị một danh sách các checkbox mà người dùng có thể chọn, sau đó copy dữ liệu mà không cần thay đổi gì trên bảng tính chính.

Cách này sẽ không chèn checkbox trực tiếp vào sheet, mà sẽ hiện một cửa sổ nhỏ chứa tất cả các hàng, cho phép bạn chọn và copy. Cách này sẽ rất hiệu quả nếu sheet của bạn có ít hàng hoặc bạn muốn giữ nguyên định dạng.

-----

### Code Google Apps Script

Bạn sẽ cần hai file: một file `.gs` để xử lý logic và một file `.html` để tạo hộp thoại.

**1. File `Code.gs`**

```javascript
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tác vụ')
    .addItem('Chọn và Sao chép hàng', 'showSelectionDialog')
    .addToUi();
}

function showSelectionDialog() {
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = activeSheet.getLastRow();
  var lastColumn = activeSheet.getLastColumn();
  
  // Lấy dữ liệu từ sheet, bắt đầu từ hàng 2 (bỏ qua tiêu đề)
  var data = activeSheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  
  // Tạo một biến để truyền dữ liệu vào HTML
  var htmlData = {};
  htmlData.rows = data;

  // Render file HTML với dữ liệu
  var htmlOutput = HtmlService.createTemplateFromFile('SelectionDialog');
  htmlOutput.data = htmlData;
  
  SpreadsheetApp.getUi().showModalDialog(htmlOutput.evaluate().setWidth(500).setHeight(400), 'Chọn hàng để sao chép');
}

// Hàm này sẽ được gọi từ HTML để xử lý dữ liệu
function processSelectedRows(selectedRows) {
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Don_hang');

  if (targetSheet === null) {
    SpreadsheetApp.getUi().alert('Lỗi', 'Không tìm thấy sheet "Don_hang".');
    return;
  }
  
  // Lấy dữ liệu từ sheet chính để có thông tin đầy đủ
  var fullData = activeSheet.getRange(2, 1, activeSheet.getLastRow() - 1, activeSheet.getLastColumn()).getValues();
  var rowsToCopy = [];
  
  // Lặp qua các hàng được chọn từ hộp thoại
  for (var i = 0; i < selectedRows.length; i++) {
    var rowIndex = parseInt(selectedRows[i]);
    // Lấy dữ liệu của hàng đã chọn
    rowsToCopy.push(fullData[rowIndex]);
  }
  
  if (rowsToCopy.length === 0) {
    SpreadsheetApp.getUi().alert('Cảnh báo', 'Không có hàng nào được chọn.');
    return;
  }
  
  // Dán dữ liệu vào sheet đích
  var targetLastRow = targetSheet.getLastRow();
  var targetRange = targetSheet.getRange(targetLastRow + 1, 1, rowsToCopy.length, rowsToCopy[0].length);
  targetRange.setValues(rowsToCopy);

  SpreadsheetApp.getUi().alert('Thành công', 'Đã sao chép ' + rowsToCopy.length + ' hàng đã chọn.');
}
```

-----

**2. File `SelectionDialog.html`**

Tạo một file HTML mới (trong Trình chỉnh sửa Apps Script, vào **Tệp \> Mới \> Tệp HTML**) và đặt tên là `SelectionDialog`. Dán đoạn code sau vào:

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body { font-family: Arial, sans-serif; padding: 10px; }
      #data-table { border-collapse: collapse; width: 100%; }
      #data-table th, #data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      #data-table th { background-color: #f2f2f2; }
      .actions { margin-top: 15px; text-align: center; }
      button { padding: 10px 20px; margin: 0 5px; cursor: pointer; }
    </style>
  </head>
  <body>
    <h3>Chọn hàng để sao chép</h3>
    <p>Tích vào các ô để chọn hàng, sau đó bấm "Sao chép".</p>
    <div style="max-height: 250px; overflow-y: scroll;">
      <table id="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Ngày</th>
            <th>Tên</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          <? for (var i = 0; i < data.rows.length; i++) { ?>
            <tr>
              <td><input type="checkbox" name="selectedRow" value="<?= i ?>"></td>
              <? for (var j = 0; j < data.rows[i].length; j++) { ?>
                <td><?= data.rows[i][j] ?></td>
              <? } ?>
            </tr>
          <? } ?>
        </tbody>
      </table>
    </div>
    
    <div class="actions">
      <button onclick="copyRows()">Sao chép</button>
      <button onclick="google.script.host.close()">Hủy bỏ</button>
    </div>

    <script>
      function copyRows() {
        var checkboxes = document.querySelectorAll('input[name="selectedRow"]:checked');
        var selectedRows = [];
        for (var i = 0; i < checkboxes.length; i++) {
          selectedRows.push(checkboxes[i].value);
        }
        
        if (selectedRows.length > 0) {
          google.script.run.withSuccessHandler(google.script.host.close).processSelectedRows(selectedRows);
        } else {
          alert('Vui lòng chọn ít nhất một hàng để sao chép.');
        }
      }
    </script>
  </body>
</html>
```

-----

### Hướng dẫn sử dụng

1.  **Mở Trình chỉnh sửa Apps Script** và dán hai file code trên.
2.  **Lưu project** và tải lại Google Sheet.
3.  Vào **Tác vụ \> Chọn và Sao chép hàng**.
4.  Một hộp thoại sẽ xuất hiện, hiển thị các hàng từ sheet của bạn với các checkbox để bạn chọn. .
5.  **Tích chọn các hàng** bạn muốn sao chép, sau đó bấm nút **"Sao chép"**.
6.  Dữ liệu sẽ được copy vào sheet "Don\_hang" mà không làm thay đổi sheet gốc.

Cách này đơn giản hơn vì nó không cần thay đổi bất cứ điều gì trên sheet chính. Tất cả thao tác chọn đều diễn ra trong một hộp thoại riêng biệt, giúp giữ nguyên định dạng và cấu trúc của bảng tính ban đầu.