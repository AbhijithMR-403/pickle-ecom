import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Plus, Pencil, Trash2, X,
  Save, Loader2, AlertTriangle, ChevronLeft, Search,
  LogOut, Check, Menu, Home, Globe
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categorySlice';
import { logout } from '../store/slices/authSlice';
import TailwindColorPicker, { COLORS } from '../components/TailwindColorPicker';

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

const extractErrorMessage = (err) => {
  const msg = err?.message || err;
  try {
    const parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
    if (parsed.error) return Array.isArray(parsed.error) ? parsed.error.join(' ') : parsed.error;
    if (parsed.detail) return parsed.detail;
    if (typeof parsed === 'object') {
      const msgs = Object.values(parsed).map(v => Array.isArray(v) ? v.join(' ') : String(v));
      if (msgs.length) return msgs.join(' ');
    }
  } catch(e) {}
  return typeof msg === 'string' ? msg : 'An unexpected error occurred';
};

// Convert any string to PascalCase so "leaf" → "Leaf", "spicy-pepper" → "SpicyPepper"
const toPascalCase = (str) =>
  str.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
     .replace(/^(.)/, (c) => c.toUpperCase());

// Live icon preview — renders the Lucide icon the user typed, if it exists
function LucidePreview({ name, size = 22, color = '#f97316' }) {
  if (!name) return null;
  const Icon = LucideIcons[toPascalCase(name)];
  if (!Icon) return null;
  return <Icon size={size} style={{ color }} />
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


// ─── Category Form Modal ──────────────────────────────────
function CategoryFormModal({ category, onSave, onClose, loading }) {
  const isEdit = !!category?.id;
  const DEFAULT_CATEGORY = { name: '', icon: '', color: 'orange-500', show_on_homepage: false, description: '' };
  const [form, setForm] = useState(category ? { ...DEFAULT_CATEGORY, ...category } : DEFAULT_CATEGORY);
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

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
            <input required className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Tender Mango" /></label>
            
          <div className="admin-field">
              <span className="flex items-center justify-between">Icon Name
                <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-[10px] text-orange-400 hover:underline">Find Icons ↗</a>
              </span>
              <div className="flex items-center gap-3">
                <input className="admin-input flex-1" value={form.icon || ''} onChange={e => setForm({...form, icon: e.target.value})} placeholder="e.g. Leaf, Flame, Pepper" />
                {/* Live preview badge — shows icon + color together */}
                {(() => {
                  const hex = COLORS.find(c => c.value === (form.color || 'orange-500'))?.hex || '#f97316';
                  const IconEl = form.icon ? LucideIcons[toPascalCase(form.icon)] : null;
                  return (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 transition-all"
                      style={{ backgroundColor: hex + '22', borderColor: hex + '55' }}
                      title={IconEl ? form.icon : 'Icon preview'}
                    >
                      {IconEl
                        ? <IconEl size={22} style={{ color: hex }} />
                        : <span className="text-[10px] text-gray-500 leading-none text-center px-1">{form.icon ? '?' : '—'}</span>
                      }
                    </div>
                  );
                })()}
              </div>
              {form.icon && !LucideIcons[toPascalCase(form.icon)] && (
                <p className="text-[11px] text-red-400 mt-1">Icon not found — check spelling at lucide.dev/icons</p>
              )}
          </div>

          <div className="admin-field">
            <span>Color</span>
            <TailwindColorPicker value={form.color || 'orange-500'} onChange={val => setForm({...form, color: val})} />
          </div>

          <label className="admin-field"><span>Description</span>
            <textarea className="admin-input min-h-[60px]" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} placeholder="Our most firey category..." /></label>

          <label className="admin-toggle my-2">
            <input type="checkbox" checked={form.show_on_homepage || false} onChange={e => setForm({...form, show_on_homepage: e.target.checked})} />
            <span>Show on Homepage</span>
          </label>

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
  const navigate = useNavigate();

  // Auth guard — redirect to login if not authenticated
  const { token } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login', { replace: true });
  };

  // Redux state
  const { items: products, loading: productsLoading } = useSelector(s => s.products);
  const { items: categories, loading: categoriesLoading } = useSelector(s => s.categories);

  // Local UI state
  const [tab, setTab] = useState('products');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
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

  const handleDeleteProduct = async () => {
    setSaving(true);
    try {
      await dispatch(deleteProduct(confirmDelete.id)).unwrap();
      showToast('Product deleted');
      setConfirmDelete(null);
      dispatch(fetchProducts());
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
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
      showToast(extractErrorMessage(err), 'error');
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
      showToast(extractErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Filtered lists ──────────────────────────────────────
  const q = search.toLowerCase();
  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  const filteredCategories = categories.filter(c => c.name?.toLowerCase().includes(q));

  const switchTab = (t) => { setTab(t); setSearch(''); setSidebarOpen(false); };

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="admin-root">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        admin-sidebar
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform shrink-0" />
            <span className="font-serif text-lg font-bold text-white">Pickle Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          <button onClick={() => switchTab('products')}
            className={`admin-nav-item ${tab === 'products' ? 'admin-nav-active' : ''}`}>
            <Package size={18} /> Products
            <span className="ml-auto text-xs opacity-60">{products.length}</span>
          </button>
          <button onClick={() => switchTab('categories')}
            className={`admin-nav-item ${tab === 'categories' ? 'admin-nav-active' : ''}`}>
            <Tag size={18} /> Categories
            <span className="ml-auto text-xs opacity-60">{categories.length}</span>
          </button>
        </nav>
        <div className="mt-auto p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <Home size={13} /> View Store
          </Link>
          <p className="text-xs text-gray-600">Ammachi's Kitchen &copy; 2026</p>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="flex items-center gap-3 flex-1">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors -ml-1"
            >
              <Menu size={20} />
            </button>
            <LayoutDashboard size={20} className="text-orange-400 hidden md:block" />
            <h2 className="text-base md:text-lg font-bold text-white capitalize">{tab}</h2>
          </div>
          <button onClick={handleLogout} className="admin-btn admin-btn-ghost text-xs gap-1.5">
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Toolbar */}
        <div className="admin-toolbar flex-wrap gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={`Search ${tab}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-input pl-9 py-2 w-full"
            />
          </div>
          <button
            className="admin-btn admin-btn-primary shrink-0"
            onClick={() => tab === 'products' ? navigate('/admin/product/add') : setCategoryModal({})}
          >
            <Plus size={16} />
            <span>Add {tab === 'products' ? 'Product' : 'Category'}</span>
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-orange-400" size={32} />
            </div>
          ) : tab === 'products' ? (
            <>
              {/* Desktop table */}
              <div className="admin-table-wrap hidden md:block">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th><th>Price</th><th>Status</th><th>Diet</th><th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-gray-500">No products found</td></tr>
                    ) : filteredProducts.map(p => {
                      const highlightImg = p.images?.find(img => img.is_highlight)?.image || p.images?.[0]?.image || null;
                      return (
                      <tr key={p.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            {highlightImg && <img src={highlightImg} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />}
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
                        <td><span className={`admin-badge ${p.is_active ? 'admin-badge-green' : 'admin-badge-gray'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td><span className={`admin-badge ${p.is_vegetarian ? 'admin-badge-green' : 'admin-badge-orange'}`}>{p.is_vegetarian ? 'Veg' : 'Non-Veg'}</span></td>
                        <td>
                          <div className="flex justify-end gap-1">
                            <button onClick={() => navigate(`/admin/product/edit/${p.id}`)} className="admin-action-btn" title="Edit"><Pencil size={14} /></button>
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

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No products found</div>
                ) : filteredProducts.map(p => {
                  const img = p.images?.find(i => i.is_highlight)?.image || p.images?.[0]?.image || null;
                  return (
                    <div key={p.id} className="bg-white/3 border border-white/6 rounded-xl p-4 flex gap-4 items-start">
                      {img && <img src={img} alt="" className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm mb-0.5 truncate">{p.name}</div>
                        <div className="text-xs text-gray-500 mb-2 truncate">{p.description}</div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-white font-bold text-sm">₹{p.discount_price || p.price}</span>
                          {p.discount_price && <span className="text-xs text-gray-400 line-through self-end">₹{p.price}</span>}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`admin-badge ${p.is_active ? 'admin-badge-green' : 'admin-badge-gray'}`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                          <span className={`admin-badge ${p.is_vegetarian ? 'admin-badge-green' : 'admin-badge-orange'}`}>{p.is_vegetarian ? 'Veg' : 'Non-Veg'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => navigate(`/admin/product/edit/${p.id}`)} className="admin-action-btn" title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => setConfirmDelete({ type: 'product', id: p.id, name: p.name })} className="admin-action-btn admin-action-danger" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Desktop category table */}
              <div className="admin-table-wrap hidden md:block">
                <table className="admin-table">
                  <thead><tr>
                    <th>Category</th>
                    <th>Icon</th>
                    <th>Color</th>
                    <th>Homepage</th>
                    <th className="text-right">Actions</th>
                  </tr></thead>
                  <tbody>
                    {filteredCategories.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-gray-500">No categories found</td></tr>
                    ) : filteredCategories.map(c => {
                      const CatIcon = c.icon ? LucideIcons[toPascalCase(c.icon)] : null;
                      const { COLORS: PC } = { COLORS: [] };
                      return (
                        <tr key={c.id}>
                          <td><span className="text-white font-medium">{c.name}</span></td>
                          <td>
                            {CatIcon
                              ? <CatIcon size={16} className="text-orange-400" />
                              : <span className="text-gray-600 text-xs">{c.icon || '—'}</span>}
                          </td>
                          <td>
                            <span className="text-xs text-gray-400 font-mono">{c.color || '—'}</span>
                          </td>
                          <td>
                            {c.show_on_homepage
                              ? <span className="admin-badge admin-badge-green flex items-center gap-1 w-fit"><Globe size={10} /> Yes</span>
                              : <span className="admin-badge admin-badge-gray">No</span>}
                          </td>
                          <td>
                            <div className="flex justify-end gap-1">
                              <button onClick={() => setCategoryModal(c)} className="admin-action-btn"><Pencil size={14} /></button>
                              <button onClick={() => setConfirmDelete({ type: 'category', id: c.id, name: c.name })}
                                className="admin-action-btn admin-action-danger"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile category cards */}
              <div className="md:hidden space-y-3">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No categories found</div>
                ) : filteredCategories.map(c => {
                  const CatIcon = c.icon ? LucideIcons[toPascalCase(c.icon)] : null;
                  return (
                    <div key={c.id} className="bg-white/3 border border-white/6 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 shrink-0">
                        {CatIcon
                          ? <CatIcon size={20} className="text-orange-400" />
                          : <span className="text-white font-bold text-lg">{c.name?.[0]?.toUpperCase()}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm mb-1">{c.name}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {c.icon && <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded">{c.icon}</span>}
                          {c.color && <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded">{c.color}</span>}
                          {c.show_on_homepage && <span className="admin-badge admin-badge-green text-[10px]">Homepage</span>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => setCategoryModal(c)} className="admin-action-btn"><Pencil size={14} /></button>
                        <button onClick={() => setConfirmDelete({ type: 'category', id: c.id, name: c.name })} className="admin-action-btn admin-action-danger"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
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
