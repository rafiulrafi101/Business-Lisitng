import { useEffect, useMemo, useState } from 'react';
import { useMeta } from '../state/MetaContext.jsx';

const initialFormState = {
  name: '',
  category: '',
  city: '',
  area: '',
  shortDescription: '',
  description: '',
  phone: '',
  hours: '',
  imageUrl: '',
};

const ListingForm = ({ initialValues = {}, onSubmit, isSubmitting = false, submitLabel }) => {
  const { categories, locations } = useMeta();
  const [form, setForm] = useState({ ...initialFormState, ...initialValues });
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const cityOptions = useMemo(() => [...new Set(locations.map((loc) => loc.city))], [locations]);

  const areaOptions = useMemo(
    () =>
      locations
        .filter((loc) => !form.city || loc.city === form.city)
        .map((loc) => loc.area)
        .filter((value, index, arr) => arr.indexOf(value) === index),
    [locations, form.city],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'city' ? { area: '' } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Business name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.label}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-sm font-medium text-slate-700">
            City
          </label>
          <select
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select city</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="area" className="text-sm font-medium text-slate-700">
            Area
          </label>
          <select
            id="area"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            disabled={!form.city}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Select area</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="hours" className="text-sm font-medium text-slate-700">
            Hours
          </label>
          <input
            id="hours"
            name="hours"
            value={form.hours}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1">
          <label htmlFor="imageUrl" className="text-sm font-medium text-slate-700">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1">
          <label htmlFor="shortDescription" className="text-sm font-medium text-slate-700">
            Short description
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            required
            rows={2}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-slate-700">
            Full description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {submitLabel || 'Save listing'}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;
