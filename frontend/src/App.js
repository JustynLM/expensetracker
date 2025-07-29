import React, { useState, useEffect, useCallback, memo } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Target, Calendar, DollarSign, PieChart, BarChart3, User, LogOut, Eye, EyeOff, Mail, Lock, UserPlus, Loader } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts';

const API_BASE_URL = 'http://localhost:5000/api';


const LandingPage = memo(({ onNavigate, loading }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="mb-8">
          <DollarSign className="mx-auto mb-4 text-blue-600" size={64} />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Personal Expense Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Take control of your finances. Track expenses, set budgets, and achieve your financial goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4">
            <BarChart3 className="mx-auto mb-3 text-blue-600" size={32} />
            <h3 className="font-semibold mb-2">Track Expenses</h3>
            <p className="text-gray-600 text-sm">Monitor your spending across different categories</p>
          </div>
          <div className="text-center p-4">
            <Target className="mx-auto mb-3 text-green-600" size={32} />
            <h3 className="font-semibold mb-2">Set Goals</h3>
            <p className="text-gray-600 text-sm">Create and track your savings goals</p>
          </div>
          <div className="text-center p-4">
            <TrendingUp className="mx-auto mb-3 text-purple-600" size={32} />
            <h3 className="font-semibold mb-2">Analyze Trends</h3>
            <p className="text-gray-600 text-sm">Get insights into your spending patterns</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('login')}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Lock size={20} />
            <span>Login</span>
          </button>
          <button
            onClick={() => onNavigate('register')}
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <UserPlus size={20} />
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    </div>
  </div>
));

