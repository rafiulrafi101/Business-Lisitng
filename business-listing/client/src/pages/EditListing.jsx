import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListingForm from '../components/ListingForm.jsx';
import { useMeta } from '../state/MetaContext.jsx';
import * as api from '../lib/api';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, locations } = useMeta();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/listings/${id}`);
        if (!cancelled) {
          const listing = data.listing;
          setInitialValues({
            name: listing.name,
            category: listing.category,
            city: listing.location?.city || '',
            area: listing.location?.area || '',
            shortDescription: listing.shortDescription,
            description: listing.description,
            phone: listing.phone || '',
            hours: listing.hours || '',
            imageUrl: listing.imageUrl || '',
            isActive: listing.isActive,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load listing');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchListing();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      const { location, ...rest } = values;
      const payload = {
        ...rest,
        location,
      };
      delete payload.city;
      delete payload.area;
      await api.put(`/listings/${id}`, payload);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.message || 'Unable to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="container listing-editor">
        <div className="listings-status">Loading listing...</div>
      </section>
    );
  }

  if (error && !initialValues) {
    return (
      <section className="container listing-editor">
        <div className="listings-status listings-status--error">{error}</div>
      </section>
    );
  }

  return (
    <section className="container listing-editor">
      <div className="listing-editor-header">
        <h1>Edit listing</h1>
        <p>Update business details and keep information fresh.</p>
      </div>
      {initialValues && (
        <ListingForm
          initialValues={initialValues}
          categories={categories}
          locations={locations}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          submitLabel="Save changes"
        />
      )}
    </section>
  );
};

export default EditListing;
