"use client";
import { useParams, useRouter } from 'next/navigation';
import { useRequisition } from '../../../hooks/useRequisitions';
import { useAuth } from '../../../hooks/useAuth';
import CustomerForm from '../../../components/CustomerForm';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { requisitionToCustomer, customerToRequisition } from '../../../lib/mappers';
import { useRequisitions } from '../../../hooks/useRequisitions';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { updateRequisition } = useRequisitions();
  const { data: requisition, isLoading } = useRequisition(params.id as string);

  const handleSave = (customer: any) => {
    const requisitionData = customerToRequisition(customer);
    updateRequisition(
      { id: params.id as string, data: requisitionData },
      {
        onSuccess: () => {
          router.push('/users');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!requisition) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Customer not found</h1>
            <button 
              onClick={() => router.push('/users')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Customers
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const customer = requisitionToCustomer(requisition);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CustomerForm 
            customer={customer}
            onSave={handleSave}
            onCancel={() => router.push('/users')}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
} 