import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ClaimContext = createContext(null);

export function ClaimProvider({ children, initialData }) {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  // Source inspector shared state
  const [selectedField, setSelectedField] = useState(null);
  const [pageText, setPageText] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/analyze`, { method: 'POST' });
      if (!res.ok) throw new Error(`Backend returned HTTP ${res.status}`);
      const json = await res.json();
      setData(json);

      if (json.fields && json.fields.length > 0 && !selectedField) {
        selectField(json.fields[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const selectField = async (fieldItem) => {
    if (!fieldItem) return;
    setSelectedField(fieldItem);

    if (!fieldItem.source_doc || !fieldItem.page) return;

    setPageLoading(true);
    setPageError(null);
    try {
      const res = await fetch(
        `${API_BASE}/documents/${encodeURIComponent(fieldItem.source_doc)}/pages/${fieldItem.page}`
      );
      if (!res.ok) throw new Error(`Failed to load page text (${res.status})`);
      const pageData = await res.json();
      setPageText(pageData.text || '');
    } catch (err) {
      setPageError(err.message || 'Could not fetch page text');
      setPageText('');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchAnalysis();
    } else if (initialData.fields?.length > 0) {
      selectField(initialData.fields[0]);
    }
  }, []);

  return (
    <ClaimContext.Provider
      value={{
        data,
        loading,
        error,
        fetchAnalysis,
        selectedField,
        selectField,
        pageText,
        pageLoading,
        pageError,
        setInitialPrefetchedData: (d) => {
          setData(d);
          setLoading(false);
          if (d?.fields?.length > 0) selectField(d.fields[0]);
        }
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
}

export function useClaim() {
  const ctx = useContext(ClaimContext);
  if (!ctx) throw new Error('useClaim must be used within ClaimProvider');
  return ctx;
}

