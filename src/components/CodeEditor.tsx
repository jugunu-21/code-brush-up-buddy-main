
import { useEffect, useRef, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CodeEditorProps {
  value: string;
  componentToRender?: React.ReactNode;
  readOnly?: boolean;
}

const CodeEditor = ({ value, componentToRender, readOnly = true }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea based on content
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative w-full h-full">
      {componentToRender ? (
        <div className="w-full min-h-[300px] p-6 bg-white border border-gray-200 rounded-md shadow-sm overflow-auto">
          <div className="component-preview flex justify-center items-center">
            {componentToRender}
          </div>
        </div>
      ) : (
        <pre className="code-editor font-mono text-sm w-full min-h-[300px] 
                  p-4 bg-gray-50 border border-gray-200 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200 overflow-auto">
          <code>{value}</code>
        </pre>
      )}
    </div>
  );
};

// Collapsible code block component
export const CollapsibleCode = ({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  return (
    <Collapsible defaultOpen={defaultOpen} className="w-full border rounded-md overflow-hidden">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 border-b text-left font-medium">
        <span>{title}</span>
        <div className="flex">
          <ChevronDown className="h-5 w-5 text-gray-500 open:hidden" />
          <ChevronUp className="h-5 w-5 text-gray-500 hidden open:block" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CodeEditor;
