import { Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from '../pages/HomePage.jsx';
import ListingsPage from '../pages/ListingsPage.jsx';
import ListingDetailPage from '../pages/ListingDetailPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import BookmarksPage from '../pages/BookmarksPage.jsx';
import NewListingPage from '../pages/NewListingPage.jsx';
import EditListingPage from '../pages/EditListingPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import AdminStatsPage from '../pages/AdminStatsPage.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="listings">
        <Route index element={<ListingsPage />} />
        <Route path=":id" element={<ListingDetailPage />} />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <EditListingPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="bookmarks"
        element={
          <ProtectedRoute>
            <BookmarksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/stats"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminStatsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="new-listing"
        element={
          <ProtectedRoute>
            <NewListingPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
