import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/types/customer";
import { Save, X } from "lucide-react";

interface CustomerFormProps {
  customer?: Customer | null;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    dateOfOrder: new Date().toISOString().split('T')[0],
    dateOfCollection: '',
    status: 'pending',
    measurements: {
      tops: {
        chest: '',
        shoulders: '',
        sleeveLength: '',
        sleeveLengthShort: '',
        topLength: '',
        neck: '',
        tommy: '',
        hip: ''
      },
      trouser: {
        waist: '',
        length: '',
        lap: '',
        hip: '',
        base: ''
      },
      agbada: {
        length: '',
        sleeve: ''
      }
    },
    notes: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        dateOfOrder: customer.dateOfOrder,
        dateOfCollection: customer.dateOfCollection,
        status: customer.status,
        measurements: customer.measurements,
        notes: customer.notes || ''
      });
    }
  }, [customer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementChange = (section: keyof typeof formData.measurements, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [section]: {
          ...prev.measurements[section],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerData: Customer = {
      ...formData,
      id: customer?.id || '',
      createdAt: customer?.createdAt || new Date().toISOString()
    };
    onSave(customerData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-blue-50 border-b px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                DETAILED REQUISITION CARD
              </CardTitle>
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="sm:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
                  Customer Information
                </h3>
                
                {/* Mobile-first stacked layout, responsive grid for larger screens */}
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-gray-300 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfOrder" className="text-sm font-medium">Date Of Order *</Label>
                    <Input
                      id="dateOfOrder"
                      type="date"
                      value={formData.dateOfOrder}
                      onChange={(e) => handleInputChange('dateOfOrder', e.target.value)}
                      required
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfCollection" className="text-sm font-medium">Date Of Collection</Label>
                    <Input
                      id="dateOfCollection"
                      type="date"
                      value={formData.dateOfCollection}
                      onChange={(e) => handleInputChange('dateOfCollection', e.target.value)}
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="ready">Ready for Collection</SelectItem>
                        <SelectItem value="collected">Collected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Measurements Section */}
              <div className="space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
                  Measurements
                </h3>
                
                {/* Mobile: Stack all measurement cards, Desktop: Side by side */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* TOPS */}
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3 px-4">
                      <CardTitle className="text-base sm:text-lg font-semibold bg-gray-100 px-3 py-2 rounded">
                        TOPS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4">
                      {Object.entries(formData.measurements.tops).map(([key, value]) => (
                        <div key={key} className="space-y-1 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:items-center">
                          <Label className="text-sm capitalize border-b pb-1 sm:border-b-0 sm:pb-0">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <Input
                            value={value}
                            onChange={(e) => handleMeasurementChange('tops', key, e.target.value)}
                            className="h-9 sm:h-8 border-gray-300"
                            placeholder="inches"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* TROUSER/SKIRT */}
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3 px-4">
                      <CardTitle className="text-base sm:text-lg font-semibold bg-gray-100 px-3 py-2 rounded">
                        TROUSER/SKIRT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4">
                      {Object.entries(formData.measurements.trouser).map(([key, value]) => (
                        <div key={key} className="space-y-1 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:items-center">
                          <Label className="text-sm capitalize border-b pb-1 sm:border-b-0 sm:pb-0">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Label>
                          <Input
                            value={value}
                            onChange={(e) => handleMeasurementChange('trouser', key, e.target.value)}
                            className="h-9 sm:h-8 border-gray-300"
                            placeholder="inches"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* AGBADA - Full width */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3 px-4">
                    <CardTitle className="text-base sm:text-lg font-semibold bg-gray-100 px-3 py-2 rounded">
                      AGBADA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4">
                    <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                      {Object.entries(formData.measurements.agbada).map(([key, value]) => (
                        <div key={key} className="space-y-1 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:items-center">
                          <Label className="text-sm capitalize border-b pb-1 sm:border-b-0 sm:pb-0">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Label>
                          <Input
                            value={value}
                            onChange={(e) => handleMeasurementChange('agbada', key, e.target.value)}
                            className="h-9 sm:h-8 border-gray-300"
                            placeholder="inches"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-gray-300 min-h-[100px]"
                  rows={4}
                  placeholder="Any special requirements or notes..."
                />
              </div>

              {/* Action Buttons - Mobile responsive */}
              <div className="pt-4 border-t">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    className="w-full sm:w-auto h-11"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Customer
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerForm;
