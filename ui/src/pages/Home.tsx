import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { apiService, type ApiRegistration } from '@/services/apiService';
import ApiRegistrationForm from '@/components/ApiRegistrationForm';
import { Plus, Edit, X, Globe, Activity, LogIn } from 'lucide-react';

// Add CSS animation
const fadeInUpAnimation = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function Home() {
  const navigate = useNavigate();
  const [apis, setApis] = useState<ApiRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<ApiRegistration | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApis();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (!authenticated) {
      setIsLoading(false);
    }
  };

  const fetchApis = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getApis();
      setApis(data.registrations);
    } catch (error) {
      console.error('Failed to fetch APIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApi = async (data: any) => {
    try {
      setIsSubmitting(true);
      await apiService.createApi(data);
      await fetchApis();
    } catch (error: any) {
      alert(error.message || 'Failed to create API');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateApi = async (data: any) => {
    if (!editingApi) return;
    
    try {
      setIsSubmitting(true);
      await apiService.updateApi(editingApi._id, data);
      await fetchApis();
      setEditingApi(undefined);
    } catch (error: any) {
      alert(error.message || 'Failed to update API');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteApi = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API?')) return;
    
    try {
      await apiService.deleteApi(id);
      await fetchApis();
    } catch (error: any) {
      alert(error.message || 'Failed to delete API');
    }
  };

  const handleEditApi = async (api: ApiRegistration) => {
    try {
      setIsLoading(true);
      const response = await apiService.getApiDetails(api._id);
      setEditingApi(response.registration);
      setIsFormOpen(true);
    } catch (error: any) {
      console.error('Failed to fetch API details:', error);
      alert(error.message || 'Failed to fetch API details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingApi) {
      await handleUpdateApi(data);
    } else {
      await handleCreateApi(data);
    }
    // Clear editing state after submission
    setEditingApi(undefined);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setApis([]);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegisterApi = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEditingApi(undefined);
    setIsFormOpen(true);
  };

  return (
    <>
      <style>{fadeInUpAnimation}</style>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header with enhanced styling */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                API Management
              </h1>
              <p className="text-gray-300 mt-1">Manage your rate limiting configurations</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={handleRegisterApi}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  Register API
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-2 border-gray-300 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>

        {!isAuthenticated ? (
          <Card className="backdrop-blur-sm bg-gray-800/80 border-gray-700 shadow-2xl">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30"></div>
                  <div className="relative p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl">
                    <Globe className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Welcome to API Management
                </h3>
                <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                  Secure, scalable, and intelligent rate limiting for your APIs. 
                  Log in to start managing your configurations.
                </p>
                <Button 
                  onClick={handleLogin}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg"
                >
                  <LogIn className="h-5 w-5" />
                  Login to Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card className="backdrop-blur-sm bg-gray-800/80 border-gray-700 shadow-2xl">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30"></div>
                  <div className="relative p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <Activity className="h-8 w-8 animate-spin text-white" />
                  </div>
                </div>
                <p className="text-gray-300 font-medium">Loading your APIs...</p>
              </div>
            </CardContent>
          </Card>
        ) : apis.length === 0 ? (
          <Card className="backdrop-blur-sm bg-gray-800/80 border-gray-700 shadow-2xl">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-30"></div>
                  <div className="relative p-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-2xl">
                    <Plus className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                  You haven't registered any APIs yet. Start by adding your first API 
                  and configure rate limiting to protect your endpoints.
                </p>
                <Button 
                  onClick={handleRegisterApi}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg"
                >
                  <Plus className="h-5 w-5" />
                  Register Your First API
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apis.map((api, index) => (
              <Card 
                key={api._id} 
                className="backdrop-blur-sm bg-gray-800/80 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-800/90"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                          <Globe className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white truncate">{api.name}</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider bg-purple-900/30 px-2 py-1 rounded-full border border-purple-700/50">
                            URL
                          </span>
                          <p className="text-gray-300 text-sm truncate font-mono bg-gray-900/50 px-3 py-1 rounded-md border border-gray-700">
                            {api.endpointUrl}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-green-400 uppercase tracking-wider bg-green-900/30 px-2 py-1 rounded-full border border-green-700/50">
                            Algorithm
                          </span>
                          <span className="text-gray-300 text-sm font-medium bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            {api.rateLimitAlgorithm?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-6 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditApi(api)}
                        className="flex items-center gap-2 h-9 px-4 border-2 border-purple-600 hover:border-purple-500 hover:bg-purple-900/30 transition-all duration-300 text-purple-400"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteApi(api._id)}
                        className="flex items-center gap-2 h-9 px-4 border-2 border-red-600 hover:border-red-500 hover:bg-red-900/30 transition-all duration-300 text-red-400"
                      >
                        <X className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ApiRegistrationForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
          editingApi={editingApi}
        />
      </div>
    </div>
    </>
  );
} 