# các hàm
# hàm kích hoạt đơn giản
## mở bảng tính
function onOpen()
## chỉnh sửa bảng tính
function onEdit(e)

### Lấy sheet hiện tại đang được chỉnh sửa.
var sheet = e.source.getActiveSheet();
### Lấy đối tượng dải ô (range) vừa được chỉnh sửa.
var range = e.range;
### Lấy chỉ số cột của ô được chỉnh sửa. (Cột A là 1, B là 2...).
var col = range.getColumn();
### Lấy chỉ số hàng của ô được chỉnh sửa.
var row = range.getRow();
### lấy giá trị được nhập vào
var category = e.value;

### Kiểm tra điều kiện -->> Đây là điều kiện chính để script thực thi
if (col === 5 && sheet.getName() === "Danh_sach_khach_hang")

col === 5 Kiểm tra xem sự thay đổi có diễn ra ở cột thứ 5 ( cột E không)

sheet.getName() === "Danh_sach_khach_hang" Kiểm tra xem sự thay đổi có diễn ra trên sheet có tên là `"Danh_sach_khach_hang"` hay không.

### xử lý giá trị chuỗi
#### Lấy giá trị mới được nhập vào ô ở cột E.
var category = e.value
#### Chuyển đổi chuỗi thành chữ thường. Ví dụ: `"Thùng rác"` -> `"thùng rác"`.
var processedCategory = category.toLowerCase();
#### Thay thế tất cả các dấu cách bằng dấu gạch dưới (`_`). Ví dụ: `"thùng rác"` -> `"thùng_rác"`.
processedCategory = processedCategory.replaceAll(' ', '_');
#### `normalize("NFD")`: Phân tách các ký tự có dấu thành ký tự gốc và dấu phụ. Ví dụ: `ộ` -> `o` và dấu mũ.
normalize("NFD")
#### `replace(/[\u0300-\u036f]/g, "")`: Sử dụng biểu thức chính quy để tìm và xóa tất cả các ký tự dấu phụ đã được phân tách. Kết quả: `"thung_rac"`.
processedCategory = processedCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "");


### tương tác với GoogleSheet
try { ... } catch (error) { ... }
#### Tìm dải ô đã được đặt tên (named range) trong file Google Sheets hiện tại, với tên đã được xử lý (ví dụ: `"thung_rac"`)
var nameRange = SpreadsheetApp.getActiveSpreadsheet().getRangeName(processedCategory);
#### Lấy tất cả các giá trị từ dải ô đó và chuyển nó thành một mảng một chiều. Ví dụ: `[['sản phẩm 1'], ['sản phẩm 2']]` -> `['sản phẩm 1', 'sản phẩm 2']`.
var products =  nameRange.getValue().flat();
#### Xác định ô đích (ở cột F, cùng hàng với ô vừa được chỉnh sửa) để áp dụng quy tắc xác thực dữ liệu.
var productCell = sheet.getRange(row,6);

### Bắt đầu tạo một quy tắc xác thực dữ liệu mới.
var rule = SpreadsheetApp.newDataValidation()
#### Yêu cầu giá trị trong ô phải thuộc danh sách `products` vừa lấy được.
.requireValueInList(produts)
#### Không cho phép nhập giá trị không có trong danh sách.
.setAllowInvalid(false)
#### Thiết lập một thông báo hiển thị khi người dùng chọn ô.
.setHelpText("...")
#### Hoàn thành việc tạo quy tắc.
.build()

### Áp dụng quy tắc vừa tạo cho ô đích.
productCell.setDataValidation(rule);
#### Xóa quy tắc xác thực dữ liệu hiện có trên ô đích.
productCell.clearDataValidate();
#### Xóa nội dung của ô đích.
productCell.clearContent();


## Xử lý thêm hàng mới
if (e.range.getValue() && row >1)
### Sao chép toàn bộ các thuộc tính của hàng trên xuống hàng mới


## Đảm bảo tất cả các thay đổi được áp dụng ngay lập tức
SpreadsheetApp.flush();
