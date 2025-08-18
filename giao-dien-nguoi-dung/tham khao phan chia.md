## thm khảm MD

Chào bạn,

Hoàn toàn có thể tách biệt mỗi hàm một chức năng trong Apps Script. Đây là một phương pháp lập trình tốt, giúp mã nguồn của bạn trở nên gọn gàng, dễ hiểu và dễ bảo trì hơn, đặc biệt khi dự án của bạn phát triển lớn hơn.

Việc tách biệt chức năng giúp bạn:

  * **Dễ đọc và hiểu:** Mỗi hàm chỉ làm một việc duy nhất, ví dụ: một hàm chỉ để lấy dữ liệu, một hàm khác chỉ để xử lý dữ liệu, và một hàm khác nữa chỉ để hiển thị.
  * **Dễ bảo trì:** Khi có lỗi xảy ra, bạn biết chính xác hàm nào đang gặp vấn đề và chỉ cần tập trung sửa chữa ở đó mà không ảnh hưởng đến các phần khác.
  * **Tái sử dụng code:** Bạn có thể dễ dàng sử dụng lại một hàm ở nhiều nơi khác nhau trong dự án mà không cần phải viết lại code.

### Ví dụ về cách chia tách chức năng

Dưới đây là một ví dụ minh họa cách bạn có thể tách biệt các chức năng của một ứng dụng web đơn giản:

-----

#### 1\. File: `Controller.gs`

File này sẽ chứa các hàm chính để điều phối luồng chạy của ứng dụng, chẳng hạn như hàm `doGet()` để xử lý yêu cầu từ người dùng. Nó sẽ gọi các hàm từ các file khác để thực hiện công việc.

```javascript
// File: Controller.gs

function doGet() {
  // Lấy dữ liệu từ file GoogleSheetService.gs
  var rawData = getSheetData('Sheet1');
  
  // Xử lý dữ liệu từ file DataProcessor.gs (nếu cần)
  var processedData = processData(rawData);
  
  // Trả về giao diện người dùng
  return createHtmlOutput(processedData);
}

```

-----

#### 2\. File: `GoogleSheetService.gs`

File này chỉ có nhiệm vụ duy nhất là **tương tác với Google Sheet**, bao gồm việc lấy dữ liệu, ghi dữ liệu, v.v.

```javascript
// File: GoogleSheetService.gs

function getSheetData(sheetName) {
  var spreadsheetId = 'ID_của_bạn'; 
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  if (sheet) {
    return sheet.getDataRange().getValues();
  } else {
    Logger.log('Không tìm thấy sheet: ' + sheetName);
    return [];
  }
}
```

-----

#### 3\. File: `DataProcessor.gs`

File này có nhiệm vụ **xử lý và biến đổi dữ liệu**, ví dụ như lọc, sắp xếp, hoặc tính toán.

```javascript
// File: DataProcessor.gs

function processData(data) {
  // Loại bỏ hàng tiêu đề (hàng đầu tiên)
  var processed = data.slice(1);
  
  // Sắp xếp dữ liệu theo cột thứ hai
  processed.sort(function(a, b) {
    return a[1] - b[1];
  });
  
  return processed;
}
```

-----

#### 4\. File: `View.gs` (Tạo HTML)

File này sẽ chịu trách nhiệm **tạo và trả về giao diện người dùng** (HTML) từ dữ liệu đã được xử lý.

```javascript
// File: View.gs

function createHtmlOutput(data) {
  var template = HtmlService.createTemplateFromFile('index');
  template.data = data;
  return template.evaluate();
}
```

Bằng cách này, bạn đã tách biệt rõ ràng các chức năng:

  * `Controller.gs`: Quản lý luồng ứng dụng.
  * `GoogleSheetService.gs`: Xử lý tất cả các tương tác với Google Sheet.
  * `DataProcessor.gs`: Xử lý logic nghiệp vụ.
  * `View.gs`: Xử lý phần giao diện.

Cách tiếp cận này không chỉ giúp bạn dễ dàng làm việc với dự án mà còn giúp các thành viên trong nhóm hiểu rõ vai trò của từng phần code.

## router

Có, **Apps Script có thể xử lý logic định tuyến (router)**, nhưng không theo cách giống như các framework web chuyên nghiệp như Express.js hay Next.js. Trong Apps Script, việc định tuyến được thực hiện bằng cách kiểm tra các tham số trong URL yêu cầu và điều hướng đến các hàm hoặc template HTML tương ứng.

-----

### Cách Apps Script xử lý Định tuyến

Khi người dùng truy cập một Web App, hàm `doGet(e)` hoặc `doPost(e)` sẽ được gọi. Đối tượng `e` chứa thông tin về yêu cầu, bao gồm các **tham số URL**. Bạn sẽ dựa vào các tham số này để quyết định logic nào sẽ được thực thi.

#### **1. Định tuyến dựa trên Tham số `page`**

Đây là cách phổ biến nhất để xử lý định tuyến. Bạn thêm một tham số `?page=...` vào URL và sử dụng nó để điều hướng.

**Ví dụ:**

  * `https://.../exec?page=home`
  * `https://.../exec?page=about`
  * `https://.../exec?page=contact`

**Code mẫu:**

```javascript
// File: Code.gs

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  
  // Lấy tham số 'page' từ URL
  var page = e.parameter.page;
  
  // Xử lý logic định tuyến
  if (page == 'about') {
    template = HtmlService.createTemplateFromFile('about');
  } else if (page == 'contact') {
    template = HtmlService.createTemplateFromFile('contact');
  } 
  // Mặc định, nếu không có tham số hoặc tham số không hợp lệ, trả về trang chủ
  
  return template.evaluate();
}

```

Với cách này, bạn sẽ cần tạo các file `.html` riêng biệt cho mỗi trang (`index.html`, `about.html`, `contact.html`).

-----

#### **2. Định tuyến theo Path (Đường dẫn)**

Apps Script cũng cho phép định tuyến dựa trên đường dẫn, nhưng yêu cầu một chút thủ thuật. Bạn cần sử dụng dịch vụ ContentService để tạo một URL cho mỗi "route" (lộ trình), và mỗi URL này sẽ trỏ đến một hàm khác nhau.

Tuy nhiên, cách này thường phức tạp hơn và ít được sử dụng cho các ứng dụng web đơn giản. Đối với hầu hết các trường hợp, cách định tuyến dựa trên tham số (`?page=`) là đủ và dễ quản lý.

-----

### Kết luận

Mặc dù Apps Script không có một bộ định tuyến (router) tích hợp sẵn như các framework hiện đại, bạn hoàn toàn có thể tự xây dựng một logic định tuyến đơn giản nhưng hiệu quả bằng cách sử dụng các tham số trong đối tượng `e` của hàm `doGet()` và `doPost()`. Điều này giúp bạn chia ứng dụng web thành nhiều trang riêng biệt, giúp dự án trở nên có tổ chức và dễ mở rộng hơn.