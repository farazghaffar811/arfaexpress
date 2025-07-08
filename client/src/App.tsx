import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/LaravelAdminContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ManagerPortal from "./pages/ManagerPortal";
import EmployeePortal from "./pages/EmployeePortal";
import AttendancePage from "./pages/AttendancePage";
import EmployeeRegistration from "./pages/EmployeeRegistration";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import EmployeeManagement from "./pages/EmployeeManagement";
import Settings from "./pages/Settings";
import UsersManagement from "./pages/UsersManagement";
import ShiftsManagement from "./pages/ShiftsManagement";
import SalaryManagement from "./pages/SalaryManagement";
import PayrollManagement from "./pages/PayrollManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manager-portal" element={<ManagerPortal />} />
            <Route path="/employee-portal" element={<EmployeePortal />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/employee-registration" element={<EmployeeRegistration />} />
            <Route path="/employee-management" element={<EmployeeManagement />} />
            <Route path="/users-management" element={<UsersManagement />} />
            <Route path="/shifts-management" element={<ShiftsManagement />} />
            <Route path="/salary-management" element={<SalaryManagement />} />
            <Route path="/payroll-management" element={<PayrollManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;