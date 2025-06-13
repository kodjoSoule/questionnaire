import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const DEFAULT_USER_ID = '137a3368-ecf2-488a-a718-884a817c3ecb';

const SURVEY_QUESTIONS = [
  {
    id: 'legalStatus',
    question: 'Quel est le statut juridique de votre entreprise ?',
    type: 'radio',
    options: ['SA', 'SARL', 'EURL', 'SAS', 'Auto-entrepreneur', 'Autre']
  },
  {
    id: 'boardRequirement',
    question: 'Votre entreprise nécessite-t-elle un conseil d\'administration ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'hasBoard',
    question: 'Avez-vous un conseil d\'administration en place ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'ownersManaging',
    question: 'Les propriétaires gèrent-ils directement l\'entreprise ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'charteredAccountantRequirement',
    question: 'Avez-vous besoin d\'un expert-comptable ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'hasCharteredAccountant',
    question: 'Avez-vous un expert-comptable ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'segregationSatisfaction',
    question: 'Quel est votre niveau de satisfaction concernant la séparation des tâches ?',
    type: 'radio',
    options: ['Low', 'Medium', 'High']
  },
  {
    id: 'managementView',
    question: 'Comment évaluez-vous la vision managériale ?',
    type: 'radio',
    options: ['Poor', 'Fair', 'Good', 'Excellent']
  },
  {
    id: 'hasHRManager',
    question: 'Avez-vous un responsable des ressources humaines ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'hasEmploymentContracts',
    question: 'Avez-vous des contrats de travail formalisés ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'salaryPaymentDelays',
    question: 'Y a-t-il des retards dans le paiement des salaires ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'hasHRTools',
    question: 'Utilisez-vous des outils de gestion RH ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'conduciveWorkEnvironment',
    question: 'L\'environnement de travail est-il propice ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'clearOrganizationalChart',
    question: 'Avez-vous un organigramme clair ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'internalCareerDevelopment',
    question: 'Y a-t-il des opportunités de développement de carrière interne ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'staffTrainingSystem',
    question: 'Avez-vous un système de formation du personnel ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'industrialDisputes',
    question: 'Y a-t-il des conflits industriels ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'goodStandingSocialAdmin',
    question: 'Êtes-vous en règle avec l\'administration sociale ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'marketStudyAvailable',
    question: 'Avez-vous une étude de marché disponible ?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 'competitiveMarket',
    question: 'Le marché est-il concurrentiel ?',
    type: 'radio',
    options: ['Yes', 'No']
  }
];

export const useSurvey = () => {
  const [questions, setQuestions] = useState(SURVEY_QUESTIONS);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateResponse = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const goToNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = (step: number): boolean => {
    const currentQuestion = questions[step];
    return responses[currentQuestion.id] !== undefined && responses[currentQuestion.id] !== '';
  };

  const submitSurvey = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('userId', DEFAULT_USER_ID);
      formData.append('questionGroup', 'PREDIAGNOSTIC_QUESTIONS');

      // Ajouter toutes les réponses
      Object.entries(responses).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await apiService.submitResponse(formData);
      setIsSubmitted(true);
    } catch (err) {
      setError('Erreur lors de la soumission. Veuillez réessayer.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSurvey = () => {
    setCurrentStep(0);
    setResponses({});
    setIsSubmitted(false);
    setError(null);
  };

  return {
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
  };
};