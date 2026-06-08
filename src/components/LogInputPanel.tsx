import { sampleLogs } from "../mocks/sampleLogs";

type LogInputPanelProps = {
  logText: string;
  onLogTextChange: (value: string) => void;
};

export function LogInputPanel({
  logText,
  onLogTextChange,
}: LogInputPanelProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Application Logs</h2>
          <p>Paste logs from an application, API, or support incident.</p>
        </div>

        <button type="button" onClick={() => onLogTextChange(sampleLogs)}>
          Load Sample
        </button>
      </div>

      <textarea
        value={logText}
        onChange={(event) => onLogTextChange(event.target.value)}
        rows={14}
        placeholder="Paste logs here..."
      />
    </div>
  );
}
