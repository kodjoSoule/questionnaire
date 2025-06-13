import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface SuccessMessageProps {
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Questionnaire Soumis !
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Merci d'avoir complété le questionnaire. Vos réponses ont été enregistrées avec succès.
        </p>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Nouveau Questionnaire
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;