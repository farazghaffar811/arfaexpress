import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  LogOut,
  Fingerprint,
  User,
  Activity,
  Timer,
  Coffee,
  MapPin,
  Bell,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/LaravelAdminContext";

const EmployeePortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, employees, attendanceRecords, markAttendance, logout } = useAdmin();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'employee') {
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

  const handleAttendance = async (type: 'check-in' | 'check-out') => {
    if (!user?.id) return;
    
    setIsCheckingIn(true);
    try {
      const success = await markAttendance(user.id, type);
      if (success) {
        toast({
          title: `${type === 'check-in' ? 'Checked In' : 'Checked Out'}`,
          description: `Successfully ${type === 'check-in' ? 'checked in' : 'checked out'} at ${currentTime.toLocaleTimeString()}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];
  const myAttendance = attendanceRecords.filter(record => 
    record.employee_id === user.id && record.date === today
  );
  const todayRecord = myAttendance[0];
  
  const myStats = [
    {
      title: "Hours Today",
      value: todayRecord?.check_out && todayRecord?.check_in ? 
        Math.round(((new Date(`${today} ${todayRecord.check_out}`).getTime() - 
        new Date(`${today} ${todayRecord.check_in}`).getTime()) / (1000 * 60 * 60)) * 10) / 10 + "h" : "0h",
      icon: Timer,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "This Week",
      value: "38.5h",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Status",
      value: todayRecord ? "Present" : "Absent",
      icon: todayRecord ? CheckCircle : XCircle,
      color: todayRecord ? "text-green-600" : "text-red-600",
      bgColor: todayRecord ? "bg-green-50" : "bg-red-50"
    },
    {
      title: "Break Time",
      value: "45min",
      icon: Coffee,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentActivity = attendanceRecords
    .filter(record => record.employee_id === user.id)
    .slice(-5)
    .map(record => ({
      date: record.date,
      checkIn: record.check_in,
      checkOut: record.check_out,
      status: record.status,
      hours: record.check_out && record.check_in ? 
        Math.round(((new Date(`${record.date} ${record.check_out}`).getTime() - 
        new Date(`${record.date} ${record.check_in}`).getTime()) / (1000 * 60 * 60)) * 10) / 10 : 0
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Employee Portal
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}!</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Check In/Out Card */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Fingerprint className="h-6 w-6 text-purple-600" />
                <span>Attendance</span>
              </CardTitle>
              <CardDescription>Mark your attendance for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Check-in Time</p>
                  <p className="text-lg font-semibold">{todayRecord?.check_in || "Not checked in"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out Time</p>
                  <p className="text-lg font-semibold">{todayRecord?.check_out || "Not checked out"}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => handleAttendance('check-in')}
                  disabled={isCheckingIn || Boolean(todayRecord?.check_in)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Check In
                </Button>
                <Button 
                  onClick={() => handleAttendance('check-out')}
                  disabled={isCheckingIn || !todayRecord?.check_in || Boolean(todayRecord?.check_out)}
                  variant="outline"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Check Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                <span>Today's Summary</span>
              </CardTitle>
              <CardDescription>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={todayRecord ? "default" : "secondary"}>
                    {todayRecord ? "Present" : "Absent"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Working Hours</span>
                  <span className="font-semibold">{myStats[0].value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">Main Office</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {myStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Attendance</span>
            </CardTitle>
            <CardDescription>Your attendance history for the past few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${
                      activity.status === 'present' ? 'bg-green-500' :
                      activity.status === 'late' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{new Date(activity.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">
                        {activity.checkIn ? `In: ${activity.checkIn}` : 'No check-in'} 
                        {activity.checkOut ? ` | Out: ${activity.checkOut}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === 'present' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{activity.hours}h</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Notifications</h3>
              <p className="text-gray-600 text-sm">View important updates and announcements</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Schedule</h3>
              <p className="text-gray-600 text-sm">View your work schedule and shifts</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Profile</h3>
              <p className="text-gray-600 text-sm">Update your personal information</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;