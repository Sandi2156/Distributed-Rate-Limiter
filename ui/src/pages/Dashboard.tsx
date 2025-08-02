import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
          >
            Logout
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to your Dashboard</CardTitle>
            <CardDescription>
              You have successfully logged in to the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is a placeholder dashboard. You can add your actual dashboard content here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 