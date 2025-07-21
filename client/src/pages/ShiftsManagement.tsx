import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Clock, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  Calendar,
  Users,
  Timer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/LaravelAdminContext";

interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  days_of_week: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  assigned_users: number;
}

const ShiftsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Authentication guard
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Mock data - in real app this would come from API
  const [shifts] = useState<Shift[]>([
    {
      id: '1',
      name: 'Morning Shift',
      start_time: '09:00',
      end_time: '17:00',
      break_duration: 60,
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      is_active: true,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z',
      assigned_users: 15
    },
    {
      id: '2',
      name: 'Evening Shift',
      start_time: '17:00',
      end_time: '01:00',
      break_duration: 45,
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      is_active: true,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z',
      assigned_users: 8
    },
    {
      id: '3',
      name: 'Night Shift',
      start_time: '01:00',
      end_time: '09:00',
      break_duration: 60,
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      is_active: true,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z',
      assigned_users: 5
    },
    {
      id: '4',
      name: 'Weekend Shift',
      start_time: '10:00',
      end_time: '18:00',
      break_duration: 60,
      days_of_week: ['Saturday', 'Sunday'],
      is_active: false,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z',
      assigned_users: 3
    }
  ]);

  if (!user) {
    return null;
  }

  const statuses = ["all", "active", "inactive"];
  
  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = 
      shift.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && shift.is_active) ||
      (filterStatus === "inactive" && !shift.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteShift = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      toast({
        title: "Shift Deleted",
        description: `${name} has been removed from the system`
      });
    }
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (window.confirm(`Are you sure you want to ${action} ${name}?`)) {
      toast({
        title: `Shift ${currentStatus ? 'Deactivated' : 'Activated'}`,
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

  const calculateShiftDuration = (startTime: string, endTime: string, breakDuration: number) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    let end = new Date(`2000-01-01 ${endTime}`);
    
    // Handle overnight shifts
    if (end <= start) {
      end = new Date(`2000-01-02 ${endTime}`);
    }
    
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const workingHours = diffInHours - (breakDuration / 60);
    
    return workingHours.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Shifts Management
                </h1>
                <p className="text-sm text-gray-600">Manage work shifts and schedules</p>
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
                placeholder="Search shifts by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
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
              onClick={() => toast({ title: "Feature Coming Soon", description: "Shift creation form will be available soon" })}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Shift
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                  <p className="text-3xl font-bold">{shifts.length}</p>
                </div>
                <Clock className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shifts</p>
                  <p className="text-3xl font-bold text-green-600">
                    {shifts.filter(s => s.is_active).length}
                  </p>
                </div>
                <Timer className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned Users</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {shifts.reduce((total, shift) => total + shift.assigned_users, 0)}
                  </p>
                </div>
                <Users className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Week Days</p>
                  <p className="text-3xl font-bold text-orange-600">7</p>
                </div>
                <Calendar className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shifts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Work Shifts</span>
            </CardTitle>
            <CardDescription>
              Showing {filteredShifts.length} of {shifts.length} shifts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shift Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Working Hours</TableHead>  
                    <TableHead>Break Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold">{shift.name}</p>
                            <p className="text-sm text-gray-500">Shift #{shift.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{shift.start_time} - {shift.end_time}</p>
                          <p className="text-sm text-gray-500">
                            {shift.start_time > shift.end_time ? 'Overnight Shift' : 'Regular Shift'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{calculateShiftDuration(shift.start_time, shift.end_time, shift.break_duration)} hours</p>
                          <p className="text-sm text-gray-500">Working time</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{shift.break_duration} min</p>
                          <p className="text-sm text-gray-500">Break time</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {shift.days_of_week.slice(0, 2).map(day => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day.slice(0, 3)}
                            </Badge>
                          ))}
                          {shift.days_of_week.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{shift.days_of_week.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium text-lg">{shift.assigned_users}</p>
                          <p className="text-sm text-gray-500">employees</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={shift.is_active ? 'default' : 'secondary'}>
                          {shift.is_active ? 'Active' : 'Inactive'}
                        </Badge>
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
                              shift.id, 
                              shift.name,
                              shift.is_active
                            )}
                            className={shift.is_active ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                          >
                            <Timer className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteShift(shift.id, shift.name)}
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

export default ShiftsManagement;