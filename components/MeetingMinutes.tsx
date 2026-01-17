import React, { useState, useEffect } from 'react';
import { MeetingMinute, DivisionType } from '../types';
import { Plus, Search, FileText, UserPlus, MapPin, Clock, X, Save, Sparkles, Edit2 } from 'lucide-react';
import { summarizeMeeting } from '../services/gemini';

const AlertCircleIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

const MeetingMinutes: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [newMeeting, setNewMeeting] = useState({
    purpose: '',
    participants: '',
    location: '',
    openingVerse: '',
    minutes: '',
    issues: '',
    type: 'Briefing',
    startTime: '09:00',
    endTime: '10:00'
  });

  useEffect(() => {
    const saved = localStorage.getItem('syncops_meetings');
    if (saved) {
      try {
        setMinutes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse meetings", e);
      }
    } else {
      const initial: MeetingMinute[] = [
        {
          id: 'm1',
          date: new Date().toISOString().split('T')[0],
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
      ];
      setMinutes(initial);
      localStorage.setItem('syncops_meetings', JSON.stringify(initial));
    }
  }, []);

  const saveMeetings = (data: MeetingMinute[]) => {
    setMinutes(data);
    localStorage.setItem('syncops_meetings', JSON.stringify(data));
  };

  const handleOpenAddModal = () => {
    setNewMeeting({
      purpose: '',
      participants: '',
      location: '',
      openingVerse: '',
      minutes: '',
      issues: '',
      type: 'Briefing',
      startTime: '09:00',
      endTime: '10:00'
    });
    setIsEditMode(false);
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (m: MeetingMinute) => {
    setNewMeeting({
      purpose: m.purpose,
      participants: m.participants.join(', '),
      location: m.location,
      openingVerse: m.openingVerse || '',
      minutes: m.minutes,
      issues: m.issues,
      type: m.type,
      startTime: m.startTime,
      endTime: m.endTime
    });
    setEditingId(m.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meetingData = {
      purpose: newMeeting.purpose,
      participants: newMeeting.participants.split(',').map(p => p.trim()),
      location: newMeeting.location,
      openingVerse: newMeeting.openingVerse,
      minutes: newMeeting.minutes,
      issues: newMeeting.issues,
      type: newMeeting.type as any,
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      division: activeDivision
    };

    if (isEditMode && editingId) {
      const updated = minutes.map(m => m.id === editingId ? { ...m, ...meetingData } : m);
      saveMeetings(updated);
    } else {
      const meeting: MeetingMinute = {
        ...meetingData,
        id: Math.random().toString(36).substring(2, 11),
        date: new Date().toISOString().split('T')[0],
        status: 'Proses'
      };
      saveMeetings([meeting, ...minutes]);
    }

    setShowModal(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleSummarize = async (text: string) => {
    if (!text) return;
    setIsSummarizing(true);
    try {
      const summary = await summarizeMeeting(text);
      setAiSummary(summary);
    } catch (err) {
      setAiSummary("Gagal membuat ringkasan. Pastikan API Key valid.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredMeetings = minutes.filter(m => 
    m.division === activeDivision || activeDivision === DivisionType.IT
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Meeting Minutes (MoM)</h2>
          <p className="text-slate-500">Arsip risalah rapat internal divisi <span className="font-semibold text-indigo-600">{activeDivision}</span></p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg"
        >
          <Plus size={18} />
          <span>Buat Risalah Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredMeetings.length > 0 ? filteredMeetings.map((m) => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow relative">
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
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    m.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {m.status}
                  </div>
                  <button 
                    onClick={() => handleOpenEditModal(m)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Ubah Risalah"
                  >
                    <Edit2 size={16} />
                  </button>
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
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-rose-500 font-bold text-xs uppercase">
                    <AlertCircleIcon size={14} />
                    Issue / Kendala
                  </div>
                  <p className="text-sm text-slate-700">{m.issues || 'Tidak ada kendala'}</p>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Isi Risalah</h4>
                  <button 
                    onClick={() => handleSummarize(m.minutes)}
                    disabled={isSummarizing}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-tight flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles size={12} className={isSummarizing ? 'animate-spin' : ''} />
                    {isSummarizing ? 'Sedang Meringkas...' : 'Generate AI Summary'}
                  </button>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">{m.minutes}</p>
              </div>
            </div>
          )) : (
            <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-200">
              <FileText className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 italic">Belum ada risalah rapat.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden sticky top-6">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-400" />
                AI Assistant Summary
              </h3>
              <p className="text-indigo-200 text-xs mb-4 leading-relaxed">
                Hasil ringkasan AI untuk rapat yang dipilih akan muncul di sini.
              </p>
              <div className="p-4 bg-indigo-800/50 rounded-xl border border-indigo-700 text-sm min-h-[150px] leading-relaxed">
                {aiSummary || "Klik 'Generate AI Summary' pada kartu rapat untuk melihat ringkasan otomatis."}
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full opacity-10"></div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0">
              <h3 className="font-bold text-slate-800">{isEditMode ? 'Ubah Risalah Rapat' : 'Buat Risalah Rapat Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMeeting} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tujuan/Judul Rapat</label>
                  <input type="text" required value={newMeeting.purpose} onChange={e => setNewMeeting({...newMeeting, purpose: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white" placeholder="Contoh: Evaluasi Katering Mekkah" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jenis Rapat</label>
                  <select value={newMeeting.type} onChange={e => setNewMeeting({...newMeeting, type: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white">
                    <option value="Briefing">Briefing</option>
                    <option value="Evaluasi">Evaluasi</option>
                    <option value="Harian">Harian</option>
                    <option value="Rapat Kerja">Rapat Kerja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jam Mulai</label>
                  <input type="time" required value={newMeeting.startTime} onChange={e => setNewMeeting({...newMeeting, startTime: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jam Selesai</label>
                  <input type="time" required value={newMeeting.endTime} onChange={e => setNewMeeting({...newMeeting, endTime: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lokasi</label>
                  <input type="text" required value={newMeeting.location} onChange={e => setNewMeeting({...newMeeting, location: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white" placeholder="Ruang Rapat 1 / Zoom" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Peserta (Pisahkan koma)</label>
                  <input type="text" required value={newMeeting.participants} onChange={e => setNewMeeting({...newMeeting, participants: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white" placeholder="Ahmad, Budi, Siti" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Risalah / Notulen</label>
                <textarea required rows={4} value={newMeeting.minutes} onChange={e => setNewMeeting({...newMeeting, minutes: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 bg-white" placeholder="Tuliskan poin-poin pembahasan rapat..."></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 text-rose-500">Isu / Kendala (Opsional)</label>
                <input type="text" value={newMeeting.issues} onChange={e => setNewMeeting({...newMeeting, issues: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 text-sm text-slate-900 bg-white" placeholder="Contoh: Vendor lambat merespon" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                  <Save size={18} />
                  {isEditMode ? 'Perbarui Risalah' : 'Simpan Risalah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingMinutes;