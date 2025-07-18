
export interface RequestFormData {
  make: string;
  model: string;
  year: string;
  part: string;
  description: string;
  phone: string;
  location: string;
  name: string;
  email: string;
}

export const initialFormData: RequestFormData = {
  make: '',
  model: '',
  year: '',
  part: '',
  description: '',
  phone: '',
  location: '',
  name: '',
  email: ''
};
