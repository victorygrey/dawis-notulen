
import React, { useState } from 'react';
import { MeetingMinute, DivisionType } from '../types';
import { Plus, Search, FileText, UserPlus, MapPin, Clock, BookOpen, AlertTriangle } from 'lucide-react';
import { summarizeMeeting } from '../services/gemini';

const MeetingMinutes: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const [minutes, setMinutes] = useState<MeetingMinute[]>([
    {
      id: 'm1',
      date: '2023-11-20',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Ruang Meeting Utama',
      participants: ['Ahmad', 'Siti', 'Budi'],
      openingVerse: 'QS. Al-Baqarah: 183',
      purpose: 'Evaluasi mingguan persiapan keberangkatan group Januari.',
      minutes: 'Membahas status paspor 45 jamaah, tiket sudah issued 100%, sisa hotel di Mekkah belum final.',
      status: 'Proses',
      issues: 'Keterlambatan input dokumen dari agen daerah.',
      type: 'Evaluasi',
      division: DivisionType.OPRS
    }
  ]);

  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async (text: string) => {
    setIsSummarizing(true);
    const summary = await summarizeMeeting(text);
    setAiSummary(summary);
    setIsSummarizing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Meeting Minutes</h2>
          <p className="text-slate-500">Record and archive internal meeting details and decisions.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg">
          <Plus size={18} />
          <span>New Meeting Record</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {minutes.map((m) => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">
                      {m.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{m.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{m.purpose}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  m.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {m.status}
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-sm">{m.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-sm">{m.startTime} - {m.endTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <UserPlus size={16} className="text-slate-400" />
                    <span className="text-sm">{m.participants.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 italic">
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="text-sm">{m.openingVerse}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-rose-500 font-bold text-xs uppercase">
                    <AlertTriangle size={14} />
                    Issue / Kendala
                  </div>
                  <p className="text-sm text-slate-700">{m.issues}</p>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minutes Summary</h4>
                  <button 
                    onClick={() => handleSummarize(m.minutes)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-tight flex items-center gap-1"
                  >
                    {isSummarizing ? 'Generating...' : '✨ AI Summary'}
                  </button>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{m.minutes}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">AI Meeting Assistant</h3>
              <p className="text-indigo-200 text-xs mb-4 leading-relaxed">
                Need a quick summary of your meetings? AI can extract action items and core decisions automatically.
              </p>
              <div className="p-3 bg-indigo-800/50 rounded-lg border border-indigo-700 text-xs min-h-[100px]">
                {aiSummary || "Select a meeting to generate an AI summary."}
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full opacity-10"></div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Meeting Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total Meeting (MoM)</span>
                <span className="font-bold text-slate-800">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Average Duration</span>
                <span className="font-bold text-slate-800">1h 15m</span>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Meeting Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full">
                      <div className="bg-blue-500 h-1.5 rounded-full w-[60%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 w-12">Evaluasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full">
                      <div className="bg-indigo-500 h-1.5 rounded-full w-[30%]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 w-12">Briefing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingMinutes;
