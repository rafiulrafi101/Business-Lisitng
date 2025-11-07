import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  name: '',
  category: '',
  city: '',
  area: '',
  shortDescription: '',
  description: '',
  phone: '',
  hours: '',
  imageUrl: '',
  isActive: true,
};

const ListingForm = ({
  initialValues = emptyForm,
  categories,
  locations,
  onSubmit,
  submitting = false,
  error,
  submitLabel = 'Save listing',
}) => {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });

  useEffect(() => {
    setForm({ ...emptyForm, ...initialValues });
  }, [initialValues]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.key || category.label,
        label: category.label,
      })),
    [categories],
  );

  const cities = useMemo(
    () => Array.from(new Set(locations.map((location) => location.city))).sort(),
    [locations],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      location: {
        city: form.city,
        area: form.area,
      },
    });
  };

  return (
    <form className="listing-form card" onSubmit={handleSubmit}>
      <div className="listing-form-grid">
        <label>
          Name
          <input
            className="input"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            minLength={3}
          />
        </label>
        <label>
          Category
          <select
            className="select"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          City
          <input
            className="input"
            name="city"
            list="city-options"
            value={form.city}
            onChange={handleChange}
            required
          />
          <datalist id="city-options">
            {cities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </label>
        <label>
          Area / Neighbourhood
          <input
            className="input"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
          />
        </label>
        <label className="listing-form-full">
          Short description
          <input
            className="input"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={160}
          />
        </label>
        <label className="listing-form-full">
          Detailed description
          <textarea
            className="textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={6}
          />
        </label>
        <label>
          Phone
          <input
            className="input"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Hours
          <input
            className="input"
            name="hours"
            value={form.hours}
            onChange={handleChange}
          />
        </label>
        <label>
          Image URL
          <input
            className="input"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </label>
        <label className="listing-form-checkbox">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active listing
        </label>
      </div>
      {error && <p className="listing-form-error">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
};

export default ListingForm;
