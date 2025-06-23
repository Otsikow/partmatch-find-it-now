
import { Part } from "@/types/Part";

export const filterParts = (parts: Part[], searchTerm: string, selectedMake: string): Part[] => {
  return parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMake = selectedMake === '' || part.make === selectedMake;
    return matchesSearch && matchesMake;
  });
};

export const getUniqueMakes = (parts: Part[]): string[] => {
  return Array.from(new Set(parts.map(part => part.make)));
};
