import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Save, Clock, Pause, Play, X, Dumbbell } from 'lucide-react';
import { ExerciseLog, WorkoutSession, Routine } from '../types';
import VoiceInput from './VoiceInput';

interface WorkoutLoggerProps {
  onSaveWorkout: (workout: WorkoutSession) => void;
  initialRoutine?: Routine | null;
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ onSaveWorkout, initialRoutine }) => {
  const [sessionName, setSessionName] = useState('Evening Workout');
  const [startTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  
  // Manual Entry Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualWeight, setManualWeight] = useState(20);
  const [manualReps, setManualReps] = useState(10);

  // Initialize from routine if provided
  useEffect(() => {
    if (initialRoutine) {
      setSessionName(initialRoutine.name);
      
      const routineExercises: ExerciseLog[] = initialRoutine.exercises.map(ex => ({
        id: Math.random().toString(36).substr(2, 9),
        name: ex.name,
        sets: Array.from({ length: ex.sets }).map(() => ({
          id: Math.random().toString(36).substr(2, 9),
          reps: ex.reps,
          weight: 0, // Default to 0, or user fills in
          unit: 'kg',
          completed: false
        }))
      }));
      setExercises(routineExercises);
    }
  }, [initialRoutine]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoiceData = (newExercises: ExerciseLog[]) => {
    setExercises(prev => [...prev, ...newExercises]);
  };

  const toggleSetCompletion = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex].completed = !newExercises[exerciseIndex].sets[setIndex].completed;
    setExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const prevSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({
      id: Math.random().toString(36),
      reps: prevSet ? prevSet.reps : 10,
      weight: prevSet ? prevSet.weight : 20,
      unit: 'kg',
      completed: false
    });
    setExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    if (exercises.length === 0) return;
    const workout: WorkoutSession = {
      id: Math.random().toString(36),
      startTime,
      endTime: Date.now(),
      name: sessionName,
      exercises
    };
    onSaveWorkout(workout);
  };

  const openManualModal = () => {
    setManualName('');
    setManualWeight(20);
    setManualReps(10);
    setIsAddModalOpen(true);
  };

  const saveManualExercise = () => {
    if (!manualName.trim()) return;

    const newExercise: ExerciseLog = {
      id: Math.random().toString(36).substr(2, 9),
      name: manualName,
      sets: [
        {
          id: Math.random().toString(36).substr(2, 9),
          weight: manualWeight,
          reps: manualReps,
          unit: 'kg',
          completed: false
        }
      ]
    };

    setExercises(prev => [...prev, newExercise]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-dark z-10 py-2 border-b border-gray-800">
        <div>
           <input 
             type="text" 
             value={sessionName} 
             onChange={(e) => setSessionName(e.target.value)}
             className="bg-transparent text-xl font-bold text-white focus:outline-none focus:border-b border-primary w-full"
           />
           <div className="flex items-center text-gray-400 text-sm mt-1 space-x-3">
             <div className="flex items-center">
               <Clock size={14} className="mr-1" />
               <span className="tabular-nums">Duration: {formatTime(duration)}</span>
             </div>
             <button 
               onClick={() => setIsTimerRunning(!isTimerRunning)} 
               className="text-gray-500 hover:text-white focus:outline-none"
               title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
             >
               {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
             </button>
           </div>
        </div>
        <button 
          onClick={handleFinish}
          disabled={exercises.length === 0}
          className="bg-primary text-dark font-bold px-4 py-2 rounded-lg flex items-center space-x-1 disabled:opacity-50 hover:bg-emerald-400 transition"
        >
          <Save size={18} />
          <span>Finish</span>
        </button>
      </div>

      {/* Voice Assistant */}
      <VoiceInput onExercisesParsed={handleVoiceData} />

      {/* Exercises List */}
      <div className="space-y-6">
        {exercises.map((exercise, exIndex) => (
          <div key={exercise.id} className="bg-card rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-3 bg-gray-800/50 flex justify-between items-center border-b border-gray-700">
              <h3 className="font-bold text-blue-400 text-lg">{exercise.name}</h3>
              <button 
                onClick={() => removeExercise(exIndex)}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="p-2">
              <div className="grid grid-cols-10 gap-2 mb-2 px-2 text-xs text-gray-500 uppercase font-semibold text-center">
                <div className="col-span-1">Set</div>
                <div className="col-span-3">kg</div>
                <div className="col-span-3">Reps</div>
                <div className="col-span-3">Done</div>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div 
                  key={set.id} 
                  className={`grid grid-cols-10 gap-2 items-center mb-2 px-2 py-2 rounded ${set.completed ? 'bg-emerald-900/20' : ''}`}
                >
                  <div className="col-span-1 text-center text-gray-400 font-bold">{setIndex + 1}</div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      value={set.weight}
                      onChange={(e) => {
                        const newEx = [...exercises];
                        newEx[exIndex].sets[setIndex].weight = Number(e.target.value);
                        setExercises(newEx);
                      }}
                      className="w-full bg-dark border border-gray-600 rounded text-center text-white py-1 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      value={set.reps}
                      onChange={(e) => {
                        const newEx = [...exercises];
                        newEx[exIndex].sets[setIndex].reps = Number(e.target.value);
                        setExercises(newEx);
                      }}
                      className="w-full bg-dark border border-gray-600 rounded text-center text-white py-1 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <button 
                      onClick={() => toggleSetCompletion(exIndex, setIndex)}
                      className={`${set.completed ? 'text-emerald-500' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                      {set.completed ? <CheckCircle size={24} className="fill-current" /> : <Circle size={24} />}
                    </button>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => addSet(exIndex)}
                className="w-full mt-2 py-2 flex items-center justify-center text-sm font-semibold text-blue-400 hover:bg-blue-500/10 rounded transition"
              >
                <Plus size={16} className="mr-1" /> Add Set
              </button>
            </div>
          </div>
        ))}

        {/* Add Manual Exercise Button */}
        <button
          onClick={openManualModal}
          className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
        >
          <Plus size={24} className="mb-1" />
          <span className="font-semibold">Add Exercise Manually</span>
        </button>

        {exercises.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">Use the Voice Assistant above or manually add exercises.</p>
          </div>
        )}
      </div>

       {/* Manual Entry Modal */}
       {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Add Exercise</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Exercise Name</label>
                <input 
                  type="text" 
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Squat"
                  className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:border-primary outline-none"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={manualWeight}
                    onChange={(e) => setManualWeight(Number(e.target.value))}
                    className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Reps</label>
                  <input 
                    type="number" 
                    value={manualReps}
                    onChange={(e) => setManualReps(Number(e.target.value))}
                    className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:border-primary outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={saveManualExercise}
                className="w-full bg-primary text-dark font-bold py-3 rounded-lg hover:bg-emerald-400 transition mt-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;