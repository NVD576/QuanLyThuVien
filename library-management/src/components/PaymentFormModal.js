// src/components/payments/PaymentFormModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";

const PaymentFormModal = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  isViewMode,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    fineId: "",
    paymentType: "",
    amount: 0,
    paymentMethod: "",
    status: "Successful",
    paymentDate: "",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        userId: initialData.user?.id || "",
        fineId: initialData.fine?.id || "",
        paymentType: initialData.paymentType || "",
        amount: initialData.amount || 0,
        paymentMethod: initialData.paymentMethod || "",
        status: initialData.status || "Successful",
        paymentDate: initialData.paymentDate || "",
        note: initialData.note || "",
      });
    } else {
      setFormData({
        id: "",
        userId: "",
        fineId: "",
        paymentType: "",
        amount: 0,
        paymentMethod: "",
        status: "Successful",
        paymentDate: "",
        note: "",
      });
    }
  }, [initialData]);

  const handleOk = () => {
    if (!isViewMode) {
      onSubmit({ ...formData });
    }
    onCancel();
  };

  const renderField = (label, value, inputEl) => (
    <div>
      <label>{label}:</label>
      {isViewMode ? (
        <div style={{ fontWeight: "bold", marginTop: 4 }}>{value || "-"}</div>
      ) : (
        inputEl
      )}
    </div>
  );

  return (
    <Modal
      title={
        isViewMode
          ? "Xem chi tiết Payment"
          : initialData
          ? "Cập nhật Payment"
          : "Thêm Payment"
      }
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isViewMode ? "Đóng" : "Lưu"}
      cancelButtonProps={{
        style: { display: isViewMode ? "none" : "inline-block" },
      }}
    >
      <div className="space-y-3">
        {formData.id &&
          renderField(
            "ID",
            formData.id,
            <Input value={formData.id} disabled />
          )}

        {renderField(
          "User ID",
          formData.userId,
          <Input
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
          />
        )}

        {renderField(
          "Fine ID",
          formData.fineId,
          <Input
            value={formData.fineId}
            onChange={(e) =>
              setFormData({ ...formData, fineId: e.target.value })
            }
          />
        )}

        {renderField(
          "Loại thanh toán",
          formData.paymentType,
          <Select
            style={{ width: "100%" }}
            value={formData.paymentType}
            onChange={(value) =>
              setFormData({ ...formData, paymentType: value })
            }
          >
            <Select.Option value="Fine">Fine</Select.Option>
            <Select.Option value="Membership">Membership</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        )}

        {renderField(
          "Số tiền",
          formData.amount,
          <InputNumber
            style={{ width: "100%" }}
            value={formData.amount}
            onChange={(value) => setFormData({ ...formData, amount: value })}
          />
        )}

        {renderField(
          "Phương thức thanh toán",
          formData.paymentMethod,
          <Select
            style={{ width: "100%" }}
            value={formData.paymentMethod}
            onChange={(value) =>
              setFormData({ ...formData, paymentMethod: value })
            }
          >
            <Select.Option value="Cash">Cash</Select.Option>
            <Select.Option value="BankTransfer">BankTransfer</Select.Option>
          </Select>
        )}
        {renderField(
          "Trạng thái",
          formData.status,
          <Select
            style={{ width: "100%" }}
            value={formData.status}
            onChange={(value) =>
              setFormData({ ...formData, status: value })
            }
          >
            <Select.Option value="Successful">Successful</Select.Option>
            <Select.Option value="Failed">Failed</Select.Option>
            <Select.Option value="Pending">Pending</Select.Option>
          </Select>
        )}
        {renderField(
          "Ngày thanh toán",
          formData.paymentDate
            ? dayjs(formData.paymentDate).format("DD/MM/YYYY")
            : "",
          <DatePicker
            style={{ width: "100%" }}
            value={formData.paymentDate ? dayjs(formData.paymentDate) : null}
            onChange={(date) =>
              setFormData({
                ...formData,
                paymentDate: date ? date.format("YYYY-MM-DDTHH:mm:ss") : "",
              })
            }
          />
        )}

        {renderField(
          "Ghi chú",
          formData.note,
          <Input.TextArea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        )}
      </div>
    </Modal>
  );
};

export default PaymentFormModal;
