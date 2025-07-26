
import { Part } from "@/types/Part";

export const filterParts = (parts: Part[], searchTerm: string, selectedMake: string, selectedModel: string, selectedYear: string): Part[] => {
  return parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMake = selectedMake === '' || part.make === selectedMake;
    const matchesModel = selectedModel === '' || part.model === selectedModel;
    const matchesYear = selectedYear === '' || part.year.includes(selectedYear);
    return matchesSearch && matchesMake && matchesModel && matchesYear;
  });
};

export const getUniqueMakes = (parts: Part[]): string[] => {
  return Array.from(new Set(parts.map(part => part.make)));
};

export const getUniqueModels = (parts: Part[], selectedMake: string): string[] => {
  const filteredParts = selectedMake ? parts.filter(part => part.make === selectedMake) : parts;
  return Array.from(new Set(filteredParts.map(part => part.model)));
};

export const getUniqueYears = (parts: Part[], selectedMake: string, selectedModel: string): string[] => {
  let filteredParts = parts;
  if (selectedMake) filteredParts = filteredParts.filter(part => part.make === selectedMake);
  if (selectedModel) filteredParts = filteredParts.filter(part => part.model === selectedModel);
  
  const years = new Set<string>();
  filteredParts.forEach(part => {
    // Handle year ranges like "2015-2018"
    if (part.year.includes('-')) {
      const [start, end] = part.year.split('-').map(y => parseInt(y));
      for (let year = start; year <= end; year++) {
        years.add(year.toString());
      }
    } else {
      years.add(part.year);
    }
  });
  
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
};

