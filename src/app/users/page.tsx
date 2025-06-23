"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerList from "@/components/CustomerList";
import CustomerForm from '@/components/CustomerForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Customer } from "@/types/customer";
import { Users, PlusCircle, Scissors, Calendar, LogOut } from "lucide-react";
import { useRequisitions } from '../../hooks/useRequisitions';
import { useAuth } from '../../hooks/useAuth';
import { customerToRequisition, requisitionToCustomer } from '../../lib/mappers';
import { Requisition } from '@/types';

const UsersPage = () => {
  const { user, logout } = useAuth();
  const { 
    requisitions, 
    isLoading, 
    createRequisition, 
    updateRequisition, 
    deleteRequisition,
    isCreating,
    isUpdating,
    isDeleting 
  } = useRequisitions();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Convert requisitions to customers for display
  const customers = requisitions ? requisitions.map(requisitionToCustomer) : [];

  const handleSaveCustomer = (customer: Customer) => {
    const requisitionData = customerToRequisition(customer);
    
    if (editingCustomer) {
      updateRequisition(
        { id: customer.id, data: requisitionData },
        {
          onSuccess: () => {
            setEditingCustomer(null);
            setActiveTab("customers");
          }
        }
      );
    } else {
      createRequisition(requisitionData, {
        onSuccess: () => {
          setActiveTab("customers");
        }
      });
    }
  };

  const handleEditRequisition = (requisition: Requisition) => {
    const customer = requisitionToCustomer(requisition);
    setEditingCustomer(customer);
    setActiveTab("new-customer");
  };

  const handleDeleteRequisition = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteRequisition(id);
    }
  };

  const stats = {
    totalCustomers: customers.length,
    pendingOrders: customers.filter(c => c.status === 'pending').length,
    readyForCollection: customers.filter(c => c.status === 'ready').length,
    collected: customers.filter(c => c.status === 'collected').length
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TailorPro</h1>
                  <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Professional Edition
                </Badge>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="new-customer">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Order
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</div>
                    <p className="text-xs text-gray-600">Active clients</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
                    <p className="text-xs text-gray-600">In progress</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ready for Collection</CardTitle>
                    <Scissors className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.readyForCollection}</div>
                    <p className="text-xs text-gray-600">Completed orders</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collected</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.collected}</div>
                    <p className="text-xs text-gray-600">This month</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Welcome to TailorPro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Professional tailoring management system to help you manage your customers, orders, and measurements efficiently.
                  </p>
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => setActiveTab("new-customer")}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isCreating}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {isCreating ? 'Creating...' : 'Create New Order'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("customers")}
                    >
                      View All Customers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers">
              <CustomerList 
                requisitions={requisitions || []}
                onEdit={handleEditRequisition}
                onDelete={handleDeleteRequisition}
              />
              {(isUpdating || isDeleting) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-center">
                      {isUpdating ? 'Updating...' : 'Deleting...'}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="new-customer">
              <CustomerForm 
                customer={editingCustomer}
                onSave={handleSaveCustomer}
                onCancel={() => {
                  setEditingCustomer(null);
                  setActiveTab("customers");
                }}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default UsersPage;