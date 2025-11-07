import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Home from '../pages/Home.jsx';
import Listings from '../pages/Listings.jsx';
import ListingDetail from '../pages/ListingDetail.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Profile from '../pages/Profile.jsx';
import Bookmarks from '../pages/Bookmarks.jsx';
import NewListing from '../pages/NewListing.jsx';
import EditListing from '../pages/EditListing.jsx';
import NotFound from '../pages/NotFound.jsx';
import { AuthProvider } from '../state/AuthContext.jsx';
import { MetaProvider } from '../state/MetaContext.jsx';

const App = () => (
  <AuthProvider>
    <MetaProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="listings" element={<Listings />} />
            <Route path="listings/:id" element={<ListingDetail />} />
            <Route
              path="listings/new"
              element={
                <ProtectedRoute>
                  <NewListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="listings/:id/edit"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MetaProvider>
  </AuthProvider>
);

export default App;
