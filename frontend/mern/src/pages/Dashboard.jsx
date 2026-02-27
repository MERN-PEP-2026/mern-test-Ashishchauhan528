import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ courseName: '', courseDescription: '', instructor: '' });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/courses?search=${search}`);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.post('/courses', form);
      setForm({ courseName: '', courseDescription: '', instructor: '' });
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">📚 CourseHub</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
        </div>

        
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Create New Course</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. React Basics"
                  value={form.courseName}
                  onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Instructor</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  placeholder="Course description..."
                  value={form.courseDescription}
                  onChange={(e) => setForm({ ...form, courseDescription: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {formLoading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        )}

        
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search courses by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>

        
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">No courses found. Add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-indigo-100 text-indigo-600 font-medium px-2 py-1 rounded-full">
                      Course
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">{course.courseName}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.courseDescription}</p>
                  <p className="text-sm text-indigo-500 font-medium mt-3">👨‍🏫 {course.instructor}</p>
                </div>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="mt-4 w-full text-sm text-red-500 border border-red-200 hover:bg-red-50 rounded-lg py-1.5 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}