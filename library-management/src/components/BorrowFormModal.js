import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import moment from "moment";
import { authApis, endpoints } from "../configs/API";

const BorrowFormModal = ({ isOpen, onClose, onSubmit, editingBorrow, allReaders }) => {
    const initialFormState = {
        userId: "",
        printBookId: "",
        borrowDate: moment().format("YYYY-MM-DD"),
        dueDate: moment().add(14, "days").format("YYYY-MM-DD"),
        returnDate: "",
        status: "Borrowed",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [selectedBookId, setSelectedBookId] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [availablePrintBooks, setAvailablePrintBooks] = useState([]);

    const fetchAndSetAvailablePrintBooks = useCallback(async (bookId, currentPrintBookId = null) => {
        if (!bookId) {
            setAvailablePrintBooks([]);
            setBookTitle("");
            return;
        }
        try {
            const res = await authApis().get(endpoints["printBook-bookid"](bookId));
            let available = res.data.filter(pb => pb.status === 'Available');

            if (currentPrintBookId) {
                const isCurrentInList = available.some(pb => pb.id === currentPrintBookId);
                if (!isCurrentInList) {
                    const printBookRes = await authApis().get(endpoints["printBook-id"](currentPrintBookId));
                    if (printBookRes.data) {
                        available.unshift(printBookRes.data);
                    }
                }
            }
            setAvailablePrintBooks(available);
            setBookTitle(available.length > 0 ? available[0].book.title : "Không có bản in nào");

        } catch (err) {
            console.error("Failed to fetch print books:", err);
            toast.error("Lỗi khi tải danh sách bản in.");
            setBookTitle("Lỗi");
            setAvailablePrintBooks([]);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editingBorrow) {
                setFormData({
                    id: editingBorrow.id,
                    userId: editingBorrow.userId,
                    printBookId: editingBorrow.printBookId,
                    borrowDate: moment(editingBorrow.borrowDate).format("YYYY-MM-DD"),
                    dueDate: moment(editingBorrow.dueDate).format("YYYY-MM-DD"),
                    returnDate: editingBorrow.returnDate ? moment(editingBorrow.returnDate).format("YYYY-MM-DD") : "",
                    status: editingBorrow.status,
                });
                const findBookIdAndFetch = async () => {
                     try {
                        const res = await authApis().get(endpoints["printBook-id"](editingBorrow.printBookId));
                        const bookId = res.data.book.id;
                        setSelectedBookId(bookId);
                        fetchAndSetAvailablePrintBooks(bookId, editingBorrow.printBookId);
                     } catch (error) {
                         console.error("Could not find book for print book", error)
                     }
                }
                findBookIdAndFetch();
            } else {
                setFormData(initialFormState);
                setSelectedBookId("");
                setBookTitle("");
                setAvailablePrintBooks([]);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingBorrow, isOpen, fetchAndSetAvailablePrintBooks]);

    const handleBookIdChange = (e) => {
        const newBookId = e.target.value;
        setSelectedBookId(newBookId);
        setFormData(prev => ({ ...prev, printBookId: "" }));
        fetchAndSetAvailablePrintBooks(newBookId);
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const submissionData = {
            ...formData,
            user: { id: parseInt(formData.userId) },
            printBook: { id: parseInt(formData.printBookId) }
        };
        
        await onSubmit(submissionData);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {editingBorrow ? "Cập nhật Phiếu mượn" : "Tạo Phiếu mượn mới"}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">Bạn đọc</label>
                        <select id="userId" name="userId" value={formData.userId} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                            <option value="">-- Chọn bạn đọc --</option>
                            {allReaders.map(reader => (
                                <option key={reader.id} value={reader.id}>
                                    {`${reader.user.firstName} ${reader.user.lastName} - (ID: ${reader.id})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end gap-3">
                        <div className="flex-grow">
                            <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">Nhập Book ID</label>
                            <input 
                                type="number" 
                                id="bookId" 
                                name="bookId" 
                                value={selectedBookId} 
                                onChange={handleBookIdChange} 
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                placeholder="Nhập ID sách..."
                                required 
                            />
                        </div>
                        {bookTitle && (
                            <span className={`pb-2 font-semibold ${bookTitle.includes("Lỗi") || bookTitle.includes("Không có") ? "text-red-500" : "text-green-600"}`}>
                                {bookTitle}
                            </span>
                        )}
                    </div>
                    <div>
                        <label htmlFor="printBookId" className="block text-sm font-medium text-gray-700 mb-1">Bản in có sẵn</label>
                        <select id="printBookId" name="printBookId" value={formData.printBookId} onChange={handleChange} disabled={!selectedBookId || availablePrintBooks.length === 0} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100" required>
                            <option value="">-- Chọn bản in --</option>
                            {availablePrintBooks.map(pb => (
                                <option key={pb.id} value={pb.id}>
                                    {`Bản in ID: ${pb.id} - Trạng thái: ${pb.status}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="borrowDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày mượn</label>
                            <input type="date" id="borrowDate" name="borrowDate" value={formData.borrowDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Hạn trả</label>
                            <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} min={formData.borrowDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                        </div>
                    </div>
                     {editingBorrow && (
                        <div>
                            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày trả (nếu có)</label>
                            <input type="date" id="returnDate" name="returnDate" value={formData.returnDate}  onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                     )}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                            <option value="Pending">Chờ duyệt</option>
                            <option value="Borrowed">Đang mượn</option>
                            <option value="Returned">Đã trả</option>
                            <option value="Overdue">Quá hạn</option>
                            <option value="Cancelled">Đã hủy</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">Hủy</button>
                        <button type="submit" disabled={isLoading} className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300">
                            {isLoading ? 'Đang lưu...' : (editingBorrow ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BorrowFormModal;