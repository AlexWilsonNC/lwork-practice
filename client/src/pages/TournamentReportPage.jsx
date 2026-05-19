import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DisplayPokemonSprites from '../Tournaments/pokemon-sprites';
import '../css/tournamentreports.css';

export default function TournamentReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      const token = localStorage.getItem('PTCGLegendsToken');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`/api/user/tournament-reports/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Report not found');

        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error(err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [reportId, navigate]);

  if (loading) return <div className="report-page">Loading...</div>;

  if (!report) {
    return (
      <div className="report-page">
        <div className="report-card">
          <h1>Report Not Found</h1>
          <Link to="/tournament-reports/new">Create a new report</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-card">
        <div className="report-title-row">
          <div>
            <h1>{report.eventName}</h1>
            <p>
              <strong>{report.eventType}</strong> · {report.format}
              {report.placement ? ` · ${report.placement} Place` : ''}
            </p>
          </div>

          <Link className="primary-report-link" to="/tournament-reports/new">
            New Report
          </Link>
        </div>

        <section className="report-section">
          <h2>Your Deck</h2>
          <div className="sprite-preview large">
            <DisplayPokemonSprites
              sprite1={report.playerDeck?.sprite1}
              sprite2={report.playerDeck?.sprite2 || 'blank'}
            />
            <span>{report.playerDeck?.label || 'Your Deck'}</span>
          </div>
        </section>

        <section className="report-section">
          <h2>Rounds</h2>

          <table className="report-round-table">
            <thead>
              <tr>
                <th>Rd</th>
                <th>Result</th>
                <th>Opponent</th>
                <th>Deck</th>
                <th>First/Second</th>
              </tr>
            </thead>
            <tbody>
              {(report.rounds || []).map(round => (
                <tr key={round.round}>
                  <td>{round.round}</td>
                  <td className={`result-pill result-${round.result}`}>
                    {round.result}
                  </td>
                  <td>{round.opponentName || '—'}</td>
                  <td>
                    {round.opponentDeck?.sprite1 ? (
                      <div className="table-sprite-cell">
                        <DisplayPokemonSprites
                          sprite1={round.opponentDeck.sprite1}
                          sprite2={round.opponentDeck.sprite2 || 'blank'}
                        />
                        <span>{round.opponentDeck.label || 'Unknown Deck'}</span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{round.wentFirst || 'unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}