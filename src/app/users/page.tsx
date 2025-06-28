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
import { Users, PlusCircle, Scissors, Calendar, LogOut, Menu, X, CheckCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useRequisitions } from '../../hooks/useRequisitions';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { customerToRequisition, requisitionToCustomer } from '../../lib/mappers';
import { Requisition } from '@/types';

const UsersPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
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
  const [viewingCustomers, setViewingCustomers] = useState<Customer[] | null>(null);
  const [viewingRequisitions, setViewingRequisitions] = useState<Requisition[] | null>(null);
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
            toast({
              variant: "success",
              title: "Customer Updated Successfully!",
              description: `${customer.name}'s details have been updated successfully.`,
            });
          }
        }
      );
    } else {
      createRequisition(requisitionData, {
        onSuccess: () => {
          setActiveTab("customers");
          toast({
            variant: "success",
            title: "New Customer Created Successfully!",
            description: `${customer.name}'s measurements and details have been saved successfully.`,
          });
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

  const handleViewRequisition = (requisitions: Requisition[]) => {
    const customers = requisitions.map(requisitionToCustomer);
    setViewingCustomers(customers);
    setViewingRequisitions(requisitions);
  };

  const handleEditIndividualOrder = (orderId: string) => {
    const requisition = viewingRequisitions?.find(req => req._id === orderId);
    if (requisition) {
      handleEditRequisition(requisition);
      setViewingCustomers(null);
      setViewingRequisitions(null);
    }
  };

  const handleDeleteIndividualOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this specific order?')) {
      await handleDeleteRequisition(orderId);
      
      if (viewingRequisitions) {
        const updatedRequisitions = viewingRequisitions.filter(req => req._id !== orderId);
        if (updatedRequisitions.length === 0) {
          setViewingCustomers(null);
          setViewingRequisitions(null);
        } else {
          const updatedCustomers = updatedRequisitions.map(requisitionToCustomer);
          setViewingCustomers(updatedCustomers);
          setViewingRequisitions(updatedRequisitions);
        }
      }
    }
  };

  const closeViewModal = () => {
    setViewingCustomers(null);
    setViewingRequisitions(null);
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
                onView={handleViewRequisition}
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

              {/* Customer View Modal */}
              {viewingCustomers && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                        <span className="hidden sm:inline">Customer Details</span>
                        <span className="sm:hidden">Details</span>
                        {viewingCustomers.length > 1 && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            {viewingCustomers.length} orders
                          </Badge>
                        )}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeViewModal}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                      {/* Customer Information - Show from latest order */}
                      <div className="space-y-4 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-6 sm:space-y-0">
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
                            Customer Information
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-500">Name</label>
                              <p className="text-sm sm:text-base font-medium text-gray-900">{viewingCustomers[0].name}</p>
                            </div>
                            {viewingCustomers[0].email && (
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
                                <p className="text-sm sm:text-base text-gray-900 break-all">{viewingCustomers[0].email}</p>
                              </div>
                            )}
                            {viewingCustomers[0].phone && (
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-sm sm:text-base text-gray-900">{viewingCustomers[0].phone}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* All Measurements - Display each order separately with individual actions */}
                      <div className="space-y-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
                          All Measurements ({viewingCustomers.length} {viewingCustomers.length === 1 ? 'order' : 'orders'})
                        </h3>
                        
                        {viewingCustomers.map((customer, index) => (
                          <Card key={customer.id} className="border-2 border-gray-200">
                            <CardHeader className="bg-gray-50">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex-1">
                                  <CardTitle className="text-sm sm:text-base">
                                    Order #{index + 1} - {new Date(customer.dateOfOrder).toLocaleDateString()}
                                  </CardTitle>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <Badge className={`text-xs ${
                                      customer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      customer.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                      customer.status === 'ready' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {customer.status.replace('-', ' ').toUpperCase()}
                                    </Badge>
                                    {customer.dateOfCollection && (
                                      <span className="text-xs text-gray-500">
                                        Collection: {new Date(customer.dateOfCollection).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Individual Order Actions */}
                                <div className="flex flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditIndividualOrder(customer.id)}
                                    className="flex items-center space-x-1 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit className="h-3 w-3" />
                                    <span className="text-xs">Edit</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteIndividualOrder(customer.id)}
                                    className="flex items-center space-x-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span className="text-xs">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* TOPS */}
                                <Card className="border">
                                  <CardHeader className="pb-2 px-3">
                                    <CardTitle className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                                      TOPS
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2 px-3">
                                    {Object.entries(customer.measurements.tops).map(([key, value]) => (
                                      <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                                        <span className="text-xs font-medium text-gray-600 capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                        <span className="text-xs text-gray-900 font-medium">
                                          {value || '0'}"
                                        </span>
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>

                                {/* TROUSER/SKIRT */}
                                <Card className="border">
                                  <CardHeader className="pb-2 px-3">
                                    <CardTitle className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                                      TROUSER/SKIRT
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2 px-3">
                                    {Object.entries(customer.measurements.trouser).map(([key, value]) => (
                                      <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                                        <span className="text-xs font-medium text-gray-600 capitalize">
                                          {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </span>
                                        <span className="text-xs text-gray-900 font-medium">
                                          {value || '0'}"
                                        </span>
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>

                                {/* AGBADA */}
                                <Card className="border">
                                  <CardHeader className="pb-2 px-3">
                                    <CardTitle className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                                      AGBADA
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2 px-3">
                                    {Object.entries(customer.measurements.agbada).map(([key, value]) => (
                                      <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                                        <span className="text-xs font-medium text-gray-600 capitalize">
                                          {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </span>
                                        <span className="text-xs text-gray-900 font-medium">
                                          {value || '0'}"
                                        </span>
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Notes for this order */}
                              {customer.notes && (
                                <div className="mt-4 pt-3 border-t">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                                  <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 pt-3 sm:pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={closeViewModal}
                          className="flex items-center justify-center space-x-2 h-10 sm:h-auto"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="new-customer">
              
              <CustomerForm 
                customer={editingCustomer}
                customers={customers}
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