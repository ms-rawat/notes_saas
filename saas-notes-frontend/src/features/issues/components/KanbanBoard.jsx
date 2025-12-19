import React from 'react';
import IssueCard from './IssueCard';

const KanbanColumn = ({ title, status, issues, onCardClick, color }) => {
    return (
        <div className="flex-1 min-w-[300px] bg-accent/20 rounded-lg p-4 flex flex-col h-full mr-4 last:mr-0">
            <div className={`flex justify-between items-center mb-4 pb-2 border-b border-${color}-200`}>
                <h3 className="font-semibold text-lg">{title}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {issues.length}
                </span>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {issues.map(issue => (
                    <IssueCard
                        key={issue.id}
                        issue={issue}
                        onClick={() => onCardClick(issue)}
                    />
                ))}
                {issues.length === 0 && (
                    <div className="text-center text-gray-400 py-8 italic border-2 border-dashed border-gray-200 rounded-lg">
                        No issues
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanBoard = ({ issues, onCardClick }) => {
    const todoIssues = issues.filter(i => i.status === 'TODO');
    const inProgressIssues = issues.filter(i => i.status === 'IN_PROGRESS');
    const doneIssues = issues.filter(i => i.status === 'DONE');

    return (
        <div className="flex h-full overflow-x-auto pb-4">
            <KanbanColumn
                title="To Do"
                status="TODO"
                issues={todoIssues}
                onCardClick={onCardClick}
                color="blue"
            />
            <KanbanColumn
                title="In Progress"
                status="IN_PROGRESS"
                issues={inProgressIssues}
                onCardClick={onCardClick}
                color="orange"
            />
            <KanbanColumn
                title="Done"
                status="DONE"
                issues={doneIssues}
                onCardClick={onCardClick}
                color="green"
            />
        </div>
    );
};

export default KanbanBoard;
