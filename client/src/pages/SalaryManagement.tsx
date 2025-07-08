import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  TrendingUp,
  Users,
  Calculator,
  PiggyBank
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/LaravelAdminContext";

interface SalaryStructure {
  id: string;
  user_id: string;
  employee_name: string;
  employee_id: string;
  basic_salary: number;
  allowances: {
    house_rent: number;
    transport: number;
    medical: number;
    food: number;
    other: number;
  };
  deductions: {
    tax: number;
    provident_fund: number;
    insurance: number;
    other: number;
  };
  overtime_rate: number;
  bonus_eligible: boolean;
  currency: string;
  effective_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SalaryManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - in real app this would come from API
  const [salaryStructures] = useState<SalaryStructure[]>([
    {
      id: '1',
      user_id: '1',
      employee_name: 'John Doe',
      employee_id: 'EMP001',
      basic_salary: 50000,
      allowances: {
        house_rent: 15000,
        transport: 5000,
        medical: 3000,
        food: 2000,
        other: 1000
      },
      deductions: {
        tax: 8000,
        provident_fund: 5000,
        insurance: 1500,
        other: 500
      },
      overtime_rate: 500,
      bonus_eligible: true,
      currency: 'USD',
      effective_date: '2024-01-01',
      is_active: true,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z'
    },
    {
      id: '2',
      user_id: '2',
      employee_name: 'Sarah Smith',
      employee_id: 'EMP002',
      basic_salary: 60000,
      allowances: {
        house_rent: 18000,
        transport: 6000,
        medical: 4000,
        food: 2500,
        other: 1500
      },
      deductions: {
        tax: 10000,
        provident_fund: 6000,
        insurance: 2000,
        other: 1000
      },
      overtime_rate: 600,
      bonus_eligible: true,
      currency: 'USD',
      effective_date: '2024-01-01',
      is_active: true,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z'
    },
    {
      id: '3',
      user_id: '3',
      employee_name: 'Mike Johnson',
      employee_id: 'EMP003',
      basic_salary: 45000,
      allowances: {
        house_rent: 12000,
        transport: 4000,
        medical: 2500,
        food: 1800,
        other: 700
      },
      deductions: {
        tax: 6500,
        provident_fund: 4500,
        insurance: 1200,
        other: 300
      },
      overtime_rate: 450,
      bonus_eligible: false,
      currency: 'USD',
      effective_date: '2024-01-01',
      is_active: true,
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z'
    }
  ]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const statuses = ["all", "active", "inactive"];
  
  const filteredSalaries = salaryStructures.filter(salary => {
    const matchesSearch = 
      salary.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && salary.is_active) ||
      (filterStatus === "inactive" && !salary.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteSalary = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete salary structure for ${name}?`)) {
      toast({
        title: "Salary Structure Deleted",
        description: `Salary structure for ${name} has been removed`
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

  const calculateGrossSalary = (salary: SalaryStructure) => {
    const totalAllowances = Object.values(salary.allowances).reduce((sum, amount) => sum + amount, 0);
    return salary.basic_salary + totalAllowances;
  };

  const calculateNetSalary = (salary: SalaryStructure) => {
    const grossSalary = calculateGrossSalary(salary);
    const totalDeductions = Object.values(salary.deductions).reduce((sum, amount) => sum + amount, 0);
    return grossSalary - totalDeductions;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Salary Management
                </h1>
                <p className="text-sm text-gray-600">Manage employee salary structures</p>
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
                placeholder="Search by employee name or ID..."
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
              onClick={() => toast({ title: "Feature Coming Soon", description: "Salary structure creation form will be available soon" })}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Salary
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold">{salaryStructures.length}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Gross Salary</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      salaryStructures.reduce((sum, s) => sum + calculateGrossSalary(s), 0) / salaryStructures.length
                    )}
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(
                      salaryStructures.reduce((sum, s) => sum + calculateNetSalary(s), 0)
                    )}
                  </p>
                </div>
                <Calculator className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bonus Eligible</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {salaryStructures.filter(s => s.bonus_eligible).length}
                  </p>
                </div>
                <PiggyBank className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Structures Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Salary Structures</span>
            </CardTitle>
            <CardDescription>
              Showing {filteredSalaries.length} of {salaryStructures.length} salary structures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Overtime Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalaries.map((salary) => (
                    <TableRow key={salary.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {salary.employee_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold">{salary.employee_name}</p>
                            <p className="text-sm text-gray-500">{salary.employee_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(salary.basic_salary, salary.currency)}</p>
                          <p className="text-sm text-gray-500">Base amount</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatCurrency(
                              Object.values(salary.allowances).reduce((sum, amount) => sum + amount, 0),
                              salary.currency
                            )}
                          </p>
                          <p className="text-sm text-gray-500">Total benefits</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-red-600">
                            -{formatCurrency(
                              Object.values(salary.deductions).reduce((sum, amount) => sum + amount, 0),
                              salary.currency
                            )}
                          </p>
                          <p className="text-sm text-gray-500">Total cuts</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-green-600">
                            {formatCurrency(calculateGrossSalary(salary), salary.currency)}
                          </p>
                          <p className="text-sm text-gray-500">Before deductions</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-lg text-blue-600">
                            {formatCurrency(calculateNetSalary(salary), salary.currency)}
                          </p>
                          <p className="text-sm text-gray-500">Take home</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(salary.overtime_rate, salary.currency)}</p>
                          <p className="text-sm text-gray-500">Per hour</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={salary.is_active ? 'default' : 'secondary'}>
                            {salary.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {salary.bonus_eligible && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              Bonus Eligible
                            </Badge>
                          )}
                        </div>
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
                            onClick={() => handleDeleteSalary(salary.id, salary.employee_name)}
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

export default SalaryManagement;