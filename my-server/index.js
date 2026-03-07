const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()
const port = 3000

// ✅ Middleware phải khai báo TRƯỚC các routes
app.use(morgan("combined"))
app.use(cors())
app.use(bodyParser.json())
app.use("/static", express.static(path.join(__dirname, "public")))

// ============ Default ============
app.get("/", (req, res) => {
    res.send("Hello bạn")
})

// ============ /books ============
let database = [
    { "BookId": "b1", "BookName": "Kỹ thuật lập trình cơ bản", "Price": 70, "Image": "/images/b1.png" },
    { "BookId": "b2", "BookName": "Kỹ thuật lập trình nâng cao", "Price": 100, "Image": "/images/b2.png" },
    { "BookId": "b3", "BookName": "Máy học cơ bản", "Price": 200, "Image": "/images/b3.png" },
    { "BookId": "b4", "BookName": "Máy học nâng cao", "Price": 300, "Image": "/images/b4.png" },
    { "BookId": "b5", "BookName": "Lập trình Robot cơ bản", "Price": 250, "Image": "/images/b5.png" }
]

app.get("/books", (req, res) => {
    res.send(database)
})
app.get("/books/:id", (req, res) => {
    const id = req.params["id"]   // ✅ dùng const
    const p = database.find(x => x.BookId == id)
    if (!p) return res.status(404).json({ message: "Không tìm thấy" })
    res.send(p)
})
app.post("/books", (req, res) => {
    database.push(req.body)
    res.send(database)
})
app.put("/books", (req, res) => {
    const book = database.find(x => x.BookId == req.body.BookId)  // ✅ const
    if (book != null) {
        book.BookName = req.body.BookName
        book.Price = req.body.Price
        book.Image = req.body.Image
    }
    res.send(database)
})
app.delete("/books/:id", (req, res) => {
    const id = req.params["id"]   // ✅ const
    database = database.filter(x => x.BookId !== id)
    res.send(database)
})

// ============ /books50 ============
let database50 = [
    {
        "_id": "b1",
        "Tensach": "Giáo trình Tin học cơ bản",
        "Giaban": 26000,
        "Mota": "Nội dung của cuốn Tin Học Cơ Bản Windows XP gồm có 7 chương: Chương 1: Một số vấn đề cơ bản. Chương 2: Sử dụng nhanh thanh công cụ và thanh thực đơn trong My Computer và Windows Explorer. Chương 3: Các thao tác trong windows XP. Chương 4: Các thiết lập trong Windows XP. Chương 5: Bảo trì máy tính. Chương 6: Các phím tắt Chương 7: Hỏi và đáp các thắc mắc. Xin trân trọng giới thiệu cuốn sách cùng bạn",
        "Anhbia": "/images/tinhoccoban.png",
        "Ngaycapnhat": "25/10/2014 12:00:00 SA",
        "Soluongton": 120,
        "MaCD": 7,
        "MaNXB": 1
    },
    {
        "_id": "b2",
        "Tensach": "Giáo trình Cơ Sở Dữ Liệu Với Visual Basic",
        "Giaban": 12000,
        "Mota": "Cuốn sách này gồm 3 phần sau: Phần 1: Xử lý văn bản trong Microsoft, giới thiệu các nội dung sau: Chương 1: Căn bản về cơ sở dữ liệu. Chương 2: Các bộ kết nối và tương tác dữ liệu. Chương 3: Bộ chứa dữ liệu DataSet. Chương 4: Bộ điều hợp dữ liệu DataAdapter. Chương 5: Sử dụng các điều khiển ràng buộc dữ liệu. Chương 6: Tạo báo cáo với Crystal Report. Chương 7: ADO.NET và XML. Xin trân trọng giới thiệu cùng các bạn.",
        "Anhbia": "/images/laptrinhcsdl.png",
        "Ngaycapnhat": "23/10/2013 12:00:00 SA",
        "Soluongton": 25,
        "MaCD": 3,
        "MaNXB": 2
    },
    {
        "_id": "b3",
        "Tensach": "Visual Basic 2005 Tập 3, Quyển 2: Lập Trình Web",
        "Giaban": 20000,
        "Mota": "\"Visual Basic 2005 Tập 3, Quyển 2: Lập Trình Web Với Cơ Sở Dữ Liệu\" sẽ cung cấp kỹ thuật và hướng dẫn bạn: Tự học xây dựng ứng dụng Web quản lý CSDL toàn diện với ADO.NET 2.0 và ASP.NET.",
        "Anhbia": "/images/laptrinhweb.png",
        "Ngaycapnhat": "15/09/2014 12:00:00 SA",
        "Soluongton": 240,
        "MaCD": 8,
        "MaNXB": 4
    }
]

app.get("/books50", (req, res) => {
    res.send(database50)
})

app.get("/books50/:id", (req, res) => {
    const id = req.params["id"]
    const p = database50.find(x => x._id == id)
    if (!p) return res.status(404).json({ message: "Không tìm thấy sách" })
    res.send(p)
})

app.post("/books50", (req, res) => {
    // ✅ Auto-generate _id an toàn hơn
    const maxId = database50.reduce((max, b) => {
        const num = parseInt(b._id.replace("b", "")) || 0
        return num > max ? num : max
    }, 0)
    const newBook = {
        _id: "b" + (maxId + 1),
        ...req.body,
        // ✅ Tự động set ngày nếu client không gửi
        Ngaycapnhat: req.body.Ngaycapnhat || new Date().toLocaleDateString("vi-VN")
    }
    database50.push(newBook)
    res.status(201).send(newBook)  // ✅ trả về book mới thay vì toàn bộ array
})

// ✅ Sửa PUT dùng :id trên URL — đúng chuẩn REST
app.put("/books50/:id", (req, res) => {
    const id = req.params["id"]
    const book = database50.find(x => x._id == id)
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" })
    Object.assign(book, req.body, { _id: id }) // giữ nguyên _id
    res.send(book)
})

app.delete("/books50/:id", (req, res) => {
    const id = req.params["id"]
    const exists = database50.find(x => x._id == id)
    if (!exists) return res.status(404).json({ message: "Không tìm thấy sách" })
    database50 = database50.filter(x => x._id !== id)
    res.send({ message: "Xóa thành công", _id: id })
})

// ✅ listen ở cuối
app.listen(port, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${port}`)
})