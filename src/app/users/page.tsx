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
import { Users, PlusCircle, Scissors, Calendar, LogOut, Menu, X, CheckCircle } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logout();
    // The useAuth hook will handle the redirect after showing the toast
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Mobile-optimized header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 sm:py-4">
              {/* Logo and brand */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg cursor-pointer">
                  <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">TailorPro</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Welcome, {user?.name}
                  </p>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center space-x-2 sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="cursor-pointer"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Desktop navigation */}
              <div className="hidden sm:flex items-center space-x-4">
                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs sm:text-sm cursor-default">
                  Professional Edition
                </Badge>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 text-sm cursor-pointer"
                  size="sm"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span className="hidden lg:inline">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span className="hidden lg:inline">Logout</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="sm:hidden border-t bg-white pb-3">
                <div className="pt-3 space-y-3">
                  <p className="text-sm text-gray-600 px-1">Welcome, {user?.name}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs cursor-default">
                      Professional Edition
                    </Badge>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className="flex items-center space-x-2 cursor-pointer"
                      size="sm"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          <span>Logging out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            {/* Mobile-optimized tabs */}
            <div className="w-full overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3 min-w-[300px] sm:w-auto lg:w-[400px] h-11 sm:h-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4 cursor-pointer">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="customers" className="text-xs sm:text-sm px-2 sm:px-4 cursor-pointer">
                  Customers
                </TabsTrigger>
                <TabsTrigger value="new-customer" className="text-xs sm:text-sm px-1 sm:px-4 cursor-pointer">
                  <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Order</span>
                  <span className="sm:hidden">New</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              {/* Mobile-optimized stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                      Total Customers
                    </CardTitle>
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalCustomers}</div>
                    <p className="text-xs text-gray-600">Active clients</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                      Pending Orders
                    </CardTitle>
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
                    <p className="text-xs text-gray-600">In progress</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                      Ready for Collection
                    </CardTitle>
                    <Scissors className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.readyForCollection}</div>
                    <p className="text-xs text-gray-600">Completed orders</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">
                      Collected
                    </CardTitle>
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.collected}</div>
                    <p className="text-xs text-gray-600">This month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Welcome card */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Welcome to TailorPro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Professional tailoring management system to help you manage your customers, orders, and measurements efficiently.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button 
                      onClick={() => setActiveTab("new-customer")}
                      className="bg-blue-600 hover:bg-blue-700 h-11 flex-1 sm:flex-initial cursor-pointer"
                      disabled={isCreating}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {isCreating ? 'Creating...' : 'Create New Order'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("customers")}
                      className="h-11 flex-1 sm:flex-initial cursor-pointer"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-center text-sm sm:text-base">
                      {isUpdating ? 'Updating customer...' : 'Deleting customer...'}
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