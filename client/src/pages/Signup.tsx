import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus, Fingerprint, Shield, User, Mail, Building, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    phoneNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fingerprintEnrollment, setFingerprintEnrollment] = useState(false);
  const [enrollmentStage, setEnrollmentStage] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFingerprintEnrollment = async () => {
    setFingerprintEnrollment(true);
    setEnrollmentStage(0);
    setScanCount(0);
    setEnrollmentProgress(0);
    
    toast({
      title: "Biometric Enrollment",
      description: "Initializing fingerprint enrollment process...",
    });

    try {
      // Stage 1: Initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEnrollmentStage(1);
      
      toast({
        title: "Enrollment Started",
        description: "Please scan your fingerprint 3 times for complete enrollment",
      });

      // Stage 2: Multiple scans
      for (let scan = 1; scan <= 3; scan++) {
        setScanCount(scan);
        setEnrollmentStage(2);
        
        toast({
          title: `Scan ${scan}/3`,
          description: "Place your finger on the scanner...",
        });

        // Simulate scanning progress for each finger scan
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 150));
          setEnrollmentProgress(progress);
        }

        setEnrollmentStage(3);
        
        if (scan < 3) {
          toast({
            title: `Scan ${scan} Complete`,
            description: "Please lift your finger and scan again...",
          });
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      // Stage 4: Processing and completion
      setEnrollmentStage(4);
      
      toast({
        title: "Processing Fingerprint",
        description: "Creating your biometric template...",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEnrollmentStage(5);
      setEnableBiometric(true);
      
      toast({
        title: "Biometric Enrollment Successful",
        description: "Your fingerprint has been enrolled successfully!",
      });

    } catch (error) {
      setEnrollmentStage(6);
      toast({
        title: "Enrollment Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setFingerprintEnrollment(false);
        setEnrollmentStage(0);
        setScanCount(0);
        setEnrollmentProgress(0);
      }, 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Form validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error", 
        description: "Passwords do not match",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast({
        title: "Account Created Successfully",
        description: "Welcome to AfraExpress! Your biometric profile is ready.",
        duration: 4000
      });

      const userData = {
        ...formData,
        biometricEnabled: enableBiometric,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      localStorage.setItem("registeredUsers", JSON.stringify([...existingUsers, userData]));

      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFingerprintIcon = () => {
    if (!fingerprintEnrollment) return <Fingerprint className="h-5 w-5 mr-2" />;
    
    switch (enrollmentStage) {
      case 0:
      case 1:
        return <div className="h-5 w-5 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 2:
        return <Fingerprint className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />;
      case 3:
        return <Clock className="h-5 w-5 mr-2 text-yellow-600 animate-bounce" />;
      case 4:
        return <div className="h-5 w-5 mr-2 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />;
      case 5:
        return <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />;
      case 6:
        return <AlertCircle className="h-5 w-5 mr-2 text-red-600" />;
      default:
        return <Fingerprint className="h-5 w-5 mr-2" />;
    }
  };

  const getFingerprintText = () => {
    if (!fingerprintEnrollment) {
      return enableBiometric ? "Biometric Enrolled" : "Setup Fingerprint";
    }
    
    switch (enrollmentStage) {
      case 0:
      case 1:
        return "Initializing...";
      case 2:
        return `Scanning ${scanCount}/3 - ${enrollmentProgress}%`;
      case 3:
        return `Scan ${scanCount} Complete`;
      case 4:
        return "Processing...";
      case 5:
        return "Enrolled Successfully!";
      case 6:
        return "Enrollment Failed";
      default:
        return "Processing...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl">
        {/* Animated Header */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in">
              <Fingerprint className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                AfraExpress
              </h1>
              <p className="text-sm text-gray-600">Smart Biometric Attendance</p>
            </div>
          </div>
          <p className="text-gray-600">Create your biometric profile</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-slide-in-right card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <UserPlus className="h-6 w-6 text-blue-600 animate-pulse-glow" />
              <span>Create Account</span>
            </CardTitle>
            <CardDescription>
              Join AfraExpress with biometric security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 stagger-item">
                  <Label htmlFor="firstName" className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>First Name *</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                  />
                </div>
                <div className="space-y-2 stagger-item">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2 stagger-item">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>Email Address *</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                />
              </div>

              {/* Department and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 stagger-item">
                  <Label htmlFor="department" className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>Department</span>
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                  />
                </div>
                <div className="space-y-2 stagger-item">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 stagger-item">
                  <Label htmlFor="password">Password *</Label>
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
                <div className="space-y-2 stagger-item">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="h-12 pr-12 transition-all duration-300 focus:scale-105 focus:shadow-lg hover-glow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Biometric Setup */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 glass stagger-item">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 animate-pulse" />
                    <span className="font-medium text-blue-800">Biometric Security</span>
                  </div>
                  {enableBiometric && (
                    <div className="flex items-center space-x-1 text-green-600 animate-fade-in">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Enrolled</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Set up fingerprint authentication for secure and quick access
                </p>
                
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 transition-all duration-300 hover:scale-105 fingerprint-scanner"
                    onClick={handleFingerprintEnrollment}
                    disabled={fingerprintEnrollment || enableBiometric}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {getFingerprintIcon()}
                      <span>{getFingerprintText()}</span>
                    </div>
                  </Button>
                  
                  {fingerprintEnrollment && enrollmentStage === 2 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full" 
                         style={{width: `${enrollmentProgress}%`}} />
                  )}
                </div>
                
                {enableBiometric && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center animate-fade-in">
                    <p className="text-sm text-green-700 font-medium">✓ Biometric profile created successfully</p>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2 stagger-item">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Button variant="link" className="px-0 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Terms and Conditions
                  </Button>
                  {" "}and{" "}
                  <Button variant="link" className="px-0 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Privacy Policy
                  </Button>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-gradient hover-lift stagger-item"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center stagger-item">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="px-0 text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:scale-105"
                >
                  Sign in here
                </Button>
              </p>
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

export default Signup;