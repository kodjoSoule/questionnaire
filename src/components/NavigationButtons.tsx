import React from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canProceed: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  canProceed
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          currentStep === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
        }`}
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Précédent
      </button>

      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            !canProceed || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Envoi...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Soumettre
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            !canProceed
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
          }`}
        >
          Suivant
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;