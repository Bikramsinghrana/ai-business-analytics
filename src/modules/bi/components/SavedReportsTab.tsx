import React, { useState } from 'react';
import { 
  Bookmark, 
  Calendar, 
  Play, 
  Trash2, 
  Send, 
  Clock, 
  Mail, 
  CheckCircle, 
  Tag, 
  Plus, 
  FileText,
  BarChart2
} from 'lucide-react';
import { SavedReport, ScheduledReport, SqlExecutionResponse } from '../../../services/biService';

interface SavedReportsTabProps {
  savedReports: SavedReport[];
  scheduledReports: ScheduledReport[];
  isLoading: boolean;
  onRunReport: (id: string) => void;
  onDeleteSavedReport: (id: string) => void;
  onCreateSchedule: (data: {
    saved_report_id: string;
    name: string;
    frequency: string;
    recipients: string[];
    format: string;
  }) => void;
  onTriggerSchedule: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
  onLoadInSandbox: (sql: string) => void;
  activeExecutionResult?: SqlExecutionResponse | null;
}

export const SavedReportsTab: React.FC<SavedReportsTabProps> = ({
  savedReports,
  scheduledReports,
  isLoading,
  onRunReport,
  onDeleteSavedReport,
  onCreateSchedule,
  onTriggerSchedule,
  onDeleteSchedule,
  onLoadInSandbox,
}) => {
  const [selectedReportForSchedule, setSelectedReportForSchedule] = useState<SavedReport | null>(null);
  const [scheduleName, setScheduleName] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientsList, setRecipientsList] = useState<string[]>(['executives@aura.ai']);
  const [format, setFormat] = useState('csv');

  const handleOpenScheduleModal = (report: SavedReport) => {
    setSelectedReportForSchedule(report);
    setScheduleName(`${report.name} Digest`);
  };

  const handleAddRecipient = () => {
    if (recipientEmail.trim() && !recipientsList.includes(recipientEmail.trim())) {
      setRecipientsList([...recipientsList, recipientEmail.trim()]);
      setRecipientEmail('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipientsList(recipientsList.filter((r) => r !== email));
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReportForSchedule && recipientsList.length > 0) {
      onCreateSchedule({
        saved_report_id: selectedReportForSchedule.id,
        name: scheduleName || `${selectedReportForSchedule.name} Digest`,
        frequency,
        recipients: recipientsList,
        format,
      });
      setSelectedReportForSchedule(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Saved Reports Gallery */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Saved Business Intelligence Reports</h3>
              <p className="text-xs text-slate-400">Pre-configured SQL queries and executive visualizers</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {savedReports.length} reports
          </span>
        </div>

        {savedReports.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No saved reports yet. Run a query in the sandbox and click "Save Report".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {report.name}
                    </h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                      {report.chart_type}
                    </span>
                  </div>

                  {report.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  )}

                  {/* SQL snippet */}
                  <div className="bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-slate-400 line-clamp-2 border border-slate-900">
                    {report.sql_query}
                  </div>

                  {/* Tags */}
                  {report.tags && report.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {report.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRunReport(report.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                      title="Run and view results"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run</span>
                    </button>

                    <button
                      onClick={() => onLoadInSandbox(report.sql_query)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      title="Open in SQL Sandbox"
                    >
                      Edit SQL
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenScheduleModal(report)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Schedule automated delivery"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteSavedReport(report.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Scheduled Recurring Reports */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Automated Scheduled Reports</h3>
              <p className="text-xs text-slate-400">Recurring email delivery of business digests & alerts</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {scheduledReports.length} active schedules
          </span>
        </div>

        {scheduledReports.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No scheduled reports active. Click the calendar icon on any saved report to configure automated delivery.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40">
            {scheduledReports.map((sch) => (
              <div
                key={sch.id}
                className="p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-slate-850/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{sch.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono uppercase">
                      {sch.frequency}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono uppercase">
                      Format: {sch.format}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {sch.recipients?.join(', ') || 'No recipients'}
                    </span>
                    {sch.next_run_at && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        Next run: {new Date(sch.next_run_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTriggerSchedule(sch.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-900/50 text-indigo-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Now</span>
                  </button>

                  <button
                    onClick={() => onDeleteSchedule(sch.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Remove Schedule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Create New Schedule */}
      {selectedReportForSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Schedule Automated Delivery</h3>
              </div>
              <button
                onClick={() => setSelectedReportForSchedule(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Schedule Name</label>
                <input
                  type="text"
                  value={scheduleName}
                  onChange={(e) => setScheduleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Export Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="csv">CSV Spreadsheet</option>
                    <option value="json">JSON API Payload</option>
                    <option value="pdf">PDF Executive Summary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Recipients</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="add.email@company.com"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRecipient}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {recipientsList.map((r, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700"
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(r)}
                        className="text-slate-500 hover:text-red-400 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedReportForSchedule(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
