import React from "react";
import { Card, Table, Tag, Progress } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Bell, FileText, User, Edit } from "lucide-react";

const UserDashboard = () => {
  const pieData = [
    { name: "Personal Notes", value: 65 },
    { name: "Work Notes", value: 25 },
    { name: "Archived", value: 10 },
  ];

  const COLORS = ["#15304b", "#ff9800", "#4caf50"];

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <div className="flex items-center gap-2 text-[var(--color-text)]">
          <FileText size={16} />
          {text}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Last Updated",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Edit size={18} className="cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-accent)]" />
      ),
    },
  ];

  const data = [
    { key: "1", title: "Meeting Notes", category: "Work", updated_at: "Oct 7, 2025" },
    { key: "2", title: "Grocery List", category: "Personal", updated_at: "Oct 6, 2025" },
    { key: "3", title: "App Roadmap", category: "Work", updated_at: "Oct 4, 2025" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Welcome back 👋</h1>
          <p className="text-[var(--color-muted)]">Here’s an overview of your notes.</p>
        </div>
        <Bell className="text-[var(--color-primary)] cursor-pointer" size={22} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="rounded-2xl shadow-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Total Notes</p>
              <h2 className="text-2xl font-semibold text-[var(--color-text)]">124</h2>
            </div>
            <FileText className="text-[var(--color-primary)]" size={32} />
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Active Categories</p>
              <h2 className="text-2xl font-semibold text-[var(--color-text)]">8</h2>
            </div>
            <User className="text-[var(--color-success)]" size={32} />
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Storage Used</p>
              <Progress
                percent={68}
                size="small"
                strokeColor="var(--color-accent)"
                showInfo={false}
              />
              <p className="text-xs mt-1 text-[var(--color-muted)]">68% used</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes Chart */}
        <Card className="col-span-1 lg:col-span-1 rounded-2xl shadow-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">Notes Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Notes Table */}
        <Card className="col-span-1 lg:col-span-2 rounded-2xl shadow-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">Recent Notes</h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName="hover:bg-[var(--color-bg)]"
          />
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
