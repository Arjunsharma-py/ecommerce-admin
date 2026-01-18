import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { productsAPI, categoriesAPI } from "../utils/api";
import { formatCurrency, formatDate, truncate } from "../utils/helpers";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import ImageUpload from "../components/ImageUpload";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    sku: "",
    stock_quantity: "",
    is_active: true,
    is_featured: false,
    images: [],
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category_id: selectedCategory }),
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      console.log("Fetched categories:", response.data.data);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        sku: formData.sku || undefined,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        images: formData.images || [],
        inventory: {
          stock_quantity: parseInt(formData.stock_quantity),
          track_inventory: true,
        },
      };

      console.log("Submitting product with payload:", payload);
      console.log("Available categories:", categories);

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, payload);
        toast.success("Product updated successfully");
      } else {
        await productsAPI.create(payload);
        toast.success("Product created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (editingProduct ? "Failed to update product" : "Failed to create product");
      toast.error(errorMsg);
      console.error("Product submission error:", error.response?.data);
      console.error("Form data:", formData);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      sku: product.sku,
      stock_quantity: product.inventory?.stock_quantity || 0,
      is_active: product.is_active,
      is_featured: product.is_featured,
      images: product.images || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsAPI.delete(id);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      sku: "",
      stock_quantity: "",
      is_active: true,
      is_featured: false,
      images: [],
    });
    setEditingProduct(null);
  };

  const columns = [
    {
      header: "Product",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images && row.images[0] ? (
            <img
              src={row.images[0]}
              alt={row.name}
              className="w-12 h-12 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48?text=No+Image";
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.sku}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      render: (row) => <div className="text-sm text-gray-600">{truncate(row.description, 60)}</div>,
    },
    {
      header: "Price",
      accessor: "price",
      render: (row) => (
        <span className="font-semibold text-gray-900">{formatCurrency(row.price)}</span>
      ),
    },
    {
      header: "Stock",
      accessor: "inventory",
      render: (row) => {
        const stock = row.inventory?.stock_quantity || 0;
        return (
          <span
            className={`font-medium ${stock > 10 ? "text-green-600" : stock > 0 ? "text-yellow-600" : "text-red-600"}`}
          >
            {stock}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "is_active",
      render: (row) => (
        <span className={`badge ${row.is_active ? "badge-success" : "badge-gray"}`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <div className="card mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field w-64"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Table columns={columns} data={products} />
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

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editingProduct ? "Edit Product" : "Add New Product"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="input-field"
                  disabled={!!editingProduct}
                  placeholder="Leave empty to auto-generate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="col-span-2">
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={5}
                />
              </div>

              <div className="col-span-2 flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Products;
