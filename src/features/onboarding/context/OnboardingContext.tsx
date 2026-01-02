import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const DEBUG_MODE = process.env.EXPO_PUBLIC_ONBOARDING_DEBUG_MODE === 'true';

export interface OnboardingData {
  fullName?: string;
  age?: number;
  gender?: string;
  weight?: number;
  weightUnit?: string;
  ancestryOrigins?: string[];
  ancestryInfluence?: string;
  allergies?: string[];
  customAllergies?: string[];
  sensitivities?: string;
  dietaryBaseline?: string;
  nutritionContext?: string;
  nutritionTargets?: {
    calories?: number;
    protein?: number;
  };
  completedAt?: number;
}

interface OnboardingContextType {
  data: OnboardingData;
  step: number;
  updateData: (newData: Partial<OnboardingData>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>({});
  const [step, setStep] = useState(0);
  const isLoaded = useRef(false);

  const saveOnboardingData = useMutation(api.onboarding.saveOnboardingData);
  const existingData = useQuery(api.onboarding.getOnboardingData);

  // Load existing data
  useEffect(() => {
    if (existingData !== undefined && !isLoaded.current) {
      if (existingData) {
        // We have data
        const { _id, _creationTime, userId, ...rest } = existingData;
        setData((prev) => ({ ...prev, ...rest }));
        if (existingData.step !== undefined) {
          setStep(existingData.step);
        }
      }
      isLoaded.current = true;
    }
  }, [existingData]);

  const updateData = useCallback((newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  const persistData = useCallback(async (currentStep: number, currentData: OnboardingData) => {
    if (DEBUG_MODE) {
      console.log('[Onboarding] Saving:', { step: currentStep, data: currentData });
      return;
    }
    
    try {
      await saveOnboardingData({
        step: currentStep,
        data: {
          fullName: currentData.fullName,
          age: currentData.age,
          gender: currentData.gender,
          weight: currentData.weight,
          weightUnit: currentData.weightUnit,
          ancestryOrigins: currentData.ancestryOrigins,
          ancestryInfluence: currentData.ancestryInfluence,
          allergies: currentData.allergies,
          customAllergies: currentData.customAllergies,
          sensitivities: currentData.sensitivities,
          dietaryBaseline: currentData.dietaryBaseline,
          nutritionContext: currentData.nutritionContext,
          nutritionTargets: currentData.nutritionTargets,
          completedAt: currentData.completedAt,
        },
      });
    } catch (error) {
      console.error("[Onboarding] Failed to save progress:", error);
    }
  }, [saveOnboardingData]);

  const nextStep = useCallback(() => {
    setStep((prev) => {
      const next = prev + 1;
      return next;
    });
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Auto-save when step changes (and data is ready)
  useEffect(() => {
    if (isLoaded.current || DEBUG_MODE) {
       // Save whenever step updates. 
       // We add a small delay or just save.
       // Since step update usually comes after data update, this should capture the latest data.
       persistData(step, data);
    }
  }, [step, persistData, data]);

  return (
    <OnboardingContext.Provider value={{
      data,
      step,
      updateData,
      setStep,
      nextStep,
      prevStep,
      isLoading: existingData === undefined && !DEBUG_MODE,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
