
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/types/customer";
import { Save } from "lucide-react";

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
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-xl font-bold text-center text-gray-800">
            DETAILED REQUISITION CARD
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfOrder" className="text-sm font-medium">Date Of Order *</Label>
                <Input
                  id="dateOfOrder"
                  type="date"
                  value={formData.dateOfOrder}
                  onChange={(e) => handleInputChange('dateOfOrder', e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfCollection" className="text-sm font-medium">Date Of Collection</Label>
                <Input
                  id="dateOfCollection"
                  type="date"
                  value={formData.dateOfCollection}
                  onChange={(e) => handleInputChange('dateOfCollection', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                  <SelectTrigger>
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

            <Separator />

            {/* Measurements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TOPS */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold bg-gray-100 px-3 py-2 rounded">TOPS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(formData.measurements.tops).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-3 items-center">
                      <Label className="text-sm capitalize border-b pb-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <Input
                        value={value}
                        onChange={(e) => handleMeasurementChange('tops', key, e.target.value)}
                        className="h-8 border-gray-300"
                        placeholder="inches"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* TROUSER/SKIRT */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold bg-gray-100 px-3 py-2 rounded">TROUSER/SKIRT</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(formData.measurements.trouser).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-3 items-center">
                      <Label className="text-sm capitalize border-b pb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        value={value}
                        onChange={(e) => handleMeasurementChange('trouser', key, e.target.value)}
                        className="h-8 border-gray-300"
                        placeholder="inches"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AGBADA */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold bg-gray-100 px-3 py-2 rounded">AGBADA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.measurements.agbada).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-3 items-center">
                      <Label className="text-sm capitalize border-b pb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        value={value}
                        onChange={(e) => handleMeasurementChange('agbada', key, e.target.value)}
                        className="h-8 border-gray-300"
                        placeholder="inches"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="border-gray-300"
                rows={3}
                placeholder="Any special requirements or notes..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
