import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Home</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to the Application</CardTitle>
            <CardDescription>
              You have successfully logged in and are now on the home page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is the home page. You can add your main application content here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 