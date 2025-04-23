
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import { Student } from "@/types";

interface VoiceOverContextType {
  isVoiceOverEnabled: boolean;
  toggleVoiceOver: () => void;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const VoiceOverContext = createContext<VoiceOverContextType | undefined>(undefined);

export const useVoiceOver = () => {
  const context = useContext(VoiceOverContext);
  if (!context) {
    throw new Error("useVoiceOver must be used within a VoiceOverProvider");
  }
  return context;
};

export const VoiceOverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, updateUser } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Check if the user is a student and has voice over enabled
  const isVoiceOverEnabled = user?.role === "student" && (user as Student).isVoiceOverEnabled === true;

  const toggleVoiceOver = () => {
    if (user?.role === "student") {
      const updatedUser = {
        ...user,
        isVoiceOverEnabled: !isVoiceOverEnabled,
      };
      updateUser(updatedUser);
      toast({
        title: isVoiceOverEnabled ? "Voice over disabled" : "Voice over enabled",
        description: isVoiceOverEnabled 
          ? "Voice over has been disabled" 
          : "Voice over has been enabled for accessibility",
      });
    }
  };

  const speakText = (text: string) => {
    if (!isVoiceOverEnabled) return;
    
    // Cancel any ongoing speech
    stopSpeaking();
    
    // Use the Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Voice over error",
        description: "There was an error with the voice over service",
        variant: "destructive",
      });
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <VoiceOverContext.Provider
      value={{
        isVoiceOverEnabled,
        toggleVoiceOver,
        speakText,
        isSpeaking,
        stopSpeaking,
      }}
    >
      {children}
    </VoiceOverContext.Provider>
  );
};
