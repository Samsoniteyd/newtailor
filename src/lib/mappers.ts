import { Customer } from '../types/customer';
import { Requisition, CreateRequisitionData } from '../types';

export const customerToRequisition = (customer: Customer): CreateRequisitionData => {
  // Helper function to convert string to number or undefined
  const toNumber = (value: string): number | undefined => {
    if (!value || value.trim() === '') return undefined;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  return {
    name: customer.name,
    description: customer.notes || '',
    measurements: {
      chest: toNumber(customer.measurements.tops.chest),
      shoulders: toNumber(customer.measurements.tops.shoulders),
      sleeveLengthLong: toNumber(customer.measurements.tops.sleeveLength),
      sleeveLengthShort: toNumber(customer.measurements.tops.sleeveLengthShort),
      topLength: toNumber(customer.measurements.tops.topLength),
      neck: toNumber(customer.measurements.tops.neck),
      tommy: toNumber(customer.measurements.tops.tommy),
      hip: toNumber(customer.measurements.tops.hip),
      waist: toNumber(customer.measurements.trouser.waist),
      length: toNumber(customer.measurements.trouser.length),
      lap: toNumber(customer.measurements.trouser.lap),
      base: toNumber(customer.measurements.trouser.base),
      agbadaLength: toNumber(customer.measurements.agbada.length),
      agbadaSleeve: toNumber(customer.measurements.agbada.sleeve),
    },
    contactInfo: {
      email: customer.email || '',
      phone: customer.phone || '',
    },
    dueDate: customer.dateOfCollection || undefined,
  };
};

export const requisitionToCustomer = (requisition: Requisition): Customer => {
  return {
    id: requisition._id,
    name: requisition.name,
    email: requisition.contactInfo.email,
    phone: requisition.contactInfo.phone,
    dateOfOrder: requisition.createdAt.split('T')[0],
    dateOfCollection: requisition.dueDate ? requisition.dueDate.split('T')[0] : '',
    status: mapRequisitionStatusToCustomerStatus(requisition.status),
    measurements: {
      tops: {
        chest: requisition.measurements.chest?.toString() || '',
        shoulders: requisition.measurements.shoulders?.toString() || '',
        sleeveLength: requisition.measurements.sleeveLengthLong?.toString() || '',
        sleeveLengthShort: requisition.measurements.sleeveLengthShort?.toString() || '',
        topLength: requisition.measurements.topLength?.toString() || '',
        neck: requisition.measurements.neck?.toString() || '',
        tommy: requisition.measurements.tommy?.toString() || '',
        hip: requisition.measurements.hip?.toString() || '',
      },
      trouser: {
        waist: requisition.measurements.waist?.toString() || '',
        length: requisition.measurements.length?.toString() || '',
        lap: requisition.measurements.lap?.toString() || '',
        hip: requisition.measurements.hip?.toString() || '',
        base: requisition.measurements.base?.toString() || '',
      },
      agbada: {
        length: requisition.measurements.agbadaLength?.toString() || '',
        sleeve: requisition.measurements.agbadaSleeve?.toString() || '',
      },
    },
    notes: requisition.description || '',
    createdAt: requisition.createdAt,
  };
};

const mapRequisitionStatusToCustomerStatus = (status: string): 'pending' | 'in-progress' | 'ready' | 'collected' => {
  switch (status) {
    case 'pending': return 'pending';
    case 'in-progress': return 'in-progress';
    case 'completed': return 'ready';
    case 'cancelled': return 'pending';
    default: return 'pending';
  }
}; 