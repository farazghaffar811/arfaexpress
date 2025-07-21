import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/LaravelAdminContext";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";

const AttendanceWidget = () => {
  const { employees, attendanceRecords, markAttendance } = useAdmin();
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(record => record.date === today);
  
  const getEmployeeStatus = (employeeId: string) => {
    const record = todayAttendance.find(r => r.employee_id === employeeId);
    if (!record) return 'absent';
    if (record.check_out) return 'completed';
    if (record.check_in) return 'present';
    return 'absent';
  };

  const handleQuickCheckIn = (employeeId: string) => {
    markAttendance(employeeId, 'check-in');
  };

  const handleQuickCheckOut = (employeeId: string) => {
    markAttendance(employeeId, 'check-out');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Quick Attendance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {employees.slice(0, 5).map((employee) => {
            const status = getEmployeeStatus(employee.id);
            return (
              <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{employee.name}</p>
                    <p className="text-xs text-gray-600">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {status === 'absent' && (
                    <>
                      <Badge variant="destructive" className="text-xs">
                        <XCircle className="h-3 w-3 mr-1" />
                        Absent
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => handleQuickCheckIn(employee.id)}
                        className="h-8 text-xs"
                      >
                        Check In
                      </Button>
                    </>
                  )}
                  {status === 'present' && (
                    <>
                      <Badge className="bg-yellow-500 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Present
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickCheckOut(employee.id)}
                        className="h-8 text-xs"
                      >
                        Check Out
                      </Button>
                    </>
                  )}
                  {status === 'completed' && (
                    <Badge className="bg-green-500 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceWidget;