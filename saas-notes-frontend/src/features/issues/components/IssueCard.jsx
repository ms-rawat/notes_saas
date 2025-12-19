import React from 'react';
import { Card, Tag, Avatar, Tooltip, Typography } from 'antd';
import { UserOutlined, BugOutlined, BuildOutlined, CheckSquareOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PriorityColor = {
    LOW: 'green',
    MEDIUM: 'blue',
    HIGH: 'orange',
    CRITICAL: 'red'
};

const TypeIcon = {
    BUG: <BugOutlined />,
    FEATURE: <BuildOutlined />,
    TASK: <CheckSquareOutlined />
};

const IssueCard = ({ issue, onClick }) => {
    return (
        <Card
            hoverable
            size="small"
            className="mb-3 glass-card border-l-4 border-t-0 border-r-0 border-b-0"
            style={{
                borderLeftColor: PriorityColor[issue.priority] || 'gray',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <Tooltip title={issue.type}>
                    <span className="text-textsecondary">{TypeIcon[issue.type] || <CheckSquareOutlined />}</span>
                </Tooltip>
                <Tag color={PriorityColor[issue.priority]}>{issue.priority}</Tag>
            </div>

            <Text strong className="block mb-2 line-clamp-2 text-textprimary">{issue.title}</Text>

            <div className="flex justify-between items-center mt-3">
                <Text className="text-xs text-textsecondary">
                    {new Date(issue.created_at).toLocaleDateString()}
                </Text>
                {issue.assignee_name ? (
                    <Tooltip title={`Assigned to ${issue.assignee_name}`}>
                        <Avatar size="small" className="bg-accent text-white">
                            {issue.assignee_name[0].toUpperCase()}
                        </Avatar>
                    </Tooltip>
                ) : (
                    <Tooltip title="Unassigned">
                        <Avatar size="small" icon={<UserOutlined />} className="bg-bg text-textsecondary" />
                    </Tooltip>
                )}
            </div>
        </Card>
    );
};

export default IssueCard;
