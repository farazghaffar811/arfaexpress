import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  BarChart3,
  LogOut,
  Fingerprint,
  UserCheck,
  TrendingUp,
  Activity,
  Eye,
  Edit,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/LaravelAdminContext";

const ManagerPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, employees, attendanceRecords, logout } = useAdmin();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!user || user.role !== 'manager') {
      navigate("/login");
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(record => record.date === today);
  const presentCount = todayAttendance.filter(record => record.status === 'present').length;
  const absentCount = employees.length - presentCount;
  const lateCount = todayAttendance.filter(record => record.status === 'late').length;

  const managerStats = [
    {
      title: "Team Members",
      value: employees.length.toString(),
      change: "+2 this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Present Today",
      value: presentCount.toString(),
      change: `${((presentCount/employees.length)*100).toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Late Arrivals",
      value: lateCount.toString(),
      change: "-2 from yesterday",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Pending Reviews",
      value: "3",
      change: "2 urgent",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const teamPerformance = [
    { name: "On-time Rate", value: "92%", trend: "+3%" },
    { name: "Productivity", value: "88%", trend: "+5%" },
    { name: "Team Satisfaction", value: "94%", trend: "+2%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Manager Portal
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Time</p>
                <p className="font-semibold">{currentTime.toLocaleTimeString()}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate("/employee-management")}>
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Team Management</h3>
              <p className="text-gray-600 text-sm">Manage team members and assignments</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate("/attendance")}>
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-lg w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Attendance Review</h3>
              <p className="text-gray-600 text-sm">Review and approve attendance records</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate("/reports")}>
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Team Reports</h3>
              <p className="text-gray-600 text-sm">View team performance analytics</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {managerStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <Badge variant="secondary" className="mt-1">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Performance & Team Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Team Performance</span>
              </CardTitle>
              <CardDescription>Key performance metrics for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamPerformance.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <p className="text-2xl font-bold text-green-600">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Overview</span>
              </CardTitle>
              <CardDescription>Current status of your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.slice(0, 5).map((employee) => {
                  const employeeAttendance = todayAttendance.find(record => record.employee_id === employee.id);
                  return (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={employeeAttendance ? 'default' : 'secondary'}>
                          {employeeAttendance ? 'Present' : 'Absent'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Team Activities</span>
            </CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceRecords.slice(-6).map((record, index) => {
                const employee = employees.find(emp => emp.id === record.employee_id);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        record.status === 'present' ? 'bg-green-500' :
                        record.status === 'late' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{employee?.name || 'Unknown Employee'}</p>
                        <p className="text-sm text-gray-600">
                          {record.check_out ? 'Checked out' : 'Checked in'} at {record.check_out || record.check_in || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={record.status === 'present' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerPortal;