import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 style={{ fontSize: '1.5em', fontWeight: 700, marginBottom: '0.5em', marginTop: '0.5em' }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ fontSize: '1.25em', fontWeight: 600, marginBottom: '0.4em', marginTop: '0.5em' }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ fontSize: '1.1em', fontWeight: 600, marginBottom: '0.3em', marginTop: '0.4em' }}>
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p style={{ marginBottom: '0.75em', lineHeight: 1.6 }}>{children}</p>
        ),
        ul: ({ children }) => (
          <ul style={{ marginBottom: '0.75em', paddingLeft: '1.5em', listStyleType: 'disc' }}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol style={{ marginBottom: '0.75em', paddingLeft: '1.5em', listStyleType: 'decimal' }}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li style={{ marginBottom: '0.25em', lineHeight: 1.5 }}>{children}</li>
        ),
        strong: ({ children }) => (
          <strong style={{ fontWeight: 600 }}>{children}</strong>
        ),
        em: ({ children }) => (
          <em style={{ fontStyle: 'italic' }}>{children}</em>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          return isInline ? (
            <code
              style={{
                background: 'var(--surface-light)',
                padding: '0.15em 0.4em',
                borderRadius: '4px',
                fontSize: '0.9em',
                fontFamily: 'monospace',
              }}
            >
              {children}
            </code>
          ) : (
            <code
              style={{
                display: 'block',
                background: 'var(--surface-light)',
                padding: '0.75em 1em',
                borderRadius: '8px',
                fontSize: '0.9em',
                fontFamily: 'monospace',
                overflowX: 'auto',
                marginBottom: '0.75em',
              }}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre
            style={{
              background: 'var(--surface-light)',
              padding: '0.75em 1em',
              borderRadius: '8px',
              overflowX: 'auto',
              marginBottom: '0.75em',
            }}
          >
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote
            style={{
              borderLeft: '3px solid var(--primary)',
              paddingLeft: '1em',
              marginLeft: 0,
              marginBottom: '0.75em',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', textDecoration: 'underline' }}
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div style={{ overflowX: 'auto', marginBottom: '0.75em' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9em',
              }}
            >
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead style={{ background: 'var(--surface-light)' }}>{children}</thead>
        ),
        th: ({ children }) => (
          <th
            style={{
              border: '1px solid var(--border)',
              padding: '10px 12px',
              textAlign: 'left',
              fontWeight: 600,
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td
            style={{
              border: '1px solid var(--border)',
              padding: '10px 12px',
              lineHeight: 1.5,
            }}
          >
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
