import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Loader2, Send, Keyboard } from 'lucide-react';
import { parseWorkoutCommand } from '../services/geminiService';
import { ExerciseLog } from '../types';

interface VoiceInputProps {
  onExercisesParsed: (exercises: ExerciseLog[]) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onExercisesParsed }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  
  // Use a ref to hold the recognition instance
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Fix: Cast window to any to access webkitSpeechRecognition which is not standard in generic Window interface
    // This resolves "This expression is not constructable" error.
    if (typeof window !== 'undefined') {
      const win = window as any;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Voice recognition not supported in this browser. Please try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  const handleProcess = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const result = await parseWorkoutCommand(transcript);
      if (result && result.exercises) {
        // Transform AI result to internal ExerciseLog format
        const newLogs: ExerciseLog[] = result.exercises.map((ex) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: ex.name,
          sets: ex.sets.map((s) => ({
            id: Math.random().toString(36).substr(2, 9),
            reps: s.reps,
            weight: s.weight,
            unit: (s.unit as 'kg' | 'lbs') || 'kg',
            completed: true
          }))
        }));
        onExercisesParsed(newLogs);
        setTranscript('');
      }
    } catch (e) {
      console.error("Failed to process command", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-card p-4 rounded-xl border border-gray-700 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-200 font-semibold text-sm uppercase tracking-wider">
          {mode === 'voice' ? 'AI Voice Assistant' : 'AI Text Command'}
        </h3>
        <button 
          onClick={() => setMode(mode === 'voice' ? 'text' : 'voice')}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          {mode === 'voice' ? <Keyboard size={18} /> : <Mic size={18} />}
        </button>
      </div>

      <div className="relative">
        {mode === 'voice' ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <button
              onClick={toggleListening}
              className={`p-6 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500/20 text-red-500 ring-4 ring-red-500/30 animate-pulse-fast' 
                  : 'bg-primary/20 text-primary hover:bg-primary/30'
              }`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            <p className="text-gray-400 text-sm h-6">
              {isListening ? "Listening..." : "Tap to speak command"}
            </p>
          </div>
        ) : (
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="e.g., Log 3 sets of Bench Press 100kg for 8 reps"
            className="w-full bg-dark text-white p-3 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-24"
          />
        )}
      </div>

      {/* Transcript Display & Actions */}
      {transcript && mode === 'voice' && (
        <div className="mt-3 p-3 bg-dark/50 rounded border border-gray-700">
          <p className="text-gray-300 italic">"{transcript}"</p>
        </div>
      )}

      {transcript && (
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="mt-4 w-full bg-primary text-dark font-bold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Processing with Gemini...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Log Workout</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default VoiceInput;