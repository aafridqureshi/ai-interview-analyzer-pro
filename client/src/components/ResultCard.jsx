export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="card result-card">
      <h2>Resume Score: {result.score}/100</h2>

      {result.summary && <p className="result-summary">{result.summary}</p>}

      <h4>Strengths</h4>
      <ul>
        {result.strengths?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h4>Weaknesses</h4>
      <ul>
        {result.weaknesses?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {result.improvements?.length > 0 && (
        <>
          <h4>Improvement Suggestions</h4>
          <ul>
            {result.improvements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}