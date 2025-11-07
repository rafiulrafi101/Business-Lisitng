import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm.jsx';
import { api } from '../lib/api.js';

const NewListingPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formValues) => {
    setSubmitting(true);
    const { city, area, ...rest } = formValues;
    const payload = {
      ...rest,
      location: { city, area },
    };

    try {
      const listing = await api.post('/listings', payload);
      navigate(`/listings/${listing.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Add a new business</h1>
        <p className="mt-1 text-sm text-slate-600">
          Share details about your business so locals can easily find and contact you.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ListingForm onSubmit={handleSubmit} isSubmitting={submitting} submitLabel="Create listing" />
      </div>
    </section>
  );
};

export default NewListingPage;
