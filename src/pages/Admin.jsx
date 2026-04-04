import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Plus, Pencil, Trash2, X,
  Save, Loader2, AlertTriangle, ChevronLeft, Search,
  LogOut, Check
} from 'lucide-react';

import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categorySlice';
import { logout } from '../store/slices/authSlice';

// ─── Toast ────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast ${type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}>
      {type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
      <span>{message}</span>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-red-400" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="admin-btn admin-btn-ghost" disabled={loading}>Cancel</button>
          <button onClick={onConfirm} className="admin-btn admin-btn-danger" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Product Form Modal ───────────────────────────────────
const EMPTY_PRODUCT = {
  name: '', description: '', sub_description: '', price: '', discount_price: '',
  stock_quantity: 0, is_active: true, is_vegetarian: true, net_weight: '',
  ingredients: '', nutritional_information: '', shelf_life_days: 180,
  topics: [], highlight_image: null, uploaded_images: null, categories: []
};

function ProductFormModal({ product, categories, onSave, onClose, loading }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState(() => {
    if (product?.id) {
      const existingCategories = product.category_details || product.categories || [];
      return {
        ...EMPTY_PRODUCT, ...product,
        categories: existingCategories.map(c => typeof c === 'object' ? c.id : c),
        topics: Array.isArray(product.topics) ? product.topics : [],
      };
    }
    return { ...EMPTY_PRODUCT };
  });
  const [topicInput, setTopicInput] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const filteredCategoryOptions = categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));

  const [highlightPreview, setHighlightPreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  useEffect(() => {
    if (form.highlight_image instanceof File) {
      const url = URL.createObjectURL(form.highlight_image);
      setHighlightPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setHighlightPreview(null);
    }
  }, [form.highlight_image]);

  useEffect(() => {
    if (form.uploaded_images && form.uploaded_images.length > 0) {
      const urls = Array.from(form.uploaded_images).map(file => URL.createObjectURL(file));
      setAdditionalPreviews(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setAdditionalPreviews([]);
    }
  }, [form.uploaded_images]);

  const addTopic = () => {
    if (topicInput.trim() && !form.topics.includes(topicInput.trim())) {
      set('topics', [...form.topics, topicInput.trim()]);
      setTopicInput('');
    }
  };
  const toggleCategory = (catId) => {
    set('categories', form.categories.includes(catId)
      ? form.categories.filter(id => id !== catId) : [...form.categories, catId]);
  };
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Package size={20} className="text-orange-400" />
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 admin-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="admin-field"><span>Name *</span>
              <input required className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} /></label>
            <label className="admin-field"><span>Price *</span>
              <input required className="admin-input" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} /></label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="admin-field"><span>Discount Price</span>
              <input className="admin-input" type="number" step="0.01" value={form.discount_price} onChange={e => set('discount_price', e.target.value)} /></label>
            <label className="admin-field"><span>Net Weight</span>
              <input className="admin-input" value={form.net_weight} placeholder="e.g. 250g" onChange={e => set('net_weight', e.target.value)} /></label>
          </div>
          <label className="admin-field"><span>Description</span>
            <textarea className="admin-input min-h-[70px]" value={form.description} onChange={e => set('description', e.target.value)} /></label>
          <label className="admin-field"><span>Sub-description</span>
            <input className="admin-input" value={form.sub_description} onChange={e => set('sub_description', e.target.value)} /></label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="admin-field"><span>Stock Quantity</span>
              <input className="admin-input" type="number" value={form.stock_quantity} onChange={e => set('stock_quantity', parseInt(e.target.value) || 0)} /></label>
            <label className="admin-field"><span>Shelf Life (days)</span>
              <input className="admin-input" type="number" value={form.shelf_life_days} onChange={e => set('shelf_life_days', parseInt(e.target.value) || 0)} /></label>
          </div>
          <label className="admin-field"><span>Ingredients</span>
            <input className="admin-input" value={form.ingredients} onChange={e => set('ingredients', e.target.value)} /></label>
          <label className="admin-field"><span>Nutritional Information</span>
            <input className="admin-input" value={form.nutritional_information} onChange={e => set('nutritional_information', e.target.value)} /></label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="admin-field"><span>Highlight Image</span>
              <input type="file" accept="image/*" className="admin-input cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 text-gray-400"
                onChange={e => set('highlight_image', e.target.files[0])} /></label>
            <label className="admin-field"><span>Additional Images</span>
              <input type="file" accept="image/*" multiple className="admin-input cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 text-gray-400"
                onChange={e => set('uploaded_images', e.target.files)} /></label>
          </div>

          {(highlightPreview || additionalPreviews.length > 0 || (isEdit && product.images?.length > 0)) && (
            <div className="admin-field"><span>Image Previews</span>
              <div className="flex gap-3 overflow-x-auto pb-2 admin-scroll items-end">
                {/* Highlight Preview */}
                {highlightPreview ? (
                  <div className="relative shrink-0 group">
                    <img src={highlightPreview} alt="preview" className="h-[72px] w-[72px] object-cover rounded-lg border border-orange-500/50" />
                    <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded shadow">New Highlight</span>
                  </div>
                ) : isEdit && product.images?.find(i => i.is_highlight) ? (
                  <div className="relative shrink-0 group">
                    <img src={product.images.find(i => i.is_highlight).image} alt="existing" className="h-[72px] w-[72px] object-cover rounded-lg border border-white/10" />
                    <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold bg-gray-700 text-white px-1.5 py-0.5 rounded shadow">Current Highlight</span>
                  </div>
                ) : null}

                {/* Additional Previews */}
                {additionalPreviews.length > 0 ? (
                  additionalPreviews.map((url, i) => (
                    <div key={url} className="relative shrink-0 group">
                      <img src={url} alt={`preview-${i}`} className="h-[72px] w-[72px] object-cover rounded-lg border border-white/30" />
                      <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold bg-white/20 text-white px-1.5 py-0.5 rounded shadow">New Image</span>
                    </div>
                  ))
                ) : isEdit && product.images?.filter(i => !i.is_highlight)?.length > 0 ? (
                   product.images.filter(i => !i.is_highlight).map(img => (
                    <div key={img.id} className="relative shrink-0 group">
                      <img src={img.image} alt="existing" className="h-[72px] w-[72px] object-cover rounded-lg border border-white/10" />
                    </div>
                   ))
                ) : null}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <label className="admin-toggle"><input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} /><span>Active</span></label>
            <label className="admin-toggle"><input type="checkbox" checked={form.is_vegetarian} onChange={e => set('is_vegetarian', e.target.checked)} /><span>Vegetarian</span></label>
          </div>

          <div className="admin-field"><span>Topics</span>
            <div className="flex gap-2">
              <input className="admin-input flex-1" value={topicInput} onChange={e => setTopicInput(e.target.value)}
                placeholder="Add a topic" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTopic(); } }} />
              <button type="button" onClick={addTopic} className="admin-btn admin-btn-ghost px-3"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.topics.map(t => (
                <span key={t} className="admin-chip">{t}
                  <button type="button" onClick={() => set('topics', form.topics.filter(x => x !== t))}><X size={10} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="admin-field"><span>Categories</span>
            <input className="admin-input mb-1 text-sm py-1.5" placeholder="Search categories..." value={categorySearch} onChange={e => setCategorySearch(e.target.value)} />
            <div className="flex flex-wrap gap-2 mt-1">
              {filteredCategoryOptions.map(cat => (
                <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${form.categories.includes(cat.id)
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                  {cat.name}
                </button>
              ))}
              {filteredCategoryOptions.length === 0 && <span className="text-gray-500 text-xs">No categories found matching "{categorySearch}"</span>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEdit ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Category Form Modal ──────────────────────────────────
function CategoryFormModal({ category, onSave, onClose, loading }) {
  const isEdit = !!category?.id;
  const [name, setName] = useState(category?.name || '');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ name }); };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag size={20} className="text-orange-400" />
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="admin-field"><span>Category Name *</span>
            <input required className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tender Mango" /></label>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN PAGE — uses Redux for all state management
// ═══════════════════════════════════════════════════════════
export default function Admin() {
  const dispatch = useDispatch();

  // Auth guard — redirect to login if not authenticated
  const { token } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/admin/login" replace />;

  // Redux state
  const { items: products, loading: productsLoading } = useSelector(s => s.products);
  const { items: categories, loading: categoriesLoading } = useSelector(s => s.categories);

  // Local UI state
  const [tab, setTab] = useState('products');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals
  const [productModal, setProductModal] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  // ── Initial data fetch ──────────────────────────────────
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const loading = productsLoading || categoriesLoading;

  // ── Product CRUD handlers ───────────────────────────────
  const saveProduct = async (formValues) => {
    setSaving(true);
    try {
      const payload = new FormData();
      Object.keys(formValues).forEach(key => {
        if (key === 'categories') {
          formValues.categories.forEach(id => payload.append('categories', id));
        } else if (key === 'topics') {
          formValues.topics.forEach(t => payload.append('topics', t));
        } else if (key === 'highlight_image') {
          if (formValues.highlight_image instanceof File) {
            payload.append('highlight_image', formValues.highlight_image);
          }
        } else if (key === 'uploaded_images') {
          if (formValues.uploaded_images && formValues.uploaded_images.length) {
            Array.from(formValues.uploaded_images).forEach(file => {
              payload.append('uploaded_images', file);
            });
          }
        } else if (key === 'is_active' || key === 'is_vegetarian') {
          payload.append(key, formValues[key] ? 'True' : 'False');
        } else if (formValues[key] !== null && formValues[key] !== '') {
          payload.append(key, formValues[key]);
        }
      });

      if (formValues.id) {
        await dispatch(updateProduct({ id: formValues.id, data: payload })).unwrap();
        showToast('Product updated');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        showToast('Product created');
      }
      setProductModal(null);
      // Ensure state is perfectly synced with the backend
      dispatch(fetchProducts());
    } catch (err) {
      showToast(err, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    setSaving(true);
    try {
      await dispatch(deleteProduct(confirmDelete.id)).unwrap();
      showToast('Product deleted');
      setConfirmDelete(null);
      dispatch(fetchProducts());
    } catch (err) {
      showToast(err, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Category CRUD handlers ──────────────────────────────
  const saveCategory = async (formData) => {
    setSaving(true);
    try {
      if (categoryModal?.id) {
        await dispatch(updateCategory({ id: categoryModal.id, data: formData })).unwrap();
        showToast('Category updated');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        showToast('Category created');
      }
      setCategoryModal(null);
      // Ensure state is perfectly synced with the backend
      dispatch(fetchCategories());
    } catch (err) {
      showToast(err, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    setSaving(true);
    try {
      await dispatch(deleteCategory(confirmDelete.id)).unwrap();
      showToast('Category deleted');
      setConfirmDelete(null);
      dispatch(fetchCategories());
    } catch (err) {
      showToast(err, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Filtered lists ──────────────────────────────────────
  const q = search.toLowerCase();
  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  const filteredCategories = categories.filter(c => c.name?.toLowerCase().includes(q));

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="admin-root">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-serif text-lg font-bold text-white">Pickle Admin</span>
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          <button onClick={() => setTab('products')}
            className={`admin-nav-item ${tab === 'products' ? 'admin-nav-active' : ''}`}>
            <Package size={18} /> Products
            <span className="ml-auto text-xs opacity-60">{products.length}</span>
          </button>
          <button onClick={() => setTab('categories')}
            className={`admin-nav-item ${tab === 'categories' ? 'admin-nav-active' : ''}`}>
            <Tag size={18} /> Categories
            <span className="ml-auto text-xs opacity-60">{categories.length}</span>
          </button>
        </nav>
        <div className="mt-auto p-4 border-t border-white/5 text-xs text-gray-500">
          Ammachi's Kitchen &copy; 2026
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="flex items-center gap-3 flex-1">
            <LayoutDashboard size={20} className="text-orange-400" />
            <h2 className="text-lg font-bold text-white capitalize">{tab}</h2>
          </div>
          <button onClick={() => dispatch(logout())} className="admin-btn admin-btn-ghost text-xs gap-1.5">
            <LogOut size={14} /> Logout
          </button>
        </header>

        <div className="admin-toolbar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder={`Search ${tab}…`} value={search} onChange={e => setSearch(e.target.value)}
              className="admin-input pl-9 py-2 w-full" />
          </div>
          <button className="admin-btn admin-btn-primary"
            onClick={() => tab === 'products' ? setProductModal({}) : setCategoryModal({})}>
            <Plus size={16} /> Add {tab === 'products' ? 'Product' : 'Category'}
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-orange-400" size={32} />
            </div>
          ) : tab === 'products' ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Diet</th><th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-500">No products found</td></tr>
                  ) : filteredProducts.map(p => {
                    const highlightImg = p.images?.find(img => img.is_highlight)?.image || p.images?.[0]?.image || null;
                    return (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {highlightImg && <img src={highlightImg} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />}
                          <div>
                            <div className="font-semibold text-white text-sm">{p.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white font-medium">₹{p.price}</span>
                        {p.discount_price && <span className="text-xs text-emerald-400 ml-1">₹{p.discount_price}</span>}
                      </td>
                      <td><span className={`text-sm font-medium ${(p.stock_quantity ?? 0) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{p.stock_quantity ?? '—'}</span></td>
                      <td><span className={`admin-badge ${p.is_active ? 'admin-badge-green' : 'admin-badge-gray'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td><span className={`admin-badge ${p.is_vegetarian ? 'admin-badge-green' : 'admin-badge-orange'}`}>{p.is_vegetarian ? 'Veg' : 'Non-Veg'}</span></td>
                      <td>
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setProductModal(p)} className="admin-action-btn" title="Edit"><Pencil size={14} /></button>
                          <button onClick={() => setConfirmDelete({ type: 'product', id: p.id, name: p.name })}
                            className="admin-action-btn admin-action-danger" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th className="text-right">Actions</th></tr></thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-12 text-gray-500">No categories found</td></tr>
                  ) : filteredCategories.map(c => (
                    <tr key={c.id}>
                      <td><span className="text-gray-400 font-mono text-xs">#{c.id}</span></td>
                      <td><span className="text-white font-medium">{c.name}</span></td>
                      <td>
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setCategoryModal(c)} className="admin-action-btn" title="Edit"><Pencil size={14} /></button>
                          <button onClick={() => setConfirmDelete({ type: 'category', id: c.id, name: c.name })}
                            className="admin-action-btn admin-action-danger" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {productModal !== null && (
        <ProductFormModal product={productModal} categories={categories}
          onSave={saveProduct} onClose={() => setProductModal(null)} loading={saving} />
      )}
      {categoryModal !== null && (
        <CategoryFormModal category={categoryModal}
          onSave={saveCategory} onClose={() => setCategoryModal(null)} loading={saving} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${confirmDelete.type}?`}
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete.type === 'product' ? handleDeleteProduct : handleDeleteCategory}
          onCancel={() => setConfirmDelete(null)}
          loading={saving}
        />
      )}
    </div>
  );
}
