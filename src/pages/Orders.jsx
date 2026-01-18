import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import { formatCurrency, formatDateTime, getStatusColor } from '../utils/helpers';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    tracking_number: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        ...(searchQuery && { order_number: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
        sort_by: 'created_at',
        sort_order: 'desc',
      };

      const response = await ordersAPI.getAll(params);
      setOrders(response.data.data);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const response = await ordersAPI.getById(order.id);
      setSelectedOrder(response.data.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.updateStatus(selectedOrder.id, statusUpdate);
      toast.success('Order status updated successfully');
      setShowStatusModal(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const columns = [
    {
      header: 'Order Number',
      accessor: 'order_number',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.order_number}</div>
          <div className="text-xs text-gray-500">{formatDateTime(row.created_at)}</div>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'user_id',
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.shipping_address?.full_name || 'N/A'}
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.items?.length || 0} items</span>
      ),
    },
    {
      header: 'Total',
      accessor: 'total_amount',
      render: (row) => (
        <span className="font-semibold text-gray-900">{formatCurrency(row.total_amount)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'payment_info',
      render: (row) => (
        <span className={`badge ${getStatusColor(row.payment_info?.status)}`}>
          {row.payment_info?.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer orders</p>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field w-64"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="card">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Table columns={columns} data={orders} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>

        {/* Order Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`Order Details - ${selectedOrder?.order_number}`}
          size="lg"
        >
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                  <span className={`badge ${getStatusColor(selectedOrder.status)} mt-1`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                  <span className={`badge ${getStatusColor(selectedOrder.payment_info?.status)} mt-1`}>
                    {selectedOrder.payment_info?.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                  <p className="mt-1 capitalize">{selectedOrder.payment_info?.method?.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                  <p className="mt-1">{formatDateTime(selectedOrder.created_at)}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedOrder.shipping_address?.full_name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shipping_address?.phone}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedOrder.shipping_address?.address_line1}
                    {selectedOrder.shipping_address?.address_line2 && `, ${selectedOrder.shipping_address.address_line2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.postal_code}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrder.shipping_address?.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm">{item.product_name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.sku}</td>
                          <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(selectedOrder.shipping_fee)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setStatusUpdate({
                      status: selectedOrder.status,
                      tracking_number: selectedOrder.tracking_number || '',
                    });
                    setShowStatusModal(true);
                  }}
                  className="btn-primary"
                >
                  Update Status
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Update Status Modal */}
        <Modal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title="Update Order Status"
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <select
                value={statusUpdate.status}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                className="input-field"
                required
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number (Optional)
              </label>
              <input
                type="text"
                value={statusUpdate.tracking_number}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, tracking_number: e.target.value })}
                className="input-field"
                placeholder="Enter tracking number"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Status
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Orders;
