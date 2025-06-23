
export interface RequestFormData {
  make: string;
  model: string;
  year: string;
  part: string;
  description: string;
  phone: string;
  location: string;
}

export const initialFormData: RequestFormData = {
  make: '',
  model: '',
  year: '',
  part: '',
  description: '',
  phone: '',
  location: ''
};
