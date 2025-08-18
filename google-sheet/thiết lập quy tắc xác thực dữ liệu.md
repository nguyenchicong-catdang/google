## thiết lập quy tắc xác thực dữ liệu

Dựa vào các hình ảnh bạn đã cung cấp, bạn có thể thiết lập quy tắc xác thực dữ liệu cho cột 'Sản phẩm' (cột F) để chỉ hiển thị các sản phẩm thuộc 'Danh mục' (cột E).

Đây là cách thực hiện:

1.  **Mở cửa sổ "Xác thực dữ liệu"**:

      * Trong hình 1, bạn đã mở cửa sổ này. Đảm bảo bạn đang chọn phạm vi áp dụng cho cột F, ví dụ: `F2:F`.
      * Trong phần 'Tiêu chí', chọn 'Công thức tùy chỉnh là'.

2.  **Nhập công thức**:

      * Bạn cần tạo một danh sách phụ thuộc. Giả sử danh sách danh mục của bạn nằm ở sheet 'Danh\_sach\_khach\_hang' (tên sheet trong hình 1) và danh sách sản phẩm của bạn nằm ở một sheet khác, ví dụ: 'Danh\_sach\_san\_pham' (hình 2).
      * Công thức sẽ sử dụng `INDIRECT` để tạo một tham chiếu động đến danh sách sản phẩm.
      * Công thức mẫu:

    <!-- end list -->

    ```excel
    =INDIRECT("'" & E2 & "'")
    ```

      * **Giải thích công thức:**
          * `E2`: Đây là ô chứa danh mục mà bạn muốn tham chiếu đến. Khi bạn áp dụng công thức cho toàn bộ cột F, `E2` sẽ tự động thay đổi thành `E3`, `E4`, v.v.
          * `INDIRECT(...)`: Hàm này biến một chuỗi văn bản thành một tham chiếu.
          * `"'" & E2 & "'"`: Phần này tạo ra một chuỗi văn bản có dạng `'Tên danh mục'`, ví dụ: `'thùng rác'`. Đây là tên của sheet hoặc dải ô chứa danh sách sản phẩm.

3.  **Chuẩn bị dữ liệu**:

      * Bạn cần đảm bảo rằng các danh mục ở cột E phải khớp chính xác với tên của các sheet hoặc dải ô chứa danh sách sản phẩm tương ứng.
      * Ví dụ:
          * Nếu ở ô `E2` bạn chọn 'thùng rác', thì bạn cần có một sheet tên là 'thùng rác' hoặc một dải ô được đặt tên là 'thùng rác' chứa danh sách các sản phẩm liên quan (như 'thùng rác', 'thùng rác 120 lít', 'thùng rác 240 lít' trong hình 2).

4.  **Các bước bổ sung**:

      * **Nếu danh sách sản phẩm của bạn nằm trong các sheet riêng biệt**: Bạn có thể tạo các sheet với tên tương ứng với từng danh mục (ví dụ: sheet 'thùng rác', sheet 'can', sheet 'xô',...).
      * **Nếu danh sách sản phẩm của bạn nằm chung một sheet**: Bạn cần đặt tên cho các dải ô.
          * Ví dụ: Chọn dải ô `A1:A3` trong hình 2, vào 'Dữ liệu' \> 'Dải ô đã đặt tên' và đặt tên là 'thùng rác'.
          * Làm tương tự cho các danh mục khác.
      * **Thiết lập quy tắc xác thực dữ liệu cho cột 'Danh mục' (cột E)**:
          * Trước khi làm bước 2, bạn cần đảm bảo cột E đã được thiết lập để chọn danh mục từ một danh sách cố định.
          * Ví dụ: Trong hình 1, ô `E2` đã có sẵn danh sách thả xuống.
          * Bạn cần tạo một danh sách các tên danh mục (ví dụ: 'thùng rác', 'can', 'xô',...) ở một nơi nào đó và thiết lập quy tắc xác thực dữ liệu cho cột E để lấy dữ liệu từ dải ô đó.

Sau khi hoàn thành các bước trên, khi bạn chọn một danh mục ở cột E, danh sách thả xuống ở cột F sẽ tự động thay đổi để chỉ hiển thị các sản phẩm thuộc danh mục đó.