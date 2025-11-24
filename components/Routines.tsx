import React, { useState } from 'react';
import { Plus, Play, MoreVertical, Trash2, Dumbbell, X, Save, ChevronRight, Download } from 'lucide-react';
import { Routine, RoutineExercise } from '../types';

interface RoutinesProps {
  routines: Routine[];
  onAddRoutine: (routine: Routine) => void;
  onDeleteRoutine: (id: string) => void;
  onStartRoutine: (routine: Routine) => void;
}

const PRESET_PPL: Routine[] = [
  {
    id: 'ppl-push',
    name: 'Push Day (PPL)',
    exercises: [
      { id: 'p1', name: 'Bench Press', sets: 4, reps: 8 },
      { id: 'p2', name: 'Overhead Press', sets: 3, reps: 10 },
      { id: 'p3', name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
      { id: 'p4', name: 'Tricep Pushdowns', sets: 3, reps: 12 },
      { id: 'p5', name: 'Lateral Raises', sets: 4, reps: 15 },
    ]
  },
  {
    id: 'ppl-pull',
    name: 'Pull Day (PPL)',
    exercises: [
      { id: 'pu1', name: 'Deadlift', sets: 3, reps: 5 },
      { id: 'pu2', name: 'Pull Ups', sets: 3, reps: 8 },
      { id: 'pu3', name: 'Barbell Rows', sets: 4, reps: 10 },
      { id: 'pu4', name: 'Face Pulls', sets: 3, reps: 15 },
      { id: 'pu5', name: 'Bicep Curls', sets: 3, reps: 12 },
    ]
  },
  {
    id: 'ppl-legs',
    name: 'Leg Day (PPL)',
    exercises: [
      { id: 'l1', name: 'Squat', sets: 4, reps: 6 },
      { id: 'l2', name: 'Romanian Deadlift', sets: 3, reps: 10 },
      { id: 'l3', name: 'Leg Press', sets: 3, reps: 12 },
      { id: 'l4', name: 'Leg Curls', sets: 3, reps: 12 },
      { id: 'l5', name: 'Calf Raises', sets: 4, reps: 15 },
    ]
  }
];

const Routines: React.FC<RoutinesProps> = ({ routines, onAddRoutine, onDeleteRoutine, onStartRoutine }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newExercises, setNewExercises] = useState<RoutineExercise[]>([]);
  const [tempExName, setTempExName] = useState('');
  const [tempExSets, setTempExSets] = useState(3);
  const [tempExReps, setTempExReps] = useState(10);

  const handleAddPreset = () => {
    PRESET_PPL.forEach(routine => {
      // Check if already exists to avoid duplicates
      if (!routines.find(r => r.name === routine.name)) {
        onAddRoutine({ ...routine, id: Math.random().toString(36).substr(2, 9) });
      }
    });
  };

  const handleAddExerciseToRoutine = () => {
    if (!tempExName.trim()) return;
    setNewExercises([
      ...newExercises,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: tempExName,
        sets: tempExSets,
        reps: tempExReps
      }
    ]);
    setTempExName('');
    setTempExSets(3);
    setTempExReps(10);
  };

  const handleSaveRoutine = () => {
    if (!newRoutineName.trim() || newExercises.length === 0) return;
    
    onAddRoutine({
      id: Math.random().toString(36).substr(2, 9),
      name: newRoutineName,
      exercises: newExercises
    });
    
    // Reset
    setNewRoutineName('');
    setNewExercises([]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Routines</h1>
          <p className="text-gray-400">Manage your workout plans</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-dark p-3 rounded-full shadow-lg hover:bg-emerald-400 transition-colors"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Empty State */}
      {routines.length === 0 && (
        <div className="bg-card rounded-xl border border-gray-700 p-8 text-center">
          <Dumbbell size={48} className="mx-auto text-gray-500 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No Routines Yet</h3>
          <p className="text-gray-400 mb-6">Create your own or load a popular plan.</p>
          <div className="space-y-3">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
            >
              Create from Scratch
            </button>
            <button 
              onClick={handleAddPreset}
              className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center justify-center space-x-2"
            >
              <Download size={18} />
              <span>Load PPL (Push Pull Legs)</span>
            </button>
          </div>
        </div>
      )}

      {/* Routine List */}
      <div className="space-y-4">
        {routines.map((routine) => (
          <div key={routine.id} className="bg-card rounded-xl border border-gray-700 overflow-hidden relative group">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{routine.name}</h3>
                <div className="flex items-center space-x-2">
                   <button 
                    onClick={() => onDeleteRoutine(routine.id)}
                    className="text-gray-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mb-4 line-clamp-2">
                {routine.exercises.map(e => e.name).join(', ')}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500 font-medium bg-gray-800 px-2 py-1 rounded">
                  {routine.exercises.length} Exercises
                </span>
                <button 
                  onClick={() => onStartRoutine(routine)}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary hover:text-dark transition flex items-center"
                >
                  <Play size={16} className="mr-1 fill-current" /> Start Routine
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PPL Button if routines exist but PPL not there (optional convenience) */}
      {routines.length > 0 && !routines.some(r => r.id.startsWith('ppl')) && (
         <button 
            onClick={handleAddPreset}
            className="w-full py-3 border border-dashed border-gray-600 text-gray-400 rounded-xl hover:border-gray-500 hover:text-white transition flex items-center justify-center space-x-2"
          >
            <Download size={18} />
            <span>Add Popular Plans (PPL)</span>
          </button>
      )}

      {/* Create Routine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-dark/50">
              <h2 className="text-lg font-bold text-white">Create New Routine</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Routine Name</label>
              <input 
                type="text" 
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="e.g. Monday Chest Day" 
                className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:border-primary outline-none mb-6"
              />

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Add Exercises</h3>
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <input 
                    placeholder="Exercise Name" 
                    value={tempExName}
                    onChange={(e) => setTempExName(e.target.value)}
                    className="col-span-6 bg-dark border border-gray-600 rounded p-2 text-white text-sm focus:border-primary outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Sets" 
                    value={tempExSets}
                    onChange={(e) => setTempExSets(Number(e.target.value))}
                    className="col-span-2 bg-dark border border-gray-600 rounded p-2 text-white text-sm text-center focus:border-primary outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Reps" 
                    value={tempExReps}
                    onChange={(e) => setTempExReps(Number(e.target.value))}
                    className="col-span-2 bg-dark border border-gray-600 rounded p-2 text-white text-sm text-center focus:border-primary outline-none"
                  />
                  <button 
                    onClick={handleAddExerciseToRoutine}
                    className="col-span-2 bg-gray-700 hover:bg-primary hover:text-dark text-white rounded flex items-center justify-center transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Added Exercises List */}
              <div className="space-y-2">
                {newExercises.map((ex, idx) => (
                  <div key={ex.id} className="flex justify-between items-center bg-dark/50 p-3 rounded border border-gray-800">
                    <div>
                      <div className="font-medium text-white text-sm">{ex.name}</div>
                      <div className="text-xs text-gray-500">{ex.sets} sets × {ex.reps} reps</div>
                    </div>
                    <button 
                      onClick={() => setNewExercises(newExercises.filter((_, i) => i !== idx))}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {newExercises.length === 0 && (
                  <div className="text-center text-gray-600 text-sm py-4 border border-dashed border-gray-700 rounded">
                    No exercises added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 bg-dark/50">
              <button 
                onClick={handleSaveRoutine}
                disabled={!newRoutineName || newExercises.length === 0}
                className="w-full bg-primary text-dark font-bold py-3 rounded-xl hover:bg-emerald-400 transition disabled:opacity-50 flex justify-center items-center space-x-2"
              >
                <Save size={20} />
                <span>Save Routine</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routines;