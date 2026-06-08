import { useMemo, useState } from "react";
import "./App.css";

import { Hero } from "./components/Hero";
import { LogInputPanel } from "./components/LogInputPanel";
import { IncidentOverview } from "./components/IncidentOverview";
import { AnalysisResults } from "./components/AnalysisResults";

import { sampleLogs } from "./mocks/sampleLogs";
import { analyzeLogs } from "./features/logAnalysis/analyzeLogs";

export default function App() {
  const [logText, setLogText] = useState(sampleLogs);

  const result = useMemo(() => {
    if (!logText.trim()) return null;
    return analyzeLogs(logText);
  }, [logText]);

  return (
    <main className="app">
      <Hero />

      <section className="workspace">
        <LogInputPanel logText={logText} onLogTextChange={setLogText} />

        {result && <IncidentOverview result={result} />}
      </section>

      {result && <AnalysisResults result={result} />}
    </main>
  );
}
