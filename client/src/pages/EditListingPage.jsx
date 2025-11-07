import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListingForm from '../components/ListingForm.jsx';
import { api } from '../lib/api.js';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/listings/${id}`)
      .then((data) => {
        setInitialValues({
          ...data,
          city: data.location.city,
          area: data.location.area,
        });
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (formValues) => {
    setSubmitting(true);
    const { city, area, id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = formValues;
    const payload = {
      ...rest,
      location: { city, area },
    };

    try {
      const listing = await api.put(`/listings/${id}`, payload);
      navigate(`/listings/${listing.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
        Loading listing…
      </div>
    );
  }

  if (error || !initialValues) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {error || 'Listing not found.'}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit listing</h1>
        <p className="mt-1 text-sm text-slate-600">Update business details and save your changes.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ListingForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          submitLabel="Save changes"
        />
      </div>
    </section>
  );
};

export default EditListingPage;
