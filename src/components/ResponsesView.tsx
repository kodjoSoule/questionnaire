import React, { useState, useEffect } from 'react';
import { Calendar, User, RefreshCw, AlertCircle, CheckCircle2, WifiOff, ServerCrash, Shield, ChevronDown, ChevronRight, Building, Users, TrendingUp, DollarSign, FileText, Shield as ShieldIcon } from 'lucide-react';
import { apiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const DEFAULT_USER_ID = '137a3368-ecf2-488a-a718-884a817c3ecb';

interface ResponseData {
  [key: string]: any;
}

interface ErrorInfo {
  message: string;
  icon: React.ReactNode;
  suggestion: string;
  type: 'network' | 'auth' | 'server' | 'notfound' | 'unknown';
}

interface ResponseSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  fields: string[];
  description: string;
}

const RESPONSE_SECTIONS: ResponseSection[] = [
  {
    title: 'Structure Juridique & Gouvernance',
    icon: <Building className="w-5 h-5" />,
    color: 'blue',
    description: 'Informations sur le statut juridique et la gouvernance de l\'entreprise',
    fields: [
      'legalStatus',
      'boardRequirement',
      'hasBoard',
      'ownersManaging',
      'charteredAccountantRequirement',
      'hasCharteredAccountant',
      'segregationSatisfaction',
      'managementView'
    ]
  },
  {
    title: 'Ressources Humaines',
    icon: <Users className="w-5 h-5" />,
    color: 'green',
    description: 'Gestion du personnel et des ressources humaines',
    fields: [
      'hasHRManager',
      'hasEmploymentContracts',
      'salaryPaymentDelays',
      'hasHRTools',
      'conduciveWorkEnvironment',
      'clearOrganizationalChart',
      'internalCareerDevelopment',
      'staffTrainingSystem',
      'industrialDisputes',
      'goodStandingSocialAdmin'
    ]
  },
  {
    title: 'Marché & Commercial',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'purple',
    description: 'Analyse du marché et stratégie commerciale',
    fields: [
      'marketStudyAvailable',
      'competitiveMarket',
      'growingMarket',
      'significantMarketShare',
      'knowCompetitors',
      'localMarketSales',
      'ogsSales',
      'cashSales',
      'marketingPlan',
      'directSales',
      'customerLoyaltySystem',
      'businessConcentration',
      'logisticArrangements',
      'onlinePresence',
      'differentiationFromCompetition',
      'impactOfLosingKeyCustomer'
    ]
  },
  {
    title: 'Finances & Contrôle',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'orange',
    description: 'Gestion financière et contrôle des coûts',
    fields: [
      'costControl',
      'hasNecessaryResources',
      'diversifiedRevenueSources',
      'outstandingReceivables',
      'adaptToSectorChanges',
      'impactOfChangingSuppliers',
      'substitutableProducts',
      'usesExternalFinancing',
      'seeksLoanForGrowth',
      'exploringGeographicalExpansion',
      'hasAccountingUnit',
      'hasAccountingSoftware',
      'financialStatementsAvailable',
      'auditedFinancialStatements',
      'outstandingBankLoans',
      'unpaidBills',
      'entrepreneurLiquidations',
      'internalControlSystem',
      'goodStandingTaxAuthorities'
    ]
  },
  {
    title: 'Opérations & Qualité',
    icon: <FileText className="w-5 h-5" />,
    color: 'indigo',
    description: 'Gestion des opérations et contrôle qualité',
    fields: [
      'hasSalesPoints',
      'inventoryManagementSystem',
      'ogsProducts',
      'verasolCertified',
      'qualifiedStaff',
      'identifiedSupplier',
      'marketAuthorizations',
      'qualityControlAndSurveys',
      'productQualityRating',
      'afterSalesServices',
      'hasStorages'
    ]
  },
  {
    title: 'Risques & Conformité',
    icon: <ShieldIcon className="w-5 h-5" />,
    color: 'red',
    description: 'Gestion des risques et conformité réglementaire',
    fields: [
      'riskAssessmentDone',
      'eshsPolicy',
      'environmentalDiagnosis',
      'eshsRiskManagementPlan',
      'safetyRiskCommunication',
      'wasteManagementPolicy',
      'healthSafetyTraining',
      'consistentWithCommunityValues',
      'grievanceRedressMechanism',
      'codeOfConduct',
      'defectiveProductsHandling'
    ]
  }
];

const ResponsesView: React.FC = () => {
  const [responses, setResponses] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const getErrorInfo = (err: any): ErrorInfo => {
    const errorMessage = err?.message || String(err);
    
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      return {
        message: 'Problème de connexion réseau',
        icon: <WifiOff className="w-5 h-5 text-red-400" />,
        suggestion: 'Vérifiez votre connexion internet et réessayez.',
        type: 'network'
      };
    }
    
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return {
        message: 'Erreur d\'authentification',
        icon: <Shield className="w-5 h-5 text-red-400" />,
        suggestion: 'Votre session a expiré. Veuillez vous reconnecter.',
        type: 'auth'
      };
    }
    
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return {
        message: 'Aucune réponse trouvée',
        icon: <AlertCircle className="w-5 h-5 text-orange-400" />,
        suggestion: 'Vous n\'avez pas encore soumis de réponses au questionnaire.',
        type: 'notfound'
      };
    }
    
    if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
      return {
        message: 'Erreur du serveur',
        icon: <ServerCrash className="w-5 h-5 text-red-400" />,
        suggestion: 'Le serveur rencontre des difficultés. Veuillez réessayer dans quelques minutes.',
        type: 'server'
      };
    }
    
    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      return {
        message: 'Accès non autorisé',
        icon: <Shield className="w-5 h-5 text-red-400" />,
        suggestion: 'Vous n\'avez pas les permissions nécessaires pour accéder à ces données.',
        type: 'auth'
      };
    }
    
    return {
      message: 'Erreur lors de la récupération des données',
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      suggestion: 'Une erreur inattendue s\'est produite. Veuillez réessayer ou contacter le support.',
      type: 'unknown'
    };
  };

  const fetchResponses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.fetchUserResponses(DEFAULT_USER_ID);
      setResponses(data);
    } catch (err) {
      const errorInfo = getErrorInfo(err);
      setError(errorInfo);
      console.error('Fetch responses error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const formatFieldName = (fieldName: string): string => {
    const fieldLabels: Record<string, string> = {
      legalStatus: 'Statut juridique',
      boardRequirement: 'Besoin d\'un conseil d\'administration',
      hasBoard: 'Conseil d\'administration en place',
      ownersManaging: 'Propriétaires gérant directement',
      charteredAccountantRequirement: 'Besoin d\'un expert-comptable',
      hasCharteredAccountant: 'Expert-comptable disponible',
      segregationSatisfaction: 'Satisfaction séparation des tâches',
      managementView: 'Vision managériale',
      hasHRManager: 'Responsable RH',
      hasEmploymentContracts: 'Contrats de travail formalisés',
      salaryPaymentDelays: 'Retards paiement salaires',
      hasHRTools: 'Outils de gestion RH',
      conduciveWorkEnvironment: 'Environnement de travail propice',
      clearOrganizationalChart: 'Organigramme clair',
      internalCareerDevelopment: 'Développement de carrière interne',
      staffTrainingSystem: 'Système de formation',
      industrialDisputes: 'Conflits industriels',
      goodStandingSocialAdmin: 'En règle avec administration sociale',
      marketStudyAvailable: 'Étude de marché disponible',
      competitiveMarket: 'Marché concurrentiel',
      growingMarket: 'Marché en croissance',
      significantMarketShare: 'Part de marché significative',
      knowCompetitors: 'Connaissance des concurrents',
      localMarketSales: 'Ventes marché local',
      ogsSales: 'Ventes OGS',
      cashSales: 'Ventes au comptant',
      marketingPlan: 'Plan marketing',
      directSales: 'Ventes directes',
      customerLoyaltySystem: 'Système de fidélisation',
      businessConcentration: 'Concentration des affaires',
      logisticArrangements: 'Arrangements logistiques',
      onlinePresence: 'Présence en ligne',
      differentiationFromCompetition: 'Différenciation concurrentielle',
      impactOfLosingKeyCustomer: 'Impact perte client clé',
      costControl: 'Contrôle des coûts',
      hasNecessaryResources: 'Ressources nécessaires',
      diversifiedRevenueSources: 'Sources de revenus diversifiées',
      outstandingReceivables: 'Créances en souffrance',
      adaptToSectorChanges: 'Adaptation aux changements sectoriels',
      impactOfChangingSuppliers: 'Impact changement fournisseurs',
      substitutableProducts: 'Produits substituables',
      usesExternalFinancing: 'Financement externe',
      seeksLoanForGrowth: 'Recherche prêt pour croissance',
      exploringGeographicalExpansion: 'Expansion géographique',
      hasSalesPoints: 'Points de vente',
      inventoryManagementSystem: 'Système gestion stocks',
      ogsProducts: 'Produits OGS',
      verasolCertified: 'Certification Verasol',
      qualifiedStaff: 'Personnel qualifié',
      identifiedSupplier: 'Fournisseur identifié',
      marketAuthorizations: 'Autorisations marché',
      qualityControlAndSurveys: 'Contrôle qualité et enquêtes',
      productQualityRating: 'Évaluation qualité produit',
      afterSalesServices: 'Services après-vente',
      hasStorages: 'Entrepôts',
      hasAccountingUnit: 'Unité comptable',
      hasAccountingSoftware: 'Logiciel comptable',
      financialStatementsAvailable: 'États financiers disponibles',
      auditedFinancialStatements: 'États financiers audités',
      outstandingBankLoans: 'Prêts bancaires en souffrance',
      unpaidBills: 'Factures impayées',
      entrepreneurLiquidations: 'Liquidations entrepreneuriales',
      internalControlSystem: 'Système contrôle interne',
      goodStandingTaxAuthorities: 'En règle avec autorités fiscales',
      riskAssessmentDone: 'Évaluation des risques effectuée',
      eshsPolicy: 'Politique ESHS',
      environmentalDiagnosis: 'Diagnostic environnemental',
      eshsRiskManagementPlan: 'Plan gestion risques ESHS',
      safetyRiskCommunication: 'Communication risques sécurité',
      wasteManagementPolicy: 'Politique gestion déchets',
      healthSafetyTraining: 'Formation santé sécurité',
      consistentWithCommunityValues: 'Cohérent avec valeurs communautaires',
      grievanceRedressMechanism: 'Mécanisme recours griefs',
      codeOfConduct: 'Code de conduite',
      defectiveProductsHandling: 'Gestion produits défectueux'
    };
    
    return fieldLabels[fieldName] || fieldName;
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    if (value === 'Yes') return 'Oui';
    if (value === 'No') return 'Non';
    if (value === 'Low') return 'Faible';
    if (value === 'Medium') return 'Moyen';
    if (value === 'High') return 'Élevé';
    if (value === 'Poor') return 'Médiocre';
    if (value === 'Fair') return 'Correct';
    if (value === 'Good') return 'Bon';
    if (value === 'Excellent') return 'Excellent';
    if (value === 'Strict') return 'Strict';
    if (value === 'Moderate') return 'Modéré';
    if (value === 'HighQuality') return 'Haute Qualité';
    if (value === 'Few') return 'Peu';
    return String(value);
  };

  const getErrorBgColor = (type: string) => {
    switch (type) {
      case 'network': return 'bg-blue-50 border-blue-400';
      case 'auth': return 'bg-yellow-50 border-yellow-400';
      case 'server': return 'bg-red-50 border-red-400';
      case 'notfound': return 'bg-orange-50 border-orange-400';
      default: return 'bg-red-50 border-red-400';
    }
  };

  const getErrorTextColor = (type: string) => {
    switch (type) {
      case 'network': return 'text-blue-600';
      case 'auth': return 'text-yellow-600';
      case 'server': return 'text-red-600';
      case 'notfound': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const getSectionColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      indigo: 'from-indigo-500 to-indigo-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getSectionBgColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      red: 'bg-red-50 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionResponses = (section: ResponseSection) => {
    if (!responses) return [];
    return section.fields
      .filter(field => responses[field] !== undefined && responses[field] !== null)
      .map(field => ({
        field,
        value: responses[field]
      }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Mes Réponses</h2>
                <p className="text-gray-600">Consultation des réponses soumises par étapes</p>
              </div>
            </div>
            <button
              onClick={fetchResponses}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className={`mb-6 p-6 border-l-4 rounded-lg ${getErrorBgColor(error.type)}`}>
              <div className="flex items-start space-x-3">
                {error.icon}
                <div className="flex-1">
                  <h4 className={`font-semibold ${getErrorTextColor(error.type)} mb-2`}>
                    {error.message}
                  </h4>
                  <p className={`text-sm ${getErrorTextColor(error.type)} opacity-80 mb-3`}>
                    {error.suggestion}
                  </p>
                  {error.type === 'notfound' && (
                    <div className="mt-3">
                      <button
                        onClick={() => window.location.reload()}
                        className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-md hover:bg-orange-200 transition-colors duration-200"
                      >
                        Aller au questionnaire
                      </button>
                    </div>
                  )}
                  {(error.type === 'network' || error.type === 'server') && (
                    <div className="mt-3">
                      <button
                        onClick={fetchResponses}
                        className={`text-sm px-3 py-1 rounded-md transition-colors duration-200 ${
                          error.type === 'network' 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Réessayer maintenant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {responses && !error ? (
            <div className="space-y-6">
              {/* Informations utilisateur */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    ID Utilisateur: {responses.userId || DEFAULT_USER_ID}
                  </span>
                </div>
                {responses.createdAt && (
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Soumis le: {new Date(responses.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Sections de réponses */}
              <div className="space-y-4">
                {RESPONSE_SECTIONS.map((section) => {
                  const sectionResponses = getSectionResponses(section);
                  const isExpanded = expandedSections.has(section.title);
                  
                  if (sectionResponses.length === 0) return null;

                  return (
                    <div key={section.title} className={`border-2 rounded-xl overflow-hidden ${getSectionBgColor(section.color)}`}>
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="w-full p-6 text-left hover:bg-white/50 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 bg-gradient-to-r ${getSectionColor(section.color)} rounded-lg flex items-center justify-center text-white`}>
                              {section.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {section.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {section.description}
                              </p>
                              <div className="flex items-center mt-2">
                                <span className="text-xs bg-white/70 text-gray-700 px-2 py-1 rounded-full">
                                  {sectionResponses.length} réponse{sectionResponses.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6">
                          <div className="bg-white rounded-lg p-4 space-y-3">
                            {sectionResponses.map(({ field, value }) => (
                              <div key={field} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 mb-1">
                                    {formatFieldName(field)}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    {formatValue(value)}
                                  </p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {RESPONSE_SECTIONS.every(section => getSectionResponses(section).length === 0) && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune réponse dans les données</h3>
                  <p className="text-gray-500 mb-4">Les données ont été récupérées mais ne contiennent pas de réponses au questionnaire.</p>
                  <button
                    onClick={fetchResponses}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Actualiser les données
                  </button>
                </div>
              )}
            </div>
          ) : !error && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune donnée disponible</h3>
              <p className="text-gray-500 mb-4">Aucune réponse n'a pu être récupérée pour cet utilisateur.</p>
              <button
                onClick={fetchResponses}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsesView;