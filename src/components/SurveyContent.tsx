import React from 'react';
import { useSurvey } from '../hooks/useSurvey';
import LoadingSpinner from './LoadingSpinner';
import SurveyHeader from './SurveyHeader';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import NavigationButtons from './NavigationButtons';
import SuccessMessage from './SuccessMessage';

const SurveyContent: React.FC = () => {
  const {
    questions,
    currentStep,
    responses,
    isLoading,
    isSubmitting,
    isSubmitted,
    error,
    updateResponse,
    goToNext,
    goToPrevious,
    canProceed,
    submitSurvey,
    resetSurvey
  } = useSurvey();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isSubmitted) {
    return <SuccessMessage onReset={resetSurvey} />;
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-4xl mx-auto">
      <SurveyHeader />
      
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <ProgressBar current={currentStep + 1} total={questions.length} />
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <QuestionCard
          question={currentQuestion.question}
          type={currentQuestion.type}
          options={currentQuestion.options}
          value={responses[currentQuestion.id] || ''}
          onChange={(value) => updateResponse(currentQuestion.id, value)}
          fieldName={currentQuestion.id}
        />

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={questions.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onSubmit={submitSurvey}
          isSubmitting={isSubmitting}
          canProceed={canProceed(currentStep)}
        />
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          Toutes vos réponses sont sécurisées et confidentielles
        </p>
      </div>
    </div>
  );
};

export default SurveyContent;