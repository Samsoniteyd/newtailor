"use client";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import CustomerForm from '../../../components/CustomerForm';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { requisitionToCustomer, customerToRequisition } from '../../../lib/mappers';
import { useRequisitions } from '../../../hooks/useRequisitions';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { requisitions, updateRequisition, isUpdating, isLoading, updateError } = useRequisitions();
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Find the specific requisition by ID
  const requisition = useMemo(() => {
    if (!requisitions || !params.id) return null;
    console.log('Looking for requisition with ID:', params.id);
    console.log('Available requisitions:', requisitions.map(r => ({ id: r._id, name: r.name })));
    return requisitions.find(req => req._id === params.id);
  }, [requisitions, params.id]);

  const handleSave = (customer: any) => {
    console.log('Saving customer:', customer);
    console.log('Customer ID:', customer.id);
    console.log('Params ID:', params.id);
    
    setSaveError(null);
    const requisitionData = customerToRequisition(customer);
    console.log('Converted requisition data:', requisitionData);
    
    updateRequisition(
      { id: params.id as string, data: requisitionData },
      {
        onSuccess: () => {
          console.log('Update successful');
          router.push('/users');
        },
        onError: (error: any) => {
          console.error('Update failed:', error);
          console.error('Error details:', {
            status: error?.response?.status,
            message: error?.response?.data?.message,
            url: error?.config?.url,
            method: error?.config?.method
          });
          
          let errorMessage = 'Failed to update customer';
          if (error?.response?.status === 404) {
            errorMessage = 'Customer not found. It may have been deleted.';
          } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          setSaveError(errorMessage);
        }
      }
    );
  };

  const handleCancel = () => {
    router.push('/users');
  };

  // Show loading state while fetching all requisitions
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 text-center text-sm sm:text-base">
                Loading customer details...
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Show error state if requisition not found after loading
  if (!isLoading && !requisition) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                Customer Not Found
              </h1>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                The customer you're looking for doesn't exist or has been deleted.
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500">Debug Info:</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                  Looking for ID: {params.id}
                </p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                  Available IDs: {requisitions?.map(r => r._id).join(', ') || 'None'}
                </p>
              </div>
              <Button 
                onClick={() => router.push('/users')}
                className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customers
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Convert to customer format for the form
  const customer = requisition ? requisitionToCustomer(requisition) : null;

  if (!customer) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 text-center text-sm sm:text-base">
                Preparing customer data...
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Mobile header with back button */}
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm sm:hidden">
          <div className="flex items-center px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="mr-3 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Edit Customer</h1>
              <p className="text-sm text-gray-600 truncate max-w-[200px]">
                {customer.name}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Customers</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
                <p className="text-gray-600">{customer.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {saveError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Update Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{saveError}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSaveError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form content */}
        <div className="pb-4 sm:pb-8">
          <CustomerForm 
            customer={customer}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>

        {/* Loading overlay */}
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                <p className="text-center text-sm sm:text-base text-gray-700">
                  Updating customer...
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 