import React from 'react';
import { ROUTE__HOME, ROUTE__FORGOT_PASSWORD, ROUTE__RESET_PASSWORD } from './routes';
import Footer from '@app/components/ui/footer';
import Navbar from '@app/components/ui/navbar';
import About from '@app/pages/about';
import AssociationDetails from '@app/pages/associationdetails';
import EventDetails from '@app/pages/eventdetails';
import Events from '@app/pages/events';
import FavoriteEvents from '@app/pages/favoriteevents';
import ForgotPasswordPage from '@app/pages/forgotpassword';
import HomePage from '@app/pages/home';
import LoginPage from '@app/pages/login';
import MyEvents from '@app/pages/myevents';
import NotFoundPage from '@app/pages/notfound';
import Profile from '@app/pages/profile';
import ResetPasswordPage from '@app/pages/resetpassword';
import { registerNavigate } from '@app/store';
import { useNavigate, useLocation, Routes, Route, BrowserRouter } from 'react-router-dom';
import Associations from '@app/pages/associations';
import Register from '@app/pages/register';
import Contact from '@app/pages/contact';
import Settings from '@app/pages/settings';
import CreateEvent from '@app/pages/createevent';
import EditEvent from '@app/pages/edit-event/EditEvent';
import ProtectedRoutes from './ProtectedRoutes';
import { Roles } from '@app/types/user/Role';

import AssociationDashboard from '@app/pages/association-dashboard';
import AssociationEvents from '@app/pages/association-events';
import AssociationAnnouncements from '@app/pages/association-announcements';
import AssociationFollows from '@app/pages/association-follows';
import AssociationSettings from '@app/pages/association-settings';
import FollowedAssociations from '@app/pages/followed-associations';
import Announcements from '@app/pages/announcements';
import MessagesPage from '@app/pages/messages';

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  registerNavigate(navigate, location);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Conditional Home Route - Redirects to appropriate page based on auth status and role */}
          <Route path={ROUTE__HOME} element={<HomePage />} />

          {/* Public Routes - Accessible to everyone */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetails />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/associations" element={<Associations />} />
          <Route path="/associations/:identifier" element={<AssociationDetails />} />

          {/* Authentication Routes - Only for non-authenticated users */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path={ROUTE__FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTE__RESET_PASSWORD} element={<ResetPasswordPage />} />

          {/* Protected Routes for Authenticated Users */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>

          {/* Student-Only Routes */}
          <Route element={<ProtectedRoutes allowedRoles={[Roles.STUDENT]} />}>
            <Route path="/favorites" element={<FavoriteEvents />} />
            <Route path="/my-registrations" element={<MyEvents />} />
            <Route path="/followed-associations" element={<FollowedAssociations />} />
          </Route>

          {/* Association-Only Routes */}
          <Route element={<ProtectedRoutes allowedRoles={[Roles.ASSOCIATION]} />}>
            <Route path="/association/create-event" element={<CreateEvent />} />
            <Route path="/association/events/:eventId/edit" element={<EditEvent />} />
            <Route path="/association/dashboard" element={<AssociationDashboard />} />
            <Route path="/association/events" element={<AssociationEvents />} />
            <Route path="/association/announcements" element={<AssociationAnnouncements />} />
            <Route path="/association/follows" element={<AssociationFollows />} />
            <Route path="/association/settings" element={<AssociationSettings />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;
