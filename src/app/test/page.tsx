'use client';
import { useEffect, useState } from "react";

export default function TestPage() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/md/getting-started-welcome.md')
      .then(res => res.text())
      .then(text => {
        setHtml(text);
        setLoading(false);
      })
      .catch(err => {
        setHtml(`<p>Error: ${err.message}</p>`);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="p-8">
      <h1>Test Page</h1>
      <div 
        className="prose prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
} 