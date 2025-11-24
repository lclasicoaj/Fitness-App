import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WorkoutSession } from '../types';
import { Activity, Calendar, Trophy, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardProps {
  history: WorkoutSession[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Calculate mock volume data from history
  const data = history.slice(0, 7).map((session) => {
    let totalVolume = 0;
    session.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        totalVolume += set.weight * set.reps;
      });
    });
    return {
      name: new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'short' }),
      volume: totalVolume,
      date: session.startTime
    };
  }).reverse();

  const totalWorkouts = history.length;
  const lastWorkout = history.length > 0 ? new Date(history[0].startTime).toLocaleDateString() : 'No workouts yet';

  const toggleSession = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Athlete.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-2 mb-2 text-primary">
            <Trophy size={20} />
            <span className="text-sm font-semibold">Total Workouts</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-2 mb-2 text-secondary">
            <Calendar size={20} />
            <span className="text-sm font-semibold">Last Session</span>
          </div>
          <p className="text-white text-lg font-medium">{lastWorkout}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card p-4 rounded-xl border border-gray-700 h-80">
        <div className="flex items-center space-x-2 mb-4 text-gray-200">
          <Activity size={20} className="text-primary" />
          <h2 className="font-semibold">Volume (Last 7 Sessions)</h2>
        </div>
        
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                cursor={{fill: '#334155', opacity: 0.4}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#10b981' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <TrendingUp size={48} className="mb-2 opacity-50" />
            <p>Log a workout to see analytics</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {history.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No activity recorded.</div>
          ) : (
            history.slice(0, 5).map((session) => (
              <div key={session.id} className="flex flex-col bg-card">
                <div 
                  onClick={() => toggleSession(session.id)}
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700/50 transition-colors"
                >
                  <div>
                    <h3 className="text-white font-medium">{session.name}</h3>
                    <p className="text-sm text-gray-400">
                      {session.exercises.length} Exercises • {new Date(session.startTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {(session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0))} Sets
                    </span>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      {expandedSessionId === session.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>
                
                {expandedSessionId === session.id && (
                  <div className="bg-gray-900/30 px-4 pb-4 border-t border-gray-800 animate-in slide-in-from-top-2 duration-200">
                    {session.exercises.map((ex) => (
                      <div key={ex.id} className="mt-3 first:mt-3">
                        <div className="text-emerald-400 text-sm font-semibold mb-1 flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                          {ex.name}
                        </div>
                        <div className="flex flex-wrap gap-2 pl-3.5">
                          {ex.sets.map((set, i) => (
                            <div key={set.id} className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs">
                              <span className="text-gray-400 mr-1">#{i + 1}</span>
                              <span className="text-white font-mono font-medium">{set.weight}{set.unit} × {set.reps}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;