## newDataValidation

/**
 * Hàm onEdit được kích hoạt tự động khi người dùng chỉnh sửa bất kỳ ô nào trong bảng tính.
 * Nó tạo danh sách thả xuống động trong cột F (Sản phẩm) dựa trên giá trị được chọn
 * trong cột E (Danh mục).
 *
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e Đối tượng sự kiện chứa thông tin về chỉnh sửa.
 */
function onEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var col = range.getColumn();
  var row = range.getRow();
  var value = range.getValue(); // Giá trị ô được chỉnh sửa (giá trị danh mục)

  // Chỉ xử lý nếu chỉnh sửa ở cột E (cột Danh mục) trên sheet "Danh_sach_khach_hang"
  if (col === 5 && sheetName === "Danh_sach_khach_hang") {
    var productCell = sheet.getRange(row, 6); // Ô sản phẩm tương ứng (cột F)

    // 1. Xử lý trường hợp ô danh mục bị xóa hoặc để trống
    if (!value) {
      productCell.clearDataValidations().clearContent(); // Xóa data validation và nội dung
      productCell.setValue(''); // Đặt giá trị rỗng
      console.log("Ô danh mục trống, đã xóa Data Validation và nội dung của ô sản phẩm.");
      return; // Dừng thực thi hàm
    }
    productCell.setValue('Đang tải ...');
    SpreadsheetApp.flush();
    // 2. Chuẩn hóa tên danh mục để tìm dải ô được đặt tên tương ứng
    // Ví dụ: "Thời trang Nữ" -> "thoi_trang_nu"
    var processedCategory = value.toLowerCase()
                                 .replace(/ /g, '_')
                                 .normalize("NFD") // Loại bỏ dấu
                                 .replace(/[\u0300-\u036f]/g, ""); // Xóa các ký tự dấu

    var productList = [];
    var cache = CacheService.getScriptCache();
    var cachedAllProductLists = cache.get('allProductLists'); // Thử lấy dữ liệu từ cache

    var allProductLists = {};

    // 3. Ưu tiên đọc từ cache để tăng tốc độ
    if (cachedAllProductLists) {
      try {
        allProductLists = JSON.parse(cachedAllProductLists);
        productList = allProductLists[processedCategory] || [];
        console.log("Đã lấy danh sách từ cache cho danh mục:", processedCategory);
      } catch (e) {
        console.error("Lỗi khi phân tích cú pháp dữ liệu cache JSON. Đang đọc lại từ Sheet:", e);
        // Nếu lỗi parse, coi như cache không hợp lệ và sẽ buộc đọc lại từ Sheet
        cachedAllProductLists = null;
      }
    }

    // 4. Nếu cache rỗng, hết hạn, hoặc dữ liệu cụ thể không có trong cache,
    // hoặc cache bị lỗi khi phân tích cú pháp, thì đọc lại tất cả các dải ô từ Sheet
    // và cập nhật cache.
    if (!cachedAllProductLists || productList.length === 0) {
      console.warn("Cache rỗng/hết hạn hoặc danh mục không có trong cache. Đang đọc lại tất cả dải ô được đặt tên từ Sheet.");
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var namedRanges = ss.getNamedRanges();

      namedRanges.forEach(function(namedRange) {
        var name = namedRange.getName();
        // Lấy tất cả các dải ô được đặt tên và lưu vào đối tượng
        // Giả định tên dải ô đã được chuẩn hóa giống như `processedCategory`
        if (name) { // Đảm bảo chỉ cache các dải ô có tên
          var values = namedRange.getRange().getValues().flat().filter(String); // Lọc bỏ giá trị rỗng
          allProductLists[name] = values;
        }
      });
      // Cập nhật lại cache với dữ liệu mới đọc từ Sheet để các lần truy cập sau được nhanh hơn
      cache.put('allProductLists', JSON.stringify(allProductLists), 3600); // Cache trong 1 giờ (3600 giây)

      productList = allProductLists[processedCategory] || []; // Lấy danh sách sản phẩm từ dữ liệu mới
    }

    // 5. Áp dụng Data Validation hoặc thông báo cho người dùng
    if (productList.length > 0) {
      var rule = SpreadsheetApp.newDataValidation()
                               .requireValueInList(productList, true) // 'true' cho phép giá trị không hợp lệ (chỉ cảnh báo)
                               .build();
      productCell.setDataValidation(rule).clearContent(); // Áp dụng quy tắc và xóa nội dung cũ
    } else {
      productCell.clearDataValidations().clearContent(); // Xóa quy tắc nếu không có sản phẩm
      productCell.setValue('Không có sản phẩm'); // Đặt thông báo
      console.warn("Dải ô được đặt tên cho danh mục '" + processedCategory + "' rỗng hoặc không tìm thấy.");
    }
  }
}

/**
 * Hàm này tự động chạy khi bảng tính được mở.
 * Mục đích chính của nó là tải tất cả các danh sách sản phẩm từ các dải ô được đặt tên
 * vào CacheService. Điều này giúp hàm onEdit truy cập dữ liệu nhanh hơn
 * vì không cần phải đọc lại toàn bộ dải ô từ Sheet mỗi khi có chỉnh sửa.
 *
 * Lưu ý: Hàm onOpen là một "simple trigger" và sẽ tự động chạy khi bảng tính được mở.
 * Không cần cài đặt trigger thủ công cho hàm này.
 */
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cache = CacheService.getScriptCache();
  var namedRanges = ss.getNamedRanges();

  var allProductLists = {};

  namedRanges.forEach(function(namedRange) {
    var name = namedRange.getName();
    // Lấy tất cả các dải ô được đặt tên và lưu vào đối tượng
    // Giả định tên dải ô đã được chuẩn hóa (ví dụ: "thoi_trang", "dien_tu")
    if (name) { // Đảm bảo chỉ cache các dải ô có tên
      var values = namedRange.getRange().getValues().flat().filter(String); // Lọc bỏ giá trị rỗng
      allProductLists[name] = values;
    }
  });

  // Lưu trữ đối tượng chứa tất cả danh sách vào cache dưới dạng chuỗi JSON
  // Cache trong 1 giờ (3600 giây)
  cache.put('allProductLists', JSON.stringify(allProductLists), 3600);
  console.log("Đã tải các danh sách sản phẩm vào cache.");
}
