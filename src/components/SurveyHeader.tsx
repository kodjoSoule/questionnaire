import React from 'react';
import { ClipboardList } from 'lucide-react';

const SurveyHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <ClipboardList className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Questionnaire de Pré-diagnostic
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Complétez ce questionnaire pour évaluer votre situation actuelle. 
        Vos réponses nous aideront à mieux comprendre vos besoins.
      </p>
    </div>
  );
};

export default SurveyHeader;