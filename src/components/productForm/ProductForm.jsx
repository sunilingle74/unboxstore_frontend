import { useState } from "react";
import { api } from "../../lib/api";
import "./ProductForm.css";


const initialForm = {
  name: "",
  slug: "",
  sku: "",
  category: "",
  collection: "",
  shortDescription: "",
  description: "",
  details: "",
  price: "",
  costPrice: "",
  originalPrice: "",
  discountType: "None",
  discountValue: 0,
  images: "",
  sizes: "",
  colors: "",
  material: "",
  gender: "Unisex",
  weightKg: "",
  length: "",
  width: "",
  height: "",
  stockCount: 0,
  lowStockThreshold: 5,
  isActive: true,
  isFeatured: false,
  isNewArrival: false,
  metaTitle: "",
  metaDescription: "",
  tags: "",
};

const toArray = (value) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

const ProductForm = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Generate a slug from the product name automatically.
    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!form.name.trim() || !form.slug.trim()) {
        throw new Error("Product name and slug are required.");
      }

      if (!form.category.trim()) {
        throw new Error("Please enter a valid Category ID.");
      }

      if (form.price === "" || Number(form.price) < 0) {
        throw new Error("Please enter a valid product price.");
      }

      const colors = form.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
          const [name, hex] = item.split(":").map((v) => v.trim());
          return { name, hex: hex || "" };
        });

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        ...(form.sku.trim() && { sku: form.sku.trim() }),
        category: form.category.trim(),
        ...(form.collection.trim() && {
          collection: form.collection.trim(),
        }),
        shortDescription: form.shortDescription,
        description: form.description,
        details: toArray(form.details),
        price: Number(form.price),
        ...(form.costPrice !== "" && {
          costPrice: Number(form.costPrice),
        }),
        ...(form.originalPrice !== "" && {
          originalPrice: Number(form.originalPrice),
        }),
        discountType: form.discountType,
        discountValue: Number(form.discountValue || 0),
        images: form.images
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean)
          .map((url) => ({ url })),
        sizes: toArray(form.sizes),
        colors,
        material: form.material,
        gender: form.gender,
        ...(form.weightKg !== "" && {
          weightKg: Number(form.weightKg),
        }),
        dimensions: {
          ...(form.length !== "" && { length: Number(form.length) }),
          ...(form.width !== "" && { width: Number(form.width) }),
          ...(form.height !== "" && { height: Number(form.height) }),
        },
        stockCount: Number(form.stockCount || 0),
        lowStockThreshold: Number(form.lowStockThreshold || 0),
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        seo: {
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          tags: toArray(form.tags),
        },
      };

      const response = await api.post("/products", payload);

      setMessage(response.data.message || "Product created successfully!");
      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  const input = (name, label, type = "text", required = false) => (
    <label className="product-field" key={name}>
      <span>
        {label} {required && <b>*</b>}
      </span>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "any" : undefined}
      />
    </label>
  );

  const textarea = (name, label, placeholder = "") => (
    <label className="product-field product-field-full" key={name}>
      <span>{label}</span>
      <textarea
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        rows={3}
      />
    </label>
  );

  const toggle = (name, label) => (
    <label className="product-toggle" key={name}>
      <input
        type="checkbox"
        name={name}
        checked={form[name]}
        onChange={handleChange}
      />
      <span>{label}</span>
    </label>
  );

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form-header">
        <div>
          <h2>Add New Product</h2>
          <p>Enter product information to add it to your store.</p>
        </div>
        <span className="required-note">* Required fields</span>
      </div>

      {message && <div className="form-success">{message}</div>}
      {error && <div className="form-error">{error}</div>}

      {/* Basic information */}
      <section className="product-section">
        <h3>01. Basic Information</h3>
        <div className="product-grid">
          {input("name", "Product Name", "text", true)}
          {input("slug", "Product Slug", "text", true)}
          {input("sku", "SKU")}
          {input("material", "Material")}

          {textarea(
            "shortDescription",
            "Short Description",
            "A short summary of the product"
          )}
          {textarea("description", "Full Description")}
          {textarea(
            "details",
            "Product Details",
            "100% cotton, Machine washable, Regular fit"
          )}
        </div>
        <p className="product-hint">
          Separate product details with commas.
        </p>
      </section>

      {/* Category */}
      <section className="product-section">
        <h3>02. Category & Collection</h3>
        <div className="product-grid">
          {input("category", "Category MongoDB ID", "text", true)}
          {input("collection", "Collection MongoDB ID")}
          <label className="product-field">
            <span>Gender</span>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
              <option value="Kids">Kids</option>
            </select>
          </label>
        </div>
        <p className="product-hint">
          These fields expect MongoDB ObjectIds, not category names.
        </p>
      </section>

      {/* Pricing */}
      <section className="product-section">
        <h3>03. Pricing & Discounts</h3>
        <div className="product-grid">
          {input("price", "Selling Price (₹)", "number", true)}
          {input("costPrice", "Cost Price (₹)", "number")}
          {input("originalPrice", "Original Price (₹)", "number")}
          {input("discountValue", "Discount Value", "number")}

          <label className="product-field">
            <span>Discount Type</span>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
            >
              <option value="None">None</option>
              <option value="Percent">Percentage</option>
              <option value="Flat">Flat Amount</option>
            </select>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="product-section">
        <h3>04. Product Images</h3>
        {textarea(
          "images",
          "Image URLs",
          "https://example.com/front.jpg\nhttps://example.com/back.jpg"
        )}
        <p className="product-hint">
          Enter one image URL per line. Each URL is saved as an object with a
          url property. This form does not upload image files.
        </p>
      </section>

      {/* Variants */}
      <section className="product-section">
        <h3>05. Sizes & Colors</h3>
        <div className="product-grid">
          {input("sizes", "Sizes (comma-separated)")}
          {input("colors", "Colors (comma-separated)")}
        </div>
        <p className="product-hint">
          Sizes: S, M, L, XL. Colors: Black:#000000, White:#FFFFFF.
        </p>
      </section>

      {/* Dimensions */}
      <section className="product-section">
        <h3>06. Shipping & Dimensions</h3>
        <div className="product-grid">
          {input("weightKg", "Weight (kg)", "number")}
          {input("length", "Length", "number")}
          {input("width", "Width", "number")}
          {input("height", "Height", "number")}
        </div>
      </section>

      {/* Inventory */}
      <section className="product-section">
        <h3>07. Inventory</h3>
        <div className="product-grid">
          {input("stockCount", "Available Stock", "number")}
          {input("lowStockThreshold", "Low Stock Alert Threshold", "number")}
        </div>
      </section>

      {/* Status */}
      <section className="product-section">
        <h3>08. Product Visibility</h3>
        <div className="product-toggles">
          {toggle("isActive", "Active")}
          {toggle("isFeatured", "Featured Product")}
          {toggle("isNewArrival", "New Arrival")}
        </div>
      </section>

      {/* SEO */}
      <section className="product-section">
        <h3>09. SEO Settings</h3>
        <div className="product-grid">
          {input("metaTitle", "Meta Title")}
          {input("tags", "SEO Tags (comma-separated)")}
          {textarea("metaDescription", "Meta Description")}
        </div>
      </section>

      <div className="product-form-footer">
        <button
          type="button"
          className="product-reset-btn"
          onClick={() => {
            setForm(initialForm);
            setMessage("");
            setError("");
          }}
          disabled={loading}
        >
          Reset
        </button>

        <button type="submit" className="product-submit-btn" disabled={loading}>
          {loading ? "Creating Product..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;