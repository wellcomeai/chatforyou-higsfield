
import React from 'react';
import { ToolDefinition } from '../types';
import { TOOLS } from '../tools/registry';
import { useI18n } from '../i18n';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  user: any;
  onUserUpdate: (userData: any) => void;
}

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, user, onUserUpdate }) => {
  const { t } = useI18n();
  const toolEntry = TOOLS.find(entry => entry.id === tool.id);

  if (!toolEntry) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 uppercase font-black tracking-widest bg-black">
        {t.workspace.underDevelopment}
      </div>
    );
  }

  const SpecificWorkspace = toolEntry.component;

  return <SpecificWorkspace tool={tool} user={user} onUserUpdate={onUserUpdate} />;
};

export default ToolWorkspace;
