import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, MessageCircle } from "lucide-react";

const RequestSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("success.title", "Request Submitted Successfully!")}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {t("success.description", "Your car part request has been submitted and sellers in your area are being notified. You'll receive offers soon!")}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            {t("success.whatNext", "What happens next?")}
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• {t("success.step1", "Sellers will review your request")}</li>
            <li>• {t("success.step2", "You'll receive offers via phone/email")}</li>
            <li>• {t("success.step3", "Compare offers and choose the best one")}</li>
            <li>• {t("success.step4", "Complete your purchase securely")}</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Home className="h-4 w-4 mr-2" />
            {t("success.backHome", "Back to Home")}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate("/requested-car-parts")}
            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("success.viewOffers", "View Available Parts")}
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {t("success.emailNote", "Check your email for account setup instructions and updates on your request.")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestSuccess;