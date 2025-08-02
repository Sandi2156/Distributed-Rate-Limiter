import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { apiService, type ApiRegistration } from '@/services/apiService';
import ApiRegistrationForm from '@/components/ApiRegistrationForm';
import { Plus, Edit, X, Globe, Activity } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [apis, setApis] = useState<ApiRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<ApiRegistration | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getApis();
      setApis(data);
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
      await apiService.updateApi(editingApi.id, data);
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

  const handleEditApi = (api: ApiRegistration) => {
    setEditingApi(api);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingApi) {
      await handleUpdateApi(data);
    } else {
      await handleCreateApi(data);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setEditingApi(undefined);
                setIsFormOpen(true);
              }}
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
          </div>
        </div>

        {isLoading ? (
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
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No APIs Registered</h3>
                <p className="text-gray-500 mb-4">
                  Get started by registering your first API for rate limiting.
                </p>
                <Button 
                  onClick={() => {
                    setEditingApi(undefined);
                    setIsFormOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Register Your First API
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apis.map((api) => (
              <Card key={api.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{api.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          api.method === 'GET' ? 'bg-green-100 text-green-800' :
                          api.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          api.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {api.method}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{api.url}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Rate Limit: {api.rateLimit} req/min</span>
                        <span>Created: {new Date(api.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditApi(api)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteApi(api.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
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
        />
      </div>
    </div>
  );
} 