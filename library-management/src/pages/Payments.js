import React, { useEffect, useState, useContext } from "react";
import usePayments from "../hooks/usePayments";
import PaymentFormModal from "../components/PaymentFormModal";
import { 
  Table, 
  Button, 
  Space, 
  Card,  
  Tag, 
  Input,
  DatePicker,
  InputNumber,
  Statistic,
  Row,
  Col,
  Divider,
  message,
  Popconfirm
} from "antd";
import {
  PlusOutlined,
  FilterOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import dayjs from "dayjs";
import Pagination from "../components/layouts/Pagination";
import { MyUserContext } from "../configs/MyContexts";

const { RangePicker } = DatePicker;
const { Search } = Input;

const Payments = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [modalMode, setModalMode] = useState("view"); 

  const [userIdFilter, setUserIdFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [searchText, setSearchText] = useState("");
  
  const currentUser = useContext(MyUserContext);
  const role = currentUser?.role;
  const isAdmin = role === "Admin";
  const isLibrarian = role === "Librarian";


  const canView = isAdmin || isLibrarian;
  const canEdit = isAdmin; 
  const canDelete = isAdmin; 
  const canAdd = isAdmin; 
  
  const {
    payments,
    loading,
    page,
    setPage,
    totalPages,
    loadPayments,
    createPayment,
    updatePayment,
    deletePayment,
  } = usePayments();

  useEffect(() => {
    loadPayments({ page });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === "Successful").length;

  const handleResetFilters = () => {
    setUserIdFilter(null);
    setDateRange([]);
    setSearchText("");
    loadPayments({ page: 0 });
  };

  const handleFilter = () => {
    loadPayments({
      search: searchText,
      userId: userIdFilter,
      startDate: dateRange[0],
      endDate: dateRange[1],
      page: 0
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "green";
      case "Pending": return "orange";
      case "Failed": return "red";
      case "Refunded": return "purple";
      default: return "blue";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Bank Transfer": return "🏦";
      case "Cash": return "💰";
      default: return "📱";
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, fixed: 'left' },
    {
      title: "Người dùng",
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {record.user ? `${record.user.firstName || ""} ${record.user.lastName || ""}`.trim() : "N/A"}
          </div>
          <div className="text-xs text-gray-500">ID: {record.user?.id || "N/A"}</div>
        </div>
      ),
    },
    { 
      title: "Loại", 
      dataIndex: "paymentType",
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    { 
      title: "Số tiền", 
      dataIndex: "amount",
      render: (amount) => (
        <div className="font-medium text-green-600">
          {amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : "0₫"}
        </div>
      )
    },
    { 
      title: "Phương thức", 
      dataIndex: "paymentMethod",
      render: (method) => (
        <div className="flex items-center">
          <span className="mr-1">{getPaymentMethodIcon(method)}</span>
          {method}
        </div>
      )
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      render: (date) => (
        <div>
          <div>{date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}</div>
        </div>
      )
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { 
      title: "Ghi chú", 
      dataIndex: "note",
      ellipsis: true,
      render: (note) => note || "—"
    },
    {
      title: "Hành động",
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          {canView && (
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => {
                setEditingPayment(record);
                setModalMode("view");
                setModalVisible(true);
              }}
            >
          
              
            </Button>
          )}

          {canEdit && (
            <Button 
              icon={<EditOutlined />} 
              size="small"
              type="primary" 
              onClick={() => {
                setEditingPayment(record);
                setModalMode("edit");
                setModalVisible(true);
              }}
            >
              
            </Button>
          )}

          {canDelete && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => {
                deletePayment(record.id)
              }}
            >
              <Button icon={<DeleteOutlined />} danger size="small"></Button>
            </Popconfirm>
          )}
        </Space>
      ),
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <DollarCircleOutlined className="mr-3 text-blue-500" />
          Quản lý Thanh toán
        </h2>
        <p className="text-gray-600">Theo dõi và quản lý tất cả các giao dịch thanh toán trong hệ thống</p>
      </div>

      {isLibrarian && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800">Chế độ xem Thủ thư</h3>
          <p className="text-sm text-blue-700 mt-1">
            Bạn chỉ có thể xem danh sách và chi tiết thanh toán. Không thể thêm, sửa hoặc xóa.
          </p>
        </div>
      )}

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card><Statistic title="Tổng số thanh toán" value={payments.length} /></Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số tiền"
              value={totalAmount}
              prefix="₫"
              formatter={val => new Intl.NumberFormat('vi-VN').format(val)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Đã hoàn thành" value={completedPayments} suffix={`/ ${payments.length}`} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Trang hiện tại" value={page + 1} suffix={`/ ${totalPages}`} /></Card>
        </Col>
      </Row>

      <Card className="mb-6" title={<><FilterOutlined className="mr-2" />Bộ lọc và Tìm kiếm</>}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} md={8}>
            <Search
              placeholder="Tìm theo tên, ghi chú..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleFilter}
            />
          </Col>
          <Col xs={24} md={8}>
            <InputNumber
              placeholder="Nhập User ID"
              className="w-full"
              value={userIdFilter}
              onChange={(val) => setUserIdFilter(val)}
            />
          </Col>
          <Col xs={24} md={8}>
            <RangePicker
              className="w-full"
              onChange={(dates) => {
                setDateRange(dates ? [
                  dates[0]?.format("YYYY-MM-DD"),
                  dates[1]?.format("YYYY-MM-DD")
                ] : []);
              }}
              value={dateRange[0] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
            />
          </Col>
          <Col xs={24}>
            <Space>
              <Button type="primary" icon={<FilterOutlined />} onClick={handleFilter}>
                Áp dụng
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
                Đặt lại
              </Button>
              {canAdd && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingPayment(null);
                    setModalMode("create");
                    setModalVisible(true);
                  }}
                >
                  Thêm thanh toán
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
          size="middle"
        />
        
        <Divider />
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-600">Hiển thị {payments.length} kết quả</div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      {modalVisible && (
        <PaymentFormModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          initialData={editingPayment}
          isViewMode={modalMode === "view"}   
          onSubmit={(data) => {
            if (modalMode === "edit" && editingPayment && canEdit) {
              updatePayment(editingPayment.id, data)
            } else if (modalMode === "create" && canAdd) {
              createPayment(data)
            }
            setModalVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default Payments;
