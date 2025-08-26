## getRange() trong Google Apps Script 

`getRange()` trong Google Apps Script có một vài dạng tham số khác nhau, cho phép bạn chọn một vùng (range) trong trang tính theo nhiều cách. Dưới đây là các dạng phổ biến nhất:

-----

### 1\. `getRange(a1Notation)`

Đây là cách đơn giản nhất, sử dụng ký hiệu **A1 notation** (ví dụ: "A1", "B2:C5").

  * **Tham số:**

      * `a1Notation` (string): Chuỗi ký hiệu A1 của vùng bạn muốn chọn.

  * **Ví dụ:**

    ```javascript
    // Chọn ô A1
    var cell = sheet.getRange('A1');

    // Chọn vùng từ B2 đến C5
    var myRange = sheet.getRange('B2:C5');

    // Chọn toàn bộ cột A
    var columnA = sheet.getRange('A:A');
    ```

-----

### 2\. `getRange(row, column)`

Cách này giúp bạn chọn một ô dựa trên chỉ số hàng và cột của nó.

  * **Tham số:**

      * `row` (số): Chỉ số hàng (bắt đầu từ 1).
      * `column` (số): Chỉ số cột (bắt đầu từ 1).

  * **Ví dụ:**

    ```javascript
    // Chọn ô ở hàng 3, cột 4 (tức là ô D3)
    var cellD3 = sheet.getRange(3, 4);
    ```

-----

### 3\. `getRange(row, column, numRows)`

Cách này cho phép bạn chọn một vùng bắt đầu từ một ô cụ thể và kéo dài xuống một số hàng nhất định.

  * **Tham số:**

      * `row` (số): Chỉ số hàng bắt đầu.
      * `column` (số): Chỉ số cột bắt đầu.
      * `numRows` (số): Số lượng hàng của vùng.

  * **Ví dụ:**

    ```javascript
    // Chọn 5 hàng, bắt đầu từ ô A1
    var fiveRows = sheet.getRange(1, 1, 5); // Tương đương với A1:A5
    ```

-----

### 4\. `getRange(row, column, numRows, numColumns)`

Đây là dạng đầy đủ nhất, cho phép bạn xác định một vùng hình chữ nhật hoàn chỉnh.

  * **Tham số:**

      * `row` (số): Chỉ số hàng bắt đầu.
      * `column` (số): Chỉ số cột bắt đầu.
      * `numRows` (số): Số lượng hàng của vùng.
      * `numColumns` (số): Số lượng cột của vùng.

  * **Ví dụ:**

    ```javascript
    // Chọn một vùng 5 hàng và 3 cột, bắt đầu từ ô B2
    var rectRange = sheet.getRange(2, 2, 5, 3); // Tương đương với B2:D6
    ```