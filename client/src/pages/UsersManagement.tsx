import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  LogOut,
  UserCheck,
  UserX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/LaravelAdminContext";

interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'hr' | 'employee' | 'manager';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile: {
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    date_of_birth: string;
    hire_date: string;
    department: string;
    position: string;
    employee_id: string;
    emergency_contact: string;
  };
}

const UsersManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Authentication guard
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Mock data - in real app this would come from API
  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'johndoe',
      email: 'john.doe@afraexpress.com',
      password_hash: 'hashed_password',
      role: 'employee',
      is_active: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z',
      profile: {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1-555-0123',
        address: '123 Main St, City, State',
        date_of_birth: '1990-05-15',
        hire_date: '2023-01-15',
        department: 'Engineering',
        position: 'Senior Developer',
        employee_id: 'EMP001',
        emergency_contact: '+1-555-0124'
      }
    },
    {
      id: '2',
      username: 'sarahsmith',
      email: 'sarah.smith@afraexpress.com',
      password_hash: 'hashed_password',
      role: 'hr',
      is_active: true,
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-10T08:00:00Z',
      profile: {
        first_name: 'Sarah',
        last_name: 'Smith',
        phone: '+1-555-0125',
        address: '456 Oak Ave, City, State',
        date_of_birth: '1988-03-20',
        hire_date: '2022-11-20',
        department: 'HR',
        position: 'HR Manager',
        employee_id: 'EMP002',
        emergency_contact: '+1-555-0126'
      }
    },
    {
      id: '3',
      username: 'admin',
      email: 'admin@afraexpress.com',
      password_hash: 'hashed_password',
      role: 'admin',
      is_active: true,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z',
      profile: {
        first_name: 'System',
        last_name: 'Administrator',
        phone: '+1-555-0100',
        address: 'Admin Office',
        date_of_birth: '1985-01-01',
        hire_date: '2022-01-01',
        department: 'IT',
        position: 'System Administrator',
        employee_id: 'ADM001',
        emergency_contact: '+1-555-0101'
      }
    }
  ]);

  if (!user) {
    return null;
  }

  const roles = ["all", "admin", "hr", "employee", "manager"];
  const statuses = ["all", "active", "inactive"];
  
  const filteredUsers = users.filter(userItem => {
    const matchesSearch = 
      userItem.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.profile.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || userItem.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && userItem.is_active) ||
      (filterStatus === "inactive" && !userItem.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      toast({
        title: "User Deleted",
        description: `${name} has been removed from the system`
      });
    }
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (window.confirm(`Are you sure you want to ${action} ${name}?`)) {
      toast({
        title: `User ${currentStatus ? 'Deactivated' : 'Activated'}`,
        description: `${name} has been ${currentStatus ? 'deactivated' : 'activated'}`
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
    navigate("/login");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Users Management
                </h1>
                <p className="text-sm text-gray-600">Manage system users and access</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <Button 
              onClick={() => navigate("/employee-registration")}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.is_active).length}
                  </p>
                </div>
                <UserCheck className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-3xl font-bold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="h-12 w-12 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {users.filter(u => !u.is_active).length}
                  </p>
                </div>
                <UserX className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>System Users</span>
            </CardTitle>
            <CardDescription>
              Showing {filteredUsers.length} of {users.length} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {userItem.profile.first_name[0]}{userItem.profile.last_name[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{userItem.profile.first_name} {userItem.profile.last_name}</p>
                            <p className="text-sm text-gray-500">{userItem.profile.employee_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{userItem.email}</p>
                          <p className="text-sm text-gray-500">{userItem.profile.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(userItem.role)}>
                          {userItem.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{userItem.profile.department}</p>
                          <p className="text-sm text-gray-500">{userItem.profile.position}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={userItem.is_active ? 'default' : 'secondary'}>
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(userItem.profile.hire_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(
                              userItem.id, 
                              `${userItem.profile.first_name} ${userItem.profile.last_name}`,
                              userItem.is_active
                            )}
                            className={userItem.is_active ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                          >
                            {userItem.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(
                              userItem.id, 
                              `${userItem.profile.first_name} ${userItem.profile.last_name}`
                            )}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersManagement;