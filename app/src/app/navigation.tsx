import { NavLink } from 'react-router';

const destinations = [
  { to: '/today', label: 'Oggi', glyph: '◉' },
  { to: '/projects', label: 'Progetti', glyph: '▤' },
  { to: '/agenda', label: 'Agenda', glyph: '▦' },
  { to: '/fitos', label: 'FitOS', glyph: '↗' },
  { to: '/finance', label: 'Finanze', glyph: '◈' },
  { to: '/inbox', label: 'Inbox', glyph: '↓' },
  { to: '/settings', label: 'Impostazioni', glyph: '⚙' },
] as const;

export function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return <nav aria-label="Principale">
    {destinations.map(item => <NavLink key={item.to} to={item.to} tabIndex={0} aria-label={item.label} onClick={onNavigate}>
      <span className="nav-glyph" aria-hidden="true">{item.glyph}</span>
      <span className="nav-text">{item.label}</span>
    </NavLink>)}
  </nav>;
}