const RegisterForm = memo(({ 
  fullName, 
  setFullName,
  email, 
  setEmail,
  username, 
  setUsername,
  password, 
  setPassword,
  showPassword, 
  setShowPassword, 
  errors, 
  authMessage, 
  loading, 
  onSubmit, 
  onNavigate 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <UserPlus className="mx-auto mb-4 text-green-600" size={48} />
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join us to start tracking your expenses</p>
      </div>

      {authMessage && (
        <div className={`mb-4 p-3 border rounded-lg text-center ${
          authMessage.includes('Complete') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {authMessage}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Choose a username"
            disabled={loading}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Create a password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Already have an account? Login
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
));

const LoginForm = memo(({ 
  usernameOrEmail, 
  setUsernameOrEmail,
  password, 
  setPassword,
  showPassword, 
  setShowPassword, 
  authMessage, 
  loading, 
  onSubmit, 
  onNavigate 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <Lock className="mx-auto mb-4 text-blue-600" size={48} />
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      {authMessage && (
        <div className={`mb-4 p-3 border rounded-lg text-center ${
          authMessage.includes('Invalid') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
        }`}>
          {authMessage}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter username or email"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Enter password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center">
          <button
            onClick={() => onNavigate('register')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Don't have an account? Sign up
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
));

const TransactionForm = memo(({ 
  type, 
  setType,
  amount, 
  setAmount,
  category, 
  setCategory,
  description, 
  setDescription,
  date, 
  setDate,
  categories,
  loading, 
  onSubmit 
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0.00"
          step="0.01"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Transaction description"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={loading || !amount || !category}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <PlusCircle size={20} />
        <span>{loading ? 'Adding...' : 'Add Transaction'}</span>
      </button>
    </div>
  </div>
));

// Main App Component
const ExpenseTrackerApp = () => {
  // Core app state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data state
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    goalSavings: 0,
    netAmount: 0
  });

  // Form states - separate state for each input
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const [loginUsernameOrEmail, setLoginUsernameOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [transactionType, setTransactionType] = useState('expense');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  // Budget form states
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');

  // Goal form states
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('0');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalUpdateAmounts, setGoalUpdateAmounts] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authMessage, setAuthMessage] = useState('');

  const categories = ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Salary', 'Freelance', 'Investment'];

  // API helper
  const apiCall = async (endpoint, options = {}) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  };

  // Load user data
  const loadUserData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      
      const [transactionData, budgetData, goalData, dashData] = await Promise.all([
        apiCall('/transactions'),
        apiCall('/budgets'),
        apiCall('/goals'),
        apiCall('/dashboard')
      ]);

      setTransactions(transactionData || []);
      setBudgets(budgetData || []);
      setGoals(goalData || []);
      setDashboardData(dashData);
      setCurrentPage('expense-tracker');
    } catch (error) {
      console.error('Failed to load user data:', error);
      localStorage.removeItem('token');
      setToken(null);
      setCurrentPage('landing');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load data on token change
  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token, loadUserData]);

  // Auth functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    const newErrors = {};
    
    if (!registerFullName.trim()) newErrors.fullName = 'Full name is required';
    if (!registerEmail.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(registerEmail)) newErrors.email = 'Invalid email format';
    if (!registerUsername.trim()) newErrors.username = 'Username is required';
    else if (registerUsername.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!registerPassword) newErrors.password = 'Password is required';
    else if (registerPassword.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await apiCall('/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: registerFullName,
          email: registerEmail,
          username: registerUsername,
          password: registerPassword
        })
      });

      setAuthMessage('Registration Complete');
      setCurrentPage('login');
      
      // Clear form
      setRegisterFullName('');
      setRegisterEmail('');
      setRegisterUsername('');
      setRegisterPassword('');
      setErrors({});
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({
          usernameOrEmail: loginUsernameOrEmail,
          password: loginPassword
        })
      });

      setToken(response.token);
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      setAuthMessage(response.message);
      
      // Clear form
      setLoginUsernameOrEmail('');
      setLoginPassword('');
      
      setTimeout(() => setAuthMessage(''), 3000);
    } catch (error) {
      setAuthMessage(error.message);
      setTimeout(() => setAuthMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setCurrentPage('landing');
    setActiveTab('dashboard');
    setAuthMessage('');
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    
    // Clear all form states
    setTransactionType('expense');
    setTransactionAmount('');
    setTransactionCategory('');
    setTransactionDescription('');
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setBudgetCategory('');
    setBudgetLimit('');
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('0');
    setGoalDeadline('');
    setGoalUpdateAmounts({});
    setShowPassword(false);
  };

  const handleAddTransaction = async () => {
    if (!transactionAmount || !transactionCategory) return;

    try {
      setLoading(true);
      await apiCall('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          type: transactionType,
          amount: parseFloat(transactionAmount),
          category: transactionCategory,
          description: transactionDescription,
          date: transactionDate
        })
      });

      // Clear form
      setTransactionType('expense');
      setTransactionAmount('');
      setTransactionCategory('');
      setTransactionDescription('');
      setTransactionDate(new Date().toISOString().split('T')[0]);

      // Reload data
      await loadUserData();
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!budgetCategory || !budgetLimit) return;

    try {
      setLoading(true);
      await apiCall('/budgets', {
        method: 'POST',
        body: JSON.stringify({
          category: budgetCategory,
          limitAmount: parseFloat(budgetLimit)
        })
      });

      // Clear form
      setBudgetCategory('');
      setBudgetLimit('');

      // Reload data
      await loadUserData();
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!goalName || !goalTarget || !goalDeadline) return;

    try {
      setLoading(true);
      await apiCall('/goals', {
        method: 'POST',
        body: JSON.stringify({
          name: goalName,
          targetAmount: parseFloat(goalTarget),
          currentAmount: parseFloat(goalCurrent) || 0,
          deadline: goalDeadline
        })
      });

      // Clear form
      setGoalName('');
      setGoalTarget('');
      setGoalCurrent('0');
      setGoalDeadline('');

      // Reload data
      await loadUserData();
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoalProgress = async (goalId, additionalAmount) => {
    if (!additionalAmount || additionalAmount <= 0) return;

    try {
      setLoading(true);
      
      // Find the current goal
      const currentGoal = goals.find(g => g.id === goalId);
      const newCurrentAmount = currentGoal.current_amount + parseFloat(additionalAmount);
      
      await apiCall(`/goals/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: currentGoal.name,
          targetAmount: currentGoal.target_amount,
          currentAmount: newCurrentAmount,
          deadline: currentGoal.deadline
        })
      });

      // Clear the input for this goal
      setGoalUpdateAmounts(prev => ({
        ...prev,
        [goalId]: ''
      }));

      // Reload data
      await loadUserData();
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setAuthMessage('');
  };

  // Generate real monthly data based on transactions
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const monthlyData = [];

    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === year;
      });

      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      monthlyData.push({
        month: months[monthIndex],
        income: monthIncome,
        expenses: monthExpenses
      });
    }

    return monthlyData;
  };

  // Render expense tracker
  const renderExpenseTracker = () => {
    const monthlyData = generateMonthlyData();
    const expensesByCategory = budgets.map(budget => ({
      name: budget.category,
      value: budget.spent_amount
    }));
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f'];

    const TabButton = ({ tab, label, icon: Icon }) => (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          activeTab === tab 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={32} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {currentUser?.fullName}!
              </h1>
              <p className="text-gray-600">Track your income, expenses, and achieve your financial goals</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {authMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {authMessage}
            </div>
          )}

          {/* Navigation */}
          <div className="flex space-x-4 mb-8 overflow-x-auto">
            <TabButton tab="dashboard" label="Dashboard" icon={BarChart3} />
            <TabButton tab="transactions" label="Transactions" icon={DollarSign} />
            <TabButton tab="budgets" label="Budgets" icon={PieChart} />
            <TabButton tab="goals" label="Goals" icon={Target} />
            <TabButton tab="summary" label="Monthly Summary" icon={Calendar} />
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Income</p>
                      <p className="text-2xl font-bold text-green-600">${dashboardData.totalIncome?.toLocaleString() || '0'}</p>
                    </div>
                    <TrendingUp className="text-green-600" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">${dashboardData.totalExpenses?.toLocaleString() || '0'}</p>
                    </div>
                    <TrendingDown className="text-red-600" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Goal Savings</p>
                      <p className="text-2xl font-bold text-blue-600">${dashboardData.goalSavings?.toLocaleString() || '0'}</p>
                    </div>
                    <Target className="text-blue-600" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Available Net</p>
                      <p className={`text-2xl font-bold ${dashboardData.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${dashboardData.netAmount?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <DollarSign className={dashboardData.netAmount >= 0 ? 'text-green-600' : 'text-red-600'} size={32} />
                  </div>
                </div>
              </div>

              {/* Monthly Trend Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
                {monthlyData.every(month => month.income === 0 && month.expenses === 0) ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <p>No transaction data yet. Add some transactions to see trends!</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, '']} />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No transactions yet. Add your first transaction!</p>
                  ) : (
                    transactions.slice(0, 5).map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.category}</p>
                        </div>
                        <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TransactionForm
                type={transactionType}
                setType={setTransactionType}
                amount={transactionAmount}
                setAmount={setTransactionAmount}
                category={transactionCategory}
                setCategory={setTransactionCategory}
                description={transactionDescription}
                setDescription={setTransactionDescription}
                date={transactionDate}
                setDate={setTransactionDate}
                categories={categories}
                loading={loading}
                onSubmit={handleAddTransaction}
              />

              {/* Transaction List */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">All Transactions</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction to get started!</p>
                  ) : (
                    transactions.map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
                        </div>
                        <span className={`font-semibold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs remain the same... */}
          {activeTab === 'budgets' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Budget Form */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Create Budget</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={budgetCategory}
                      onChange={(e) => setBudgetCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select category</option>
                      {categories.filter(cat => cat !== 'Salary' && cat !== 'Freelance' && cat !== 'Investment').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit ($)</label>
                    <input
                      type="number"
                      value={budgetLimit}
                      onChange={(e) => setBudgetLimit(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleAddBudget}
                    disabled={loading || !budgetCategory || !budgetLimit}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Target size={20} />
                    <span>{loading ? 'Creating...' : 'Create Budget'}</span>
                  </button>
                </div>
              </div>

              {/* Budget Overview */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Budget Overview</h3>
                {budgets.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <p className="text-gray-500">No budgets set yet. Create your first budget using the form on the left!</p>
                  </div>
                ) : (
                  <>
                    {budgets.map(budget => {
                      const percentage = (budget.spent_amount / budget.limit_amount) * 100;
                      const isOverBudget = percentage > 100;
                      
                      return (
                        <div key={budget.id} className="bg-white p-4 rounded-lg shadow-sm border">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{budget.category}</h4>
                            <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                              ${budget.spent_amount} / ${budget.limit_amount}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <p className={`text-sm mt-1 ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                            {percentage.toFixed(1)}% used
                            {isOverBudget && ` (${(budget.spent_amount - budget.limit_amount).toFixed(0)} over budget)`}
                          </p>
                        </div>
                      );
                    })}

                    {/* Spending Breakdown Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
                      <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
                      {expensesByCategory.length === 0 || expensesByCategory.every(item => item.value === 0) ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                          <p>No expense data to display</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <RechartsPieChart>
                            <Pie
                              data={expensesByCategory.filter(item => item.value > 0)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {expensesByCategory.filter(item => item.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}`, 'Amount']} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 gap-6">
              {/* Add Goal Form */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                    <input
                      type="text"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency Fund"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ($)</label>
                    <input
                      type="number"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount ($)</label>
                    <input
                      type="number"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input
                      type="date"
                      value={goalDeadline}
                      onChange={(e) => setGoalDeadline(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleAddGoal}
                    disabled={loading || !goalName || !goalTarget || !goalDeadline}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Target size={20} />
                    <span>{loading ? 'Creating...' : 'Create Goal'}</span>
                  </button>
                </div>
              </div>

              {/* Goals Display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {goals.length === 0 ? (
                  <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-sm border text-center">
                    <Target className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Goals Set Yet</h3>
                    <p className="text-gray-500">Create your first financial goal using the form above!</p>
                  </div>
                ) : (
                  goals.map(goal => {
                    const percentage = (goal.current_amount / goal.target_amount) * 100;
                    const remaining = goal.target_amount - goal.current_amount;
                    const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={goal.id} className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{goal.name}</h3>
                          <Target className="text-blue-600" size={24} />
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>${goal.current_amount?.toLocaleString()}</span>
                            <span>${goal.target_amount?.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-500 h-3 rounded-full"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{percentage.toFixed(1)}% complete</p>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Remaining:</span>
                            <span className="font-medium">${remaining.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Deadline:</span>
                            <span className="font-medium">{goal.deadline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Days left:</span>
                            <span className={`font-medium ${daysLeft < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                              {daysLeft} days
                            </span>
                          </div>
                          {daysLeft > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Monthly needed:</span>
                              <span className="font-medium">
                                ${Math.ceil(remaining / (daysLeft / 30)).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Add Money to Goal */}
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Add Money to Goal</p>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={goalUpdateAmounts[goal.id] || ''}
                              onChange={(e) => setGoalUpdateAmounts(prev => ({
                                ...prev,
                                [goal.id]: e.target.value
                              }))}
                              className="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Amount"
                              step="0.01"
                              disabled={loading}
                            />
                            <button
                              onClick={() => handleUpdateGoalProgress(goal.id, goalUpdateAmounts[goal.id])}
                              disabled={loading || !goalUpdateAmounts[goal.id] || goalUpdateAmounts[goal.id] <= 0}
                              className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {loading ? '...' : 'Add'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h3>
                {monthlyData.every(month => month.income === 0 && month.expenses === 0) ? (
                  <div className="flex items-center justify-center h-96 text-gray-500">
                    <p>No transaction data yet. Add some transactions to see monthly summary!</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, '']} />
                      <Bar dataKey="income" fill="#10b981" name="Income" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Average Monthly Income</p>
                  <p className="text-xl font-bold text-green-600">
                    ${monthlyData.length > 0 ? (monthlyData.reduce((sum, month) => sum + month.income, 0) / monthlyData.length).toFixed(0) : '0'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Average Monthly Expenses</p>
                  <p className="text-xl font-bold text-red-600">
                    ${monthlyData.length > 0 ? (monthlyData.reduce((sum, month) => sum + month.expenses, 0) / monthlyData.length).toFixed(0) : '0'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Best Month</p>
                  <p className="text-xl font-bold text-blue-600">
                    {monthlyData.some(month => month.income > 0 || month.expenses > 0) ? 
                      monthlyData.reduce((best, month) => 
                        (month.income - month.expenses) > (best.income - best.expenses) ? month : best
                      ).month : 'N/A'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Savings Rate</p>
                  <p className="text-xl font-bold text-purple-600">
                    {dashboardData.totalIncome > 0 ? ((dashboardData.netAmount / dashboardData.totalIncome) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={handleNavigate} loading={loading} />;
  }
  
  if (currentPage === 'register') {
    return (
      <RegisterForm
        fullName={registerFullName}
        setFullName={setRegisterFullName}
        email={registerEmail}
        setEmail={setRegisterEmail}
        username={registerUsername}
        setUsername={setRegisterUsername}
        password={registerPassword}
        setPassword={setRegisterPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        errors={errors}
        authMessage={authMessage}
        loading={loading}
        onSubmit={handleRegister}
        onNavigate={handleNavigate}
      />
    );
  }
  
  if (currentPage === 'login') {
    return (
      <LoginForm
        usernameOrEmail={loginUsernameOrEmail}
        setUsernameOrEmail={setLoginUsernameOrEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        authMessage={authMessage}
        loading={loading}
        onSubmit={handleLogin}
        onNavigate={handleNavigate}
      />
    );
  }
  
  if (currentPage === 'expense-tracker' && currentUser) {
    return renderExpenseTracker();
  }

  return <LandingPage onNavigate={handleNavigate} loading={loading} />;
};

export default ExpenseTrackerApp;