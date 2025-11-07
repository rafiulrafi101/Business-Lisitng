import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm.jsx';
import { useMeta } from '../state/MetaContext.jsx';
import * as api from '../lib/api';

const NewListing = () => {
  const navigate = useNavigate();
  const { categories, locations } = useMeta();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      const data = await api.post('/listings', payload);
      navigate(`/listings/${data.listing.id}`);
    } catch (err) {
      setError(err.message || 'Unable to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container listing-editor">
      <div className="listing-editor-header">
        <h1>New listing</h1>
        <p>Share details about your business to help locals find you.</p>
      </div>
      <ListingForm
        categories={categories}
        locations={locations}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
        submitLabel="Create listing"
      />
    </section>
  );
};

export default NewListing;
