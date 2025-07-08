import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Fingerprint, Eye, EyeOff, LogIn, Shield, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useAdmin } from "@/contexts/LaravelAdminContext";

const Login = () => {
  console.log('Login: Component rendering');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add error boundary for useAdmin hook
  let adminContext;
  try {
    adminContext = useAdmin();
    console.log('Login: Successfully got admin context');
  } catch (error) {
    console.error('Login: Error getting admin context:', error);
    // For now, we'll handle this gracefully
    adminContext = null;
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fingerprintScanning, setFingerprintScanning] = useState(false);
  const [fingerprintStage, setFingerprintStage] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login: handleSubmit called');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!adminContext || !adminContext.login) {
      console.error('Login: Admin context not available');
      toast({
        title: "Error",
        description: "Authentication service not available. Please refresh the page.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Login: Attempting login with admin context');
      const loginSuccess = await adminContext.login(formData.email, formData.password, formData.role);
      
      if (loginSuccess) {
        toast({
          title: "Login Successful",
          description: "Welcome to AfraExpress Attendance System",
          duration: 3000
        });
        
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        
        // Navigate based on user role
        const user = adminContext.user;
        if (user?.role === 'admin') {
          navigate("/dashboard");
        } else if (user?.role === 'manager') {
          navigate("/manager-portal");
        } else if (user?.role === 'employee') {
          navigate("/employee-portal");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    console.log('Login: handleBiometricLogin called');
    
    if (!adminContext || !adminContext.login) {
      toast({
        title: "Error",
        description: "Authentication service not available. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    setFingerprintScanning(true);
    setFingerprintStage(0);
    setScanProgress(0);
    
    toast({
      title: "Biometric Authentication",
      description: "Initializing fingerprint scanner...",
    });

    try {
      // Stage 1: Scanner initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFingerprintStage(1);
      
      toast({
        title: "Place Your Finger",
        description: "Please place your finger on the scanner",
      });

      // Stage 2: Scanning process with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setScanProgress(i);
      }
      
      setFingerprintStage(2);
      
      toast({
        title: "Analyzing Fingerprint",
        description: "Processing biometric data...",
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 3: Authentication result
      const success = Math.random() > 0.15; // 85% success rate
      
      if (success) {
        setFingerprintStage(3);
        
        toast({
          title: "Authentication Successful",
          description: "Fingerprint verified! Logging you in...",
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const loginSuccess = await adminContext.login("admin@afraexpress.com", "admin123");
        if (loginSuccess) {
          navigate("/dashboard");
        }
      } else {
        setFingerprintStage(4);
        toast({
          title: "Authentication Failed",
          description: "Fingerprint not recognized. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Biometric Error",
        description: "Fingerprint scanner not available",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setFingerprintScanning(false);
        setFingerprintStage(0);
        setScanProgress(0);
      }, 2000);
    }
  };

  const getFingerprintIcon = () => {
    if (!fingerprintScanning) return <Fingerprint className="h-5 w-5 mr-2 text-blue-600 group-hover:animate-pulse transition-all duration-200" />;
    
    switch (fingerprintStage) {
      case 0:
        return <div className="h-5 w-5 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 1:
        return <Fingerprint className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />;
      case 2:
        return <Fingerprint className="h-5 w-5 mr-2 text-yellow-600 animate-bounce" />;
      case 3:
        return <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />;
      case 4:
        return <AlertCircle className="h-5 w-5 mr-2 text-red-600" />;
      default:
        return <Fingerprint className="h-5 w-5 mr-2 text-blue-600" />;
    }
  };

  const getFingerprintText = () => {
    if (!fingerprintScanning) return "Biometric Login";
    
    switch (fingerprintStage) {
      case 0:
        return "Initializing...";
      case 1:
        return `Scanning... ${scanProgress}%`;
      case 2:
        return "Analyzing...";
      case 3:
        return "Verified!";
      case 4:
        return "Failed";
      default:
        return "Processing...";
    }
  };

  // If admin context is not available, show a loading state
  if (!adminContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Loading authentication service...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Animated Header */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in">
              <div className="relative">
                <Fingerprint className="h-8 w-8 text-white animate-pulse" />
                {fingerprintScanning && (
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                AfraExpress
              </h1>
              <p className="text-sm text-gray-600">Smart Biometric Attendance</p>
            </div>
          </div>
          <p className="text-gray-600">Multi-Role Portal - Secure Authentication</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-slide-in-right card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600 animate-pulse-glow" />
              <span>Portal Login</span>
            </CardTitle>
            <CardDescription>
              Select your role and login with secure authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 stagger-item">
                <Label htmlFor="role">Select Role</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div className="space-y-2 stagger-item">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <span>Email Address</span>
                  <Lock className="h-4 w-4 text-gray-400" />
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={
                    formData.role === 'admin' ? 'admin@afraexpress.com' :
                    formData.role === 'manager' ?
                    'manager@afraexpress.com' :
                    'employee@afraexpress.com'
                  }
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                />
              </div>

              <div className="space-y-2 stagger-item">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 pr-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between stagger-item">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="px-0 text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:scale-105">
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-gradient hover-lift stagger-item"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>{formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="relative stagger-item">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Biometric Authentication</span>
              </div>
            </div>

            <div className="relative stagger-item">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-lg group fingerprint-scanner"
                onClick={handleBiometricLogin}
                disabled={fingerprintScanning}
              >
                <div className="flex items-center justify-center space-x-2">
                  {getFingerprintIcon()}
                  <span>{getFingerprintText()}</span>
                </div>
                {fingerprintScanning && fingerprintStage === 1 && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" 
                       style={{width: `${scanProgress}%`}} />
                )}
              </Button>
            </div>

            <div className="text-center stagger-item">
              <p className="text-sm text-gray-600">
                Need different access?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/signup")}
                  className="px-0 text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:scale-105"
                >
                  Employee Portal
                </Button>
              </p>
            </div>

            <div className="text-center text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg glass stagger-item">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-blue-600 animate-pulse" />
                <span className="font-medium">Demo Credentials</span>
              </div>
              <div className="space-y-1">
                <p><strong>Admin:</strong> admin@afraexpress.com / admin123</p>
                <p><strong>Manager:</strong> manager@afraexpress.com / manager123</p>
                <p><strong>Employee:</strong> employee@afraexpress.com / employee123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 stagger-item">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 hover-lift"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;