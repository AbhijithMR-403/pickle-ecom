import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, Package, X, Plus, Tag } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { fetchProducts, createProduct, updateProduct } from '../store/slices/productSlice';
import { fetchCategories, createCategory } from '../store/slices/categorySlice';
import TailwindColorPicker, { COLORS } from '../components/TailwindColorPicker';

const EMPTY_PRODUCT = {
  name: '', description: '', sub_description: '', price: '', discount_price: '',
  is_active: true, is_vegetarian: true, net_weight: '',
  ingredients: '', nutritional_information: '', shelf_life_days: 180,
  taste: '', is_preservation_free: false, best_seller: false,
  highlight_image: null, uploaded_images: null, categories: []
};

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

const toPascalCase = (str) =>
  str.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
     .replace(/^(.)/, (c) => c.toUpperCase());

function LucidePreview({ name, size = 20, color = '#f97316' }) {
  if (!name) return null;
  const Icon = LucideIcons[toPascalCase(name)];
  if (!Icon) return null;
  return <Icon size={size} style={{ color }} />;
}

const TASTE_CHOICES = [
  { value: '', label: 'None' },
  { value: 'Very_Spicy', label: 'Very Spicy' },
  { value: 'Medium_Spicy', label: 'Medium Spicy' },
  { value: 'Mild_Spicy', label: 'Mild Spicy' },
  { value: 'Sour', label: 'Sour' },
  { value: 'Sweet', label: 'Sweet' },
  { value: 'Sweet_Sour', label: 'Sweet & Sour' },
  { value: 'Spicy_Sour', label: 'Spicy & Sour' },
  { value: 'Spicy_Sweet', label: 'Spicy & Sweet' },
];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading: productsLoading } = useSelector(s => s.products);
  const { items: categories } = useSelector(s => s.categories);
  
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const DEFAULT_CATEGORY = { name: '', icon: '', color: 'orange-500', show_on_homepage: false, description: '' };
  const [newCatForm, setNewCatForm] = useState(DEFAULT_CATEGORY);
  const [savingCategory, setSavingCategory] = useState(false);
  
  const [highlightPreview, setHighlightPreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, products.length, categories.length]);

  useEffect(() => {
    if (isEdit && products.length > 0) {
      const product = products.find(p => p.id.toString() === id);
      if (product) {
        const existingCategories = product.category_details || product.categories || [];
        // `ingredients` comes back as a comma-separated string from to_representation
        const ingredientsStr = typeof product.ingredients === 'string'
          ? product.ingredients
          : (product.ingredient_details || []).map(i => i.name).join(', ');
        setForm({
          ...EMPTY_PRODUCT, ...product,
          categories: existingCategories.map(c => typeof c === 'object' ? c.id : c),
          ingredients: ingredientsStr,
          best_seller: product.best_seller ?? false,
        });
      }
    } else if (!isEdit) {
      setForm(EMPTY_PRODUCT);
    }
  }, [id, isEdit, products]);

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

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  
  const toggleCategory = (catId) => {
    set('categories', form.categories.includes(catId)
      ? form.categories.filter(cid => cid !== catId) : [...form.categories, catId]);
  };

  const filteredCategoryOptions = categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatForm.name.trim()) return;
    setSavingCategory(true);
    try {
      const payload = { ...newCatForm, name: newCatForm.name.trim() };
      const newCat = await dispatch(createCategory(payload)).unwrap();
      dispatch(fetchCategories());
      set('categories', [...form.categories, newCat.id]);
      setShowCategoryModal(false);
      setNewCatForm(DEFAULT_CATEGORY);
    } catch(err) {
      alert("Failed to create category: " + extractErrorMessage(err));
    } finally {
      setSavingCategory(false);
    }
  };

  const saveProduct = async (addAnother = false) => {
    setSaving(true);
    try {
      const payload = new FormData();

      // ── Whitelist: only send fields the backend serializer writes ──
      // Exclude read-only/computed: id, sku, images, category_details,
      // ingredient_details, created_date, update_date, stock_quantity,
      // best_seller, is_deleted, key_ingredients (handled via `ingredients` string)
      const WRITABLE = [
        'name', 'description', 'sub_description', 'price', 'discount_price',
        'is_active', 'is_vegetarian', 'is_preservation_free', 'best_seller',
        'net_weight', 'shelf_life_days', 'nutritional_information', 'taste',
      ];

      WRITABLE.forEach(key => {
        const val = form[key];
        if (key === 'is_active' || key === 'is_vegetarian' || key === 'is_preservation_free') {
          payload.append(key, val ? 'True' : 'False');
        } else if (val !== null && val !== undefined && val !== '') {
          payload.append(key, val);
        }
      });

      // Categories — array of integer PKs
      (form.categories || []).forEach(cid => payload.append('categories', cid));

      // Ingredients — comma-separated string
      if (form.ingredients !== null && form.ingredients !== undefined) {
        payload.append('ingredients', form.ingredients);
      }

      // Images — only if new File objects were selected
      if (form.highlight_image instanceof File) {
        payload.append('highlight_image', form.highlight_image);
      }
      if (form.uploaded_images && form.uploaded_images.length) {
        Array.from(form.uploaded_images).forEach(file => {
          payload.append('uploaded_images', file);
        });
      }

      if (isEdit) {
        await dispatch(updateProduct({ id: form.id, data: payload })).unwrap();
        dispatch(fetchProducts());
        if (addAnother) {
            navigate('/admin/product/add');
            // Setting state alone since it will navigate to the empty form page
        } else {
            navigate('/admin');
        }
      } else {
        await dispatch(createProduct(payload)).unwrap();
        dispatch(fetchProducts());
        if (addAnother) {
            setForm(EMPTY_PRODUCT);
            setHighlightPreview(null);
            setAdditionalPreviews([]);
            window.scrollTo(0,0);
        } else {
            navigate('/admin');
        }
      }
    } catch (err) {
      alert("Failed to save product: " + extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && productsLoading && products.length === 0) {
    return <div className="admin-root flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-orange-400" size={32} /></div>;
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="p-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-serif text-lg font-bold text-white">Back to Admin</span>
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="flex items-center gap-3 flex-1">
            <Package size={20} className="text-orange-400" />
            <h2 className="text-lg font-bold text-white capitalize">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          </div>
        </header>

        <div className="admin-content pb-20">
          <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-6">
            <form onSubmit={e => { e.preventDefault(); saveProduct(false); }} className="space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="admin-field"><span>Name *</span>
                    <input required className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} /></label>
                  <label className="admin-field"><span>Sub-description</span>
                    <input className="admin-input" value={form.sub_description} onChange={e => set('sub_description', e.target.value)} /></label>
                </div>
                <label className="admin-field"><span>Description *</span>
                  <textarea required className="admin-input min-h-[100px]" value={form.description} onChange={e => set('description', e.target.value)} /></label>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="admin-field"><span>Price *</span>
                    <input required className="admin-input" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} /></label>
                  <label className="admin-field"><span>Discount Price</span>
                    <input className="admin-input" type="number" step="0.01" value={form.discount_price} onChange={e => set('discount_price', e.target.value)} /></label>
                </div>
              </div>

              {/* Food specific */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-4">Food / Characteristics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="admin-field"><span>Taste Profile</span>
                    <select className="admin-input bg-[#13141a]" value={form.taste} onChange={e => set('taste', e.target.value)}>
                      {TASTE_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </label>
                  <label className="admin-field"><span>Shelf Life (days)</span>
                    <input className="admin-input" type="number" value={form.shelf_life_days} onChange={e => set('shelf_life_days', parseInt(e.target.value) || 0)} /></label>
                  <label className="admin-field"><span>Net Weight</span>
                    <input className="admin-input" value={form.net_weight} placeholder="e.g. 250g" onChange={e => set('net_weight', e.target.value)} /></label>
                </div>
                
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="admin-toggle"><input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} /><span>Active</span></label>
                  <label className="admin-toggle"><input type="checkbox" checked={form.is_vegetarian} onChange={e => set('is_vegetarian', e.target.checked)} /><span>Vegetarian</span></label>
                  <label className="admin-toggle"><input type="checkbox" checked={form.is_preservation_free} onChange={e => set('is_preservation_free', e.target.checked)} /><span>Preservative Free</span></label>
                  <label className="admin-toggle"><input type="checkbox" checked={form.best_seller ?? false} onChange={e => set('best_seller', e.target.checked)} /><span className="text-orange-400 font-semibold">⭐ Best Seller</span></label>
                </div>
              </div>

              {/* Ingredients Details */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-4">Ingredients & Nutrition</h3>
                 <label className="admin-field">
                   <span>Key Ingredients <span className="text-gray-500 normal-case font-normal">(comma-separated)</span></span>
                   <input
                     className="admin-input"
                     value={form.ingredients || ''}
                     placeholder="e.g. Garlic, Salt, Chilli, Lemon"
                     onChange={e => set('ingredients', e.target.value)}
                   />
                   {/* Live tag preview */}
                   {form.ingredients && (
                     <div className="flex flex-wrap gap-1.5 mt-2">
                       {form.ingredients.split(',').map(s => s.trim()).filter(Boolean).map((ing, i) => (
                         <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-300 border border-orange-500/20">
                           {ing}
                         </span>
                       ))}
                     </div>
                   )}
                 </label>
                 <label className="admin-field"><span>Nutritional Information</span>
                  <input className="admin-input" value={form.nutritional_information || ''} onChange={e => set('nutritional_information', e.target.value)} />
                 </label>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-4">Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="admin-field"><span>Highlight Image</span>
                    <input type="file" accept="image/*" className="admin-input cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 text-gray-400"
                      onChange={e => set('highlight_image', e.target.files[0])} /></label>
                  <label className="admin-field"><span>Additional Images (Max 3 total including highlight)</span>
                    <input type="file" accept="image/*" multiple className="admin-input cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 text-gray-400"
                      onChange={e => set('uploaded_images', e.target.files)} /></label>
                </div>

                {(highlightPreview || additionalPreviews.length > 0 || (isEdit && form.images && form.images.length > 0)) && (
                  <div className="admin-field"><span>Image Previews</span>
                    <div className="flex gap-3 overflow-x-auto pb-2 admin-scroll items-end">
                      {highlightPreview ? (
                        <div className="relative shrink-0 group">
                          <img src={highlightPreview} alt="preview" className="h-[72px] w-[72px] object-cover rounded-lg border border-orange-500/50" />
                          <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded shadow">New Highlight</span>
                        </div>
                      ) : isEdit && form.images?.find(i => i.is_highlight) ? (
                        <div className="relative shrink-0 group">
                          <img src={form.images.find(i => i.is_highlight).image} alt="existing" className="h-[72px] w-[72px] object-cover rounded-lg border border-white/10" />
                          <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold bg-gray-700 text-white px-1.5 py-0.5 rounded shadow">Current Highlight</span>
                        </div>
                      ) : null}

                      {additionalPreviews.length > 0 ? (
                        additionalPreviews.map((url, i) => (
                          <div key={url} className="relative shrink-0 group">
                            <img src={url} alt={`preview-${i}`} className="h-[72px] w-[72px] object-cover rounded-lg border border-white/30" />
                            <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold bg-white/20 text-white px-1.5 py-0.5 rounded shadow">New Image</span>
                          </div>
                        ))
                      ) : isEdit && form.images?.filter(i => !i.is_highlight)?.length > 0 ? (
                        form.images.filter(i => !i.is_highlight).map(img => (
                          <div key={img.id} className="relative shrink-0 group">
                            <img src={img.image} alt="existing" className="h-[72px] w-[72px] object-cover rounded-lg border border-white/10" />
                          </div>
                        ))
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {/* Taxonomy */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-4">Taxonomy</h3>
                 
                 <div className="admin-field">
                  <div className="flex items-center justify-between mb-1">
                    <span>Categories</span>
                    <button type="button" onClick={() => setShowCategoryModal(true)} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                      + Add New Category
                    </button>
                  </div>
                  <input className="admin-input mb-1 text-sm py-1.5" placeholder="Search categories..." value={categorySearch} onChange={e => setCategorySearch(e.target.value)} />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filteredCategoryOptions.map(cat => (
                      <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${form.categories.includes(cat.id)
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-8">
                <button type="button" onClick={() => navigate('/admin')} className="admin-btn admin-btn-ghost">Cancel</button>
                <button type="button" onClick={() => saveProduct(true)} className="admin-btn bg-white/5 text-white hover:bg-white/10 border border-white/10" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save & Add Another
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isEdit ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showCategoryModal && (
        <div className="admin-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag size={20} className="text-orange-400" />
                Add Category
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <label className="admin-field"><span>Category Name *</span>
                <input required className="admin-input" value={newCatForm.name} onChange={e => setNewCatForm({...newCatForm, name: e.target.value})} placeholder="e.g. Spicy Pickles" /></label>
              
              <div className="admin-field">
                  <span className="flex items-center justify-between">Icon Name
                    <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-[10px] text-orange-400 hover:underline">Find Icons ↗</a>
                  </span>
                  <div className="flex items-center gap-3">
                    <input className="admin-input flex-1" value={newCatForm.icon} onChange={e => setNewCatForm({...newCatForm, icon: e.target.value})} placeholder="e.g. Leaf, Flame, Pepper" />
                    {/* Live badge preview — icon colored with selected color */}
                    {(() => {
                      const hex = COLORS.find(c => c.value === (newCatForm.color || 'orange-500'))?.hex || '#f97316';
                      const IconEl = newCatForm.icon ? LucideIcons[toPascalCase(newCatForm.icon)] : null;
                      return (
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all"
                          style={{ backgroundColor: hex + '22', borderColor: hex + '55' }}
                          title={IconEl ? newCatForm.icon : 'Icon preview'}
                        >
                          {IconEl
                            ? <IconEl size={22} style={{ color: hex }} />
                            : <span className="text-[10px] text-gray-500 leading-none text-center px-1">{newCatForm.icon ? '?' : '—'}</span>
                          }
                        </div>
                      );
                    })()}
                  </div>
                  {newCatForm.icon && !LucideIcons[toPascalCase(newCatForm.icon)] && (
                    <p className="text-[11px] text-red-400 mt-1">Icon not found — check spelling at lucide.dev/icons</p>
                  )}
              </div>

              <div className="admin-field">
                <span>Color</span>
                <TailwindColorPicker value={newCatForm.color} onChange={val => setNewCatForm({...newCatForm, color: val})} />
              </div>

              <label className="admin-field"><span>Description</span>
                <textarea className="admin-input min-h-[60px]" value={newCatForm.description} onChange={e => setNewCatForm({...newCatForm, description: e.target.value})} placeholder="Our most firey category..." /></label>

              <label className="admin-toggle my-2">
                <input type="checkbox" checked={newCatForm.show_on_homepage} onChange={e => setNewCatForm({...newCatForm, show_on_homepage: e.target.checked})} />
                <span>Show on Homepage</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="admin-btn admin-btn-ghost" disabled={savingCategory}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingCategory}>
                  {savingCategory ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
