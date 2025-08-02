import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { apiService, type ApiRegistration } from '@/services/apiService';
import ApiRegistrationForm from '@/components/ApiRegistrationForm';
import { Plus, Edit, X, Globe, Activity, LogIn } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={handleRegisterApi}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Register API
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogin}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>

        {!isAuthenticated ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center flex flex-col items-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to API Management</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Please log in to manage your API registrations and rate limiting configurations.
                </p>
                <Button 
                  onClick={handleLogin}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login to Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Activity className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Loading APIs...</p>
              </div>
            </CardContent>
          </Card>
        ) : apis.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center flex flex-col items-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No APIs Registered</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Get started by registering your first API for rate limiting.
                </p>
                <Button 
                  onClick={handleRegisterApi}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Register Your First API
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {apis.map((api) => (
              <Card key={api._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{api.name}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL:</span>
                          <p className="text-gray-700 text-sm truncate">{api.endpointUrl}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Algorithm:</span>
                          <span className="text-gray-700 text-sm">{api.rateLimitAlgorithm?.name || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditApi(api)}
                        className="flex items-center gap-1 h-8 px-3"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteApi(api._id)}
                        className="flex items-center gap-1 h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3.5 w-3.5" />
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
  );
} 