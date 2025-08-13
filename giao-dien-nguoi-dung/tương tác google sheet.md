## tương tác google sheet
Tương tác với đường dẫn (URL) của Google Sheet và sử dụng dữ liệu dựa trên tên sheet là một tính năng mạnh mẽ của Google Apps Script. Bạn có thể thực hiện điều này bằng cách lấy ID của bảng tính từ URL và sau đó sử dụng các phương thức của Apps Script để truy cập vào các sheet cụ thể.

### Các bước thực hiện

1.  **Lấy Spreadsheet ID từ URL:**
    Đầu tiên, bạn cần trích xuất ID của Google Sheet. ID này nằm trong URL giữa `/d/` và `/edit`.

    Ví dụ, với URL: `https://docs.google.com/spreadsheets/d/123abcXYZ_your_spreadsheet_ID_here/edit#gid=0`
    Spreadsheet ID sẽ là: `123abcXYZ_your_spreadsheet_ID_here`.

2.  **Mở Google Sheet bằng ID:**
    Trong Apps Script, bạn sử dụng phương thức `openById()` để mở bảng tính.

    ```javascript
    var spreadsheetId = "123abcXYZ_your_spreadsheet_ID_here";
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    ```

3.  **Sử dụng dữ liệu bằng Tên Sheet:**
    Sau khi đã có đối tượng `spreadsheet`, bạn có thể sử dụng phương thức `getSheetByName()` để chọn sheet mà bạn muốn tương tác.

    ```javascript
    var sheetName = "Tên Sheet của bạn";
    var sheet = spreadsheet.getSheetByName(sheetName);

    // Kiểm tra nếu sheet tồn tại
    if (sheet) {
        // Lấy toàn bộ dữ liệu trong sheet
        var data = sheet.getDataRange().getValues();
        Logger.log(data);
    } else {
        Logger.log("Không tìm thấy sheet có tên: " + sheetName);
    }
    ```

Bạn có thể kết hợp các bước trên để tạo một hàm hoàn chỉnh, cho phép bạn tương tác với bất kỳ Google Sheet nào bạn có quyền truy cập, miễn là bạn có ID và tên sheet chính xác.