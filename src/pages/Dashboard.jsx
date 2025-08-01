import React, { useEffect, useState } from 'react';
import {
  Book, BookOpenCheck, Bookmark, Users, Clock, AlertCircle, Library,
  PieChart as PieIcon, LineChart as LineIcon, BarChart2, Calendar, 
  TrendingUp, RefreshCw, Download, Filter, Tag, Star, DollarSign, BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, Cell, ScatterChart, Scatter,PieChart
} from 'recharts';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import api from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#A05195'];

const StatCard = ({ icon, title, value, change, tooltip }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
        {change && (
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </p>
        )}
      </div>
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
    </div>
    {tooltip && (
      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs p-2 rounded bottom-full mb-2">
        {tooltip}
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      setRefreshing(true);
      const [booksRes, usersRes] = await Promise.all([
        api.get('/livres/get-all'),
        api.get('/utilisateurs/get-all'),
      ]);

      const books = booksRes.data;
      const users = usersRes.data;

      // 1. Stats
      const totalBooks = books.length;
      const availableBooks = books.filter(b => b.stock > 0).length;
      const reservedBooks = books.filter(b => b.stock <= 0).length;
      const totalUsers = users.length;

      // 2. Book classifications (using classification field)
      const classMap = {};
      books.forEach(book => {
        const classifications = book.classification 
          ? book.classification.split(',').map(c => c.trim())
          : ['Unclassified'];
        
        classifications.forEach(cat => {
          classMap[cat] = (classMap[cat] || 0) + 1;
        });
      });
      const classifications = Object.entries(classMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      // 3. Tag analysis (using tags array)
      const tagMap = {};
      books.forEach(book => {
        if (book.tags && Array.isArray(book.tags)) {
          book.tags.forEach(tag => {
            tagMap[tag] = (tagMap[tag] || 0) + 1;
          });
        }
      });
      const tags = Object.entries(tagMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      setStats({ 
        totalBooks, 
        availableBooks, 
        reservedBooks, 
        totalUsers,
        avgReservationPrice: books.length > 0 
          ? (books.reduce((sum, book) => sum + (book.reservation_price || 0), 0) / books.length).toFixed(2)
          : 0,
      });
      setCategoryData(classifications);
      setTagData(tags);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [dateRange]);

  const handleRefresh = () => {
    loadDashboard();
  };

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const exportData = () => {
    const data = {
      stats,
      categoryData,
      tagData,
      dateRange
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `library-dashboard-${new Date().toISOString()}.json`;
    link.click();
  };

  if (loading && !refreshing) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <RefreshCw className="animate-spin h-12 w-12 mx-auto text-blue-500" />
        <p className="mt-4 text-lg">Loading dashboard data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
      <p className="mt-4 text-red-600 text-lg">{error}</p>
      <button 
        onClick={loadDashboard}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Library Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <DateRangePicker
              ranges={dateRange}
              onChange={handleDateChange}
              className="border rounded-lg"
              maxDate={new Date()}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Refresh data"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={exportData}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Export data"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'books' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Books Analysis
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === 'users' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            User Activity
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<Library size={24} />} 
              title="Total Books" 
              value={stats.totalBooks} 
              tooltip="Number of books in the library catalog"
            />
            <StatCard 
              icon={<BookOpenCheck size={24} />} 
              title="Available Books" 
              value={stats.availableBooks} 
              change={`${Math.round((stats.availableBooks / stats.totalBooks) * 100)}% of total`}
              tooltip="Books currently available"
            />
            <StatCard 
              icon={<Bookmark size={24} />} 
              title="Reserved Books" 
              value={stats.reservedBooks} 
              tooltip="Books currently reserved"
            />
            <StatCard 
              icon={<Users size={24} />} 
              title="Total Users" 
              value={stats.totalUsers} 
              tooltip="Registered library users"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Book Classifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
                  <PieIcon size={20} />
                  Book Classifications
                </h2>
                <div className="text-xs text-gray-500">
                  Based on classification field
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={categoryData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} books`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tag Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                <Tag size={20} />
                Book Tags Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={tagData}
                    layout="vertical"
                    margin={{ left: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" name="Number of Books" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Books Analysis Tab */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          {/* Books Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              icon={<Book size={24} />} 
              title="Total Books" 
              value={stats.totalBooks} 
            />
            <StatCard 
              icon={<BookOpenCheck size={24} />} 
              title="Available Books" 
              value={stats.availableBooks} 
              change={`${Math.round((stats.availableBooks / stats.totalBooks) * 100)}% of total`}
            />
            <StatCard 
              icon={<Bookmark size={24} />} 
              title="Reserved Books" 
              value={stats.reservedBooks} 
            />
          </div>

          {/* Books Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                <PieIcon size={20} />
                Book Classifications
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={categoryData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} books`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                <BarChart3 size={20} />
                Classification vs. Tags
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData.map((cat, i) => ({
                      name: cat.name,
                      classifications: cat.value,
                      tags: tagData[i]?.value || 0
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="classifications" name="Classifications" fill="#8884d8" />
                    <Bar dataKey="tags" name="Tags" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              icon={<Users size={24} />} 
              title="Total Users" 
              value={stats.totalUsers} 
            />
          </div>
        </div>
      )}
    </div>
  );
}