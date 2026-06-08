import type { ParsedLogLine } from "../types/logAnalysis";

type ParsedLogsTableProps = {
  parsedLines: ParsedLogLine[];
};

export function ParsedLogsTable({ parsedLines }: ParsedLogsTableProps) {
  return (
    <article className="card wide">
      <h3>Parsed Log Lines</h3>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Timestamp</th>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Raw Log</th>
            </tr>
          </thead>

          <tbody>
            {parsedLines.map((line) => (
              <tr key={line.id}>
                <td>
                  <span className={`level level-${line.level.toLowerCase()}`}>
                    {line.level}
                  </span>
                </td>
                <td>{line.timestamp ?? "—"}</td>
                <td>{line.endpoint ?? "—"}</td>
                <td>{line.statusCode ?? "—"}</td>
                <td>{line.raw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
