import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ✅ Định nghĩa interface thay vì dùng any
interface Book {
  _id?: string;
  Tensach: string;
  Giaban: number;
  Mota: string;
  Anhbia: string;
  Ngaycapnhat: string;
  Soluongton: number;
  MaCD: number;
  MaNXB: number;
}

@Component({
  selector: 'app-exercise50',
  standalone: false,
  templateUrl: './exercise50.html',
  styleUrl: './exercise50.css',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Dùng OnPush để tối ưu hiệu năng
})
export class Exercise50 implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  formBook: Book = this.emptyBook();

  viewMode: 'list' | 'add' | 'edit' | 'details' = 'list';
  apiUrl = 'http://localhost:3000/books50';

  // ✅ Thông báo toast
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef  // ✅ Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getBooks();
  }

  // ✅ Helper tạo book rỗng
  emptyBook(): Book {
    return {
      Tensach: '', Giaban: 0, Mota: '', Anhbia: '',
      Ngaycapnhat: '', Soluongton: 0, MaCD: 0, MaNXB: 0
    };
  }

  // ✅ Gọi detectChanges sau khi cập nhật message để UI re-render đúng với OnPush
  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.message = msg;
    this.messageType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  getBooks() {
    this.http.get<Book[]>(this.apiUrl).subscribe({
      next: data => {
        this.books = data;
        this.cdr.detectChanges(); // ✅ Báo Angular cập nhật danh sách
      },
      error: () => this.showToast('Không thể tải danh sách sách!', 'error')
    });
  }

  showAdd() {
    this.formBook = this.emptyBook();
    this.viewMode = 'add';
    this.cdr.detectChanges(); // ✅ Cập nhật view khi chuyển màn hình
  }

  showEdit(book: Book) {
    this.formBook = { ...book };
    this.viewMode = 'edit';
    this.cdr.detectChanges();
  }

  showDetails(book: Book) {
    this.selectedBook = book;
    this.viewMode = 'details';
    this.cdr.detectChanges();
  }

  saveAdd() {
    if (!this.formBook.Ngaycapnhat) {
      this.formBook.Ngaycapnhat = new Date().toLocaleDateString('vi-VN');
    }
    this.http.post<Book>(this.apiUrl, this.formBook).subscribe({
      next: () => {
        this.showToast('Thêm sách thành công!');
        this.getBooks();
        this.viewMode = 'list';
        this.cdr.detectChanges();
      },
      error: () => this.showToast('Thêm sách thất bại!', 'error')
    });
  }

  saveEdit() {
    this.http.put<Book>(`${this.apiUrl}/${this.formBook._id}`, this.formBook).subscribe({
      next: () => {
        this.showToast('Cập nhật sách thành công!');
        this.getBooks();
        this.viewMode = 'list';
        this.cdr.detectChanges();
      },
      error: () => this.showToast('Cập nhật thất bại!', 'error')
    });
  }

  deleteBook(id: string) {
    if (confirm('Bạn có chắc muốn xóa cuốn sách này không?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.showToast('Đã xóa sách thành công!');
          this.getBooks();
        },
        error: () => this.showToast('Xóa sách thất bại!', 'error')
      });
    }
  }

  goBack() {
    this.viewMode = 'list';
    this.selectedBook = null;
    this.cdr.detectChanges();
  }

  // ✅ Hàm markForCheck — dùng khi muốn báo Angular kiểm tra lại component
  // mà không trigger detectChanges ngay lập tức (phù hợp trong các trường hợp
  // cập nhật từ bên ngoài zone như setTimeout, event thủ công)
  markForCheck() {
    this.cdr.markForCheck();
  }
}