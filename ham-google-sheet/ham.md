=INDEX(A1:Z; 1; 3)

=INDEX('Tên_Sheet'!A1:Z; 1; 3)

# Chỉ chọn các hàng có dữ liệu: Nếu bạn muốn tránh các hàng trống, bạn có thể kết hợp với hàm QUERY hoặc FILTER.

=QUERY(A1:Z, "SELECT * WHERE A is not null")

=QUERY(Don_hang!A:Z; "SELECT * WHERE A is not null AND Z is not null")

=FILTER(Don_hang!A:Z, Don_hang!A:A <> "")

=INDIRECT("Don_hang!A1:" & ADDRESS(MAX(ROW(Don_hang!A:A)*(Don_hang!A:A<>"")), MAX(COLUMN(Don_hang!1:1)*(Don_hang!1:1<>""))))

# ma trận - Công thức tìm "Last Row" chính xác

=FILTER(Don_hang!A:Z, MMULT(N(Don_hang!A:Z<>""), TRANSPOSE(COLUMN(Don_hang!A:Z)^0)) > 0)

## Giải thích công thức:

Don_hang!A:Z: Đây là phạm vi dữ liệu bạn muốn lọc.

Don_hang!A:Z<>"": Công thức này tạo ra một mảng các giá trị TRUE (đúng) và FALSE (sai), trong đó TRUE đại diện cho các ô có dữ liệu và FALSE đại diện cho các ô trống.

N(...): Chuyển đổi mảng TRUE/FALSE thành các giá trị số 1 và 0. Bây giờ, chúng ta có một ma trận số với 1 cho ô có dữ liệu và 0 cho ô trống.

COLUMN(Don_hang!A:Z)^0: Tạo ra một mảng các số 1 có cùng kích thước với phạm vi A:Z.

TRANSPOSE(...): Hoán đổi hàng và cột của mảng các số 1 này.

MMULT(...): Đây là phần quan trọng nhất. Hàm MMULT (phép nhân ma trận) sẽ nhân ma trận 0 và 1 với ma trận các số 1 đã được hoán vị. Kết quả trả về là một cột ảo, trong đó mỗi ô chứa tổng số ô có dữ liệu của từng hàng tương ứng.

> 0: Cuối cùng, chúng ta chỉ giữ lại những hàng có tổng số ô có dữ liệu lớn hơn 0. Điều này đảm bảo rằng chúng ta chỉ lấy những hàng không trống.

