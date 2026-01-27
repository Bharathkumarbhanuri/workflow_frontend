import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import App from '../App.jsx'
import RunsList from '../pages/Runs/RunsList.jsx';
import WorkflowsList from '../pages/Workflows/WorkflowsList.jsx';
import NotFound from '../pages/NotFound.jsx';
import WorkflowCreate from '../pages/Workflows/WorkflowCreate.jsx';
import RunDetail from '../pages/Runs/RunDetail.jsx';
import Login from "../pages/Auth/Login.jsx";
import RequireAuth from "./RequireAuth.jsx";
import Signup from '../pages/Auth/Signup.jsx';
import EmailsList from '../pages/Emails/EmailsList.jsx';
import NotificationsList from "../pages/Notifications/NotificationsList.jsx";

function HomeRedirect() {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? "/workflows" : "/login"} replace />;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>

      <Route index element={<HomeRedirect/>} />

      {/* public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Signup />} />

      {/* protected routes */}
      <Route path="workflows" element={<RequireAuth><WorkflowsList /></RequireAuth>} />
      <Route path="workflows/new" element={<RequireAuth><WorkflowCreate /></RequireAuth>} />
      <Route path="workflows/:id/edit" element={<RequireAuth><WorkflowCreate /></RequireAuth>} />
      <Route path="runs" element={<RequireAuth><RunsList /></RequireAuth>} />
      <Route path="runs/:id" element={<RequireAuth><RunDetail /></RequireAuth>} />
      <Route path="emails" element={<RequireAuth><EmailsList /></RequireAuth>} />
      <Route path="notifications" element={<RequireAuth><NotificationsList /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
