import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import problemStatementsData from '../../data/sihProblemStatements.json';

/**
 * @typedef {Object} ProblemStatement
 * @property {number} sno
 * @property {string} org
 * @property {string} title
 * @property {"Software" | "Hardware"} category
 * @property {string} psNumber
 * @property {string} theme
 * @property {string} deadline
 */

export default function ProblemStatementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [themeFilter, setThemeFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'sno', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  // Extract unique themes
  const uniqueThemes = useMemo(() => {
    const themes = new Set(problemStatementsData.map(ps => ps.theme));
    return ['All', ...Array.from(themes).sort()];
  }, []);

  // Filter and sort
  const filteredAndSortedData = useMemo(() => {
    let data = [...problemStatementsData];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(ps => 
        ps.title.toLowerCase().includes(lowerSearch) ||
        ps.org.toLowerCase().includes(lowerSearch) ||
        ps.psNumber.toLowerCase().includes(lowerSearch)
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      data = data.filter(ps => ps.category === categoryFilter);
    }

    // Theme filter
    if (themeFilter !== 'All') {
      data = data.filter(ps => ps.theme === themeFilter);
    }

    // Sort
    data.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchTerm, categoryFilter, themeFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-orange-500" /> 
      : <ArrowDown size={14} className="ml-1 text-orange-500" />;
  };

  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '1480px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '16px', fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--navy)' }}>SIH 2026 Problem Statements</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
          Browse and filter the official problem statements for Smart India Hackathon 2026.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Title, Organization, or PS Number..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', flex: '1 1 300px' }}>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              style={{
                flex: '1',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                backgroundColor: 'var(--white)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
            </select>

            <select
              value={themeFilter}
              onChange={(e) => { setThemeFilter(e.target.value); setCurrentPage(1); }}
              style={{
                flex: '2',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                backgroundColor: 'var(--white)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {uniqueThemes.map(theme => (
                <option key={theme} value={theme}>{theme === 'All' ? 'All Themes' : theme}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--light-bg)', borderBottom: '2px solid var(--border)' }}>
                {[
                  { key: 'sno', label: 'S.No' },
                  { key: 'org', label: 'Organization' },
                  { key: 'title', label: 'Title' },
                  { key: 'category', label: 'Category' },
                  { key: 'psNumber', label: 'PS Number' },
                  { key: 'theme', label: 'Theme' },
                  { key: 'deadline', label: 'Deadline' }
                ].map((col) => (
                  <th 
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    style={{ 
                      padding: '16px', 
                      fontWeight: '600', 
                      color: 'var(--navy)', 
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {col.label} {getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((ps, index) => (
                  <tr 
                    key={ps.sno} 
                    style={{ 
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: index % 2 === 0 ? 'var(--white)' : 'var(--off-white)',
                      transition: 'background-color var(--transition-fast)'
                    }}
                  >
                    <td style={{ padding: '16px' }}>{ps.sno}</td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{ps.org}</td>
                    <td style={{ padding: '16px', minWidth: '300px' }}>{ps.title}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`pill-badge ${ps.category === 'Software' ? 'skill' : 'domain'}`}>
                        {ps.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--navy)' }}>{ps.psNumber}</td>
                    <td style={{ padding: '16px' }}>{ps.theme}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{ps.deadline}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No problem statements found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
