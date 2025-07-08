import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Fingerprint, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Search
} from "lucide-react";

const AttendancePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employeeId, setEmployeeId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFingerPrintScan = () => {
    setIsScanning(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Attendance Marked",
        description: "Fingerprint verified successfully. Welcome John Doe!",
      });
      
      // Add to attendance log
      const newRecord = {
        id: Date.now(),
        employeeName: "John Doe",
        employeeId: "EMP001",
        time: currentTime.toLocaleTimeString(),
        date: currentTime.toLocaleDateString(),
        type: "Check In",
        method: "Fingerprint"
      };
      
      const existingRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
      localStorage.setItem("attendanceRecords", JSON.stringify([newRecord, ...existingRecords]));
    }, 3000);
  };

  const handleManualEntry = () => {
    if (!employeeId.trim()) {
      toast({
        title: "Error",
        description: "Please enter Employee ID",
        variant: "destructive"
      });
      return;
    }

    const newRecord = {
      id: Date.now(),
      employeeName: "Unknown Employee",
      employeeId: employeeId,
      time: currentTime.toLocaleTimeString(),
      date: currentTime.toLocaleDateString(),
      type: "Check In",
      method: "Manual"
    };

    const existingRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
    localStorage.setItem("attendanceRecords", JSON.stringify([newRecord, ...existingRecords]));

    toast({
      title: "Attendance Marked",
      description: `Manual attendance recorded for ${employeeId}`,
    });

    setEmployeeId("");
  };

  const todayRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
    .filter((record: any) => record.date === currentTime.toLocaleDateString())
    .filter((record: any) => 
      searchQuery === "" || 
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold">Attendance System</h1>
                <p className="text-sm text-gray-600">{currentTime.toLocaleString()}</p>
              </div>
            </div>
            <Button onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Marking Section */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Fingerprint className="h-5 w-5" />
                  <span>Biometric Attendance</span>
                </CardTitle>
                <CardDescription>
                  Place your finger on the scanner to mark attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center ${
                    isScanning 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  } transition-all duration-300 cursor-pointer`}
                    onClick={handleFingerPrintScan}
                  >
                    <Fingerprint className={`h-16 w-16 ${isScanning ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    {isScanning ? (
                      <div className="space-y-2">
                        <p className="text-blue-600 font-medium">Scanning fingerprint...</p>
                        <p className="text-sm text-gray-600">Please keep your finger on the scanner</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-medium">Ready to scan</p>
                        <p className="text-sm text-gray-600">Click to simulate fingerprint scan</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={handleFingerPrintScan}
                    disabled={isScanning}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isScanning ? "Scanning..." : "Start Fingerprint Scan"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Manual Entry</span>
                </CardTitle>
                <CardDescription>
                  Enter Employee ID manually for backup attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    placeholder="Enter Employee ID (e.g., EMP001)"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleManualEntry}
                  className="w-full"
                  variant="outline"
                >
                  Mark Manual Attendance
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Today's Attendance Log */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Attendance</span>
              </CardTitle>
              <CardDescription>
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {todayRecords.length > 0 ? (
                    todayRecords.map((record: any) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {record.type === "Check In" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">{record.employeeName}</p>
                            <p className="text-sm text-gray-600">{record.employeeId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{record.time}</p>
                          <Badge variant={record.method === "Fingerprint" ? "default" : "secondary"}>
                            {record.method}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No attendance records for today</p>
                      <p className="text-sm text-gray-500">Start marking attendance to see records here</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;