import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, Dumbbell, User } from 'lucide-react';
import { AppScreen, WorkoutSession, Routine } from './types';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import Routines from './components/Routines';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  
  // Mock Data Store
  const [history, setHistory] = useState<WorkoutSession[]>([
    {
      id: 'mock-1',
      name: 'Push Day',
      startTime: Date.now() - 86400000 * 2,
      exercises: [
        { 
          id: 'ex-1', 
          name: 'Bench Press', 
          sets: [{ id: 's1', reps: 8, weight: 100, unit: 'kg', completed: true }] 
        }
      ]
    }
  ]);

  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: 'r1',
      name: 'Morning Cardio & Abs',
      exercises: [
        { id: 're1', name: 'Crunch', sets: 3, reps: 20 },
        { id: 're2', name: 'Plank', sets: 3, reps: 60 } // Reps acting as seconds here
      ]
    }
  ]);

  // If a routine is started, we pass it to the logger
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);

  const handleSaveWorkout = (workout: WorkoutSession) => {
    setHistory([workout, ...history]);
    setActiveScreen(AppScreen.DASHBOARD);
    setActiveRoutine(null); // Reset active routine after finishing
  };

  const handleStartRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
    setActiveScreen(AppScreen.LOGGING);
  };

  const handleAddRoutine = (routine: Routine) => {
    setRoutines([...routines, routine]);
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case AppScreen.DASHBOARD:
        return <Dashboard history={history} />;
      case AppScreen.LOGGING:
        return (
          <WorkoutLogger 
            onSaveWorkout={handleSaveWorkout} 
            initialRoutine={activeRoutine}
          />
        );
      case AppScreen.ROUTINES:
        return (
          <Routines 
            routines={routines} 
            onAddRoutine={handleAddRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onStartRoutine={handleStartRoutine}
          />
        );
      case AppScreen.PROFILE:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <User size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Profile</h2>
            <p>Settings & Account Management</p>
          </div>
        );
      default:
        return <Dashboard history={history} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Main Content Area */}
      <main className="container mx-auto max-w-md p-4 min-h-screen relative">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark/95 backdrop-blur-md border-t border-gray-800 z-50">
        <div className="container mx-auto max-w-md flex justify-around items-center h-16 px-2">
          <button 
            onClick={() => setActiveScreen(AppScreen.DASHBOARD)}
            className={`flex flex-col items-center justify-center w-16 space-y-1 ${activeScreen === AppScreen.DASHBOARD ? 'text-primary' : 'text-gray-500'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-medium">History</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveRoutine(null); // Reset routine if clicking Log manually
              setActiveScreen(AppScreen.LOGGING);
            }}
            className="flex flex-col items-center justify-center -mt-8"
          >
            <div className="bg-primary hover:bg-emerald-400 text-dark rounded-full p-4 shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95">
              <PlusCircle size={32} />
            </div>
            <span className="text-[10px] font-medium mt-1 text-gray-400">Log</span>
          </button>

          <button 
            onClick={() => setActiveScreen(AppScreen.ROUTINES)}
            className={`flex flex-col items-center justify-center w-16 space-y-1 ${activeScreen === AppScreen.ROUTINES ? 'text-primary' : 'text-gray-500'}`}
          >
            <Dumbbell size={24} />
            <span className="text-[10px] font-medium">Routines</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;