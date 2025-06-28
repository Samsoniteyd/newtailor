export interface Customer {
  id: string;
  title?: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfOrder: string;
  dateOfCollection: string;
  status: 'pending' | 'in-progress' | 'ready' | 'collected';
  measurements: {
    tops: {
      chest: string;
      shoulders: string;
      sleeveLength: string;
      sleeveLengthShort: string;
      topLength: string;
      neck: string;
      tommy: string;
      hip: string;
    };
    trouser: {
      waist: string;
      length: string;
      lap: string;
      hip: string;
      base: string;
    };
    agbada: {
      length: string;
      sleeve: string;
    };
  };
  notes?: string;
  createdAt: string;
}
export interface CustomerFormProps {
  isEditing?: boolean;
  initialData?: Customer;
  onSubmit: (data: Customer) => void;
}