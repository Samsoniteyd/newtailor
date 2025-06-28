import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "@/types/customer";
import { Requisition } from "@/types";
import { requisitionToCustomer } from "@/lib/mappers";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Filter, SlidersHorizontal, Eye, Grid3X3, List } from "lucide-react";

interface CustomerListProps {
  requisitions: Requisition[];
  onEdit: (requisition: Requisition) => void;
  onView: (requisitions: Requisition[]) => void;
  onDelete: (id: string) => void;
}

interface GroupedCustomer {
  name: string;
  email: string;
  phone: string;
  measurementCount: number;
  latestOrder: Customer;
  allRequisitions: Requisition[];
}

const CustomerList: React.FC<CustomerListProps> = ({ requisitions, onEdit, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateOfOrder');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Group customers by name and email
  const groupedCustomers = useMemo(() => {
    const customers = requisitions.map(requisitionToCustomer);
    const customerMap = new Map<string, GroupedCustomer>();

    customers.forEach(customer => {
      const key = `${customer.name.toLowerCase()}-${(customer.email || '').toLowerCase()}`;
      const requisition = requisitions.find(req => req._id === customer.id);
      
      if (customerMap.has(key)) {
        const existing = customerMap.get(key)!;
        existing.measurementCount += 1;
        existing.allRequisitions.push(requisition!);
        
        // Update with latest order if this one is more recent
        if (new Date(customer.dateOfOrder) > new Date(existing.latestOrder.dateOfOrder)) {
          existing.latestOrder = customer;
          existing.phone = customer.phone || existing.phone;
        }
      } else {
        customerMap.set(key, {
          name: customer.name,
          email: customer.email || '',
          phone: customer.phone || '',
          measurementCount: 1,
          latestOrder: customer,
          allRequisitions: [requisition!]
        });
      }
    });

    return Array.from(customerMap.values());
  }, [requisitions]);

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = groupedCustomers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || customer.latestOrder.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | Date = '';
      let bValue: string | Date = '';

      if (sortBy === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortBy === 'dateOfOrder') {
        aValue = new Date(a.latestOrder.dateOfOrder);
        bValue = new Date(b.latestOrder.dateOfOrder);
      } else if (sortBy === 'dateOfCollection') {
        aValue = new Date(a.latestOrder.dateOfCollection || '9999-12-31');
        bValue = new Date(b.latestOrder.dateOfCollection || '9999-12-31');
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [groupedCustomers, searchTerm, sortBy, sortOrder, statusFilter]);

  // Pagination calculations
  const totalItems = filteredAndSortedCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredAndSortedCustomers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'collected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (customer: GroupedCustomer) => {
    // Edit the latest order
    const requisition = customer.allRequisitions.find(req => req._id === customer.latestOrder.id);
    if (requisition) {
      onEdit(requisition);
    }
  };

  const handleView = (customer: GroupedCustomer) => {
    onView(customer.allRequisitions);
  };

  const handleDelete = (customer: GroupedCustomer) => {
    // Delete the latest order
    onDelete(customer.latestOrder.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-base sm:text-lg">Customer Management</span>
            </CardTitle>
            
            {/* View toggles and mobile filter toggle */}
            <div className="flex items-center space-x-2">
              {/* View Type Toggle - Desktop */}
              <div className="hidden sm:flex items-center border rounded-lg p-1 bg-gray-50">
                <Button
                  variant={viewType === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile View Toggle */}
          <div className="flex sm:hidden justify-center mt-3">
            <div className="flex items-center border rounded-lg p-1 bg-gray-50">
              <Button
                variant={viewType === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('grid')}
                className="h-8 px-3 text-xs"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewType === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('list')}
                className="h-8 px-3 text-xs"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search Bar - Always visible */}
          <div className="mb-4">
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11"
            />
          </div>

          {/* Filters - Collapsible on mobile */}
          <div className={`space-y-3 sm:space-y-0 ${showFilters ? 'block' : 'hidden sm:block'}`}>
            {/* Mobile: Stacked filters, Desktop: Horizontal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="collected">Collected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="dateOfOrder">Order Date</SelectItem>
                  <SelectItem value="dateOfCollection">Collection Date</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 per page</SelectItem>
                  <SelectItem value="9">9 per page</SelectItem>
                  <SelectItem value="12">12 per page</SelectItem>
                  <SelectItem value="24">24 per page</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear filters button */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSortBy('dateOfOrder');
                  setSortOrder('desc');
                  setCurrentPage(1);
                }}
                className="h-11"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Results info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 mb-4 space-y-2 sm:space-y-0">
            <div>
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} customers
            </div>
            {totalPages > 1 && (
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {currentCustomers.length === 0 ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No customers found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Customer Display - Grid or List View */}
          {viewType === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentCustomers.map((customer, index) => (
                <Card key={`${customer.name}-${customer.email}-${index}`} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {customer.name}
                        </CardTitle>
                        <div className="space-y-1 mt-2">
                          {customer.email && (
                            <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                          )}
                          {customer.phone && (
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={`${getStatusColor(customer.latestOrder.status)} text-xs flex-shrink-0`}>
                          {customer.latestOrder.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {customer.measurementCount > 1 && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {customer.measurementCount} orders
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Latest Order</p>
                        <p className="font-medium">{formatDate(customer.latestOrder.dateOfOrder)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Collection Date</p>
                        <p className="font-medium">{formatDate(customer.latestOrder.dateOfCollection)}</p>
                      </div>
                    </div>

                    {customer.latestOrder.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">Latest Notes</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{customer.latestOrder.notes}</p>
                      </div>
                    )}

                    {/* Mobile-friendly buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(customer)}
                        className="flex items-center justify-center space-x-1 h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View {customer.measurementCount > 1 ? 'All' : ''}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                        className="flex items-center justify-center space-x-1 h-9"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit Latest</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(customer)}
                        className="flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {currentCustomers.map((customer, index) => (
                <Card key={`${customer.name}-${customer.email}-${index}`} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Customer Info */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                            {customer.measurementCount > 1 && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                {customer.measurementCount}
                              </Badge>
                            )}
                          </div>
                          {customer.email && (
                            <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                          )}
                          {customer.phone && (
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          )}
                        </div>
                        
                        <div className="text-sm">
                          <p className="text-gray-500">Latest Order</p>
                          <p className="font-medium">{formatDate(customer.latestOrder.dateOfOrder)}</p>
                        </div>
                        
                        <div className="text-sm">
                          <p className="text-gray-500">Collection Date</p>
                          <p className="font-medium">{formatDate(customer.latestOrder.dateOfCollection)}</p>
                        </div>
                        
                        <div className="flex items-start">
                          <Badge className={`${getStatusColor(customer.latestOrder.status)} text-xs`}>
                            {customer.latestOrder.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row gap-2 sm:flex-col lg:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(customer)}
                          className="flex items-center space-x-1 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden sm:inline">View {customer.measurementCount > 1 ? 'All' : ''}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                          className="flex items-center space-x-1 h-8"
                        >
                          <Edit className="h-3 w-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(customer)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>

                    {/* Notes in list view */}
                    {customer.latestOrder.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500">Latest Notes</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{customer.latestOrder.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination - Mobile optimized */}
          {totalPages > 1 && (
            <Card className="bg-white shadow-sm">
              <CardContent className="py-4">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  {/* Pagination controls */}
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1 h-9 px-2 sm:px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    
                    {/* Page numbers - Responsive */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 2) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNumber = totalPages - 2 + i;
                        } else {
                          pageNumber = currentPage - 1 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="w-9 h-9 p-0 text-xs sm:text-sm"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                      {totalPages > 3 && currentPage < totalPages - 1 && (
                        <>
                          <span className="text-gray-400 px-1">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="w-9 h-9 p-0 text-xs sm:text-sm"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1 h-9 px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Total count */}
                  <div className="text-sm text-gray-500 text-center sm:text-right">
                    {totalItems} total customers
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerList;
