import ReactMarkdown from 'react-markdown';
import { readme } from '@/lib/constants';

export function AboutSite() {
  return (
    <div className="h-full p-6 overflow-auto prose prose-invert max-w-none">
      <ReactMarkdown>
        {readme}
      </ReactMarkdown>
    </div>
  );
} 