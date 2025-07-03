import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Request {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  description?: string;
}

interface RequestCardHeaderProps {
  request: Request & { photo_url?: string };
}

const RequestCardHeader = ({ request }: RequestCardHeaderProps) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {request.car_make} {request.car_model} {request.car_year}
          </CardTitle>
          <p className="text-orange-600 font-semibold text-base sm:text-lg mt-1">
            Part: {request.part_needed}
          </p>
          
          {/* Image display */}
          {request.photo_url && (
            <div className="mt-3">
              <img 
                src={request.photo_url} 
                alt={`${request.part_needed} for ${request.car_make} ${request.car_model}`}
                className="w-full max-w-xs h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Description display */}
          {request.description && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">
                {request.description}
              </p>
            </div>
          )}
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex-shrink-0">
          Active Request
        </Badge>
      </div>
    </CardHeader>
  );
};

export default RequestCardHeader;