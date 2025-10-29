import React from "react";
import { Card, Table, Tag, Progress } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Bell, FileText, User, Edit } from "lucide-react";
import UseApi from "../Hooks/UseApi";
import ProfileMenu from "../components/ProfileMenu";

const UserDashboard = () => {
  const pieData = [
    { name: "Personal Notes", value: 65 },
    { name: "Work Notes", value: 25 },
    { name: "Archived", value: 10 },
  ];
  const { data: notesStatics } = UseApi({ url: "notes/stats", method: "GET", enabled: true })
  const COLORS = ["#15304b", "#ff9800", "#4caf50"];

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <div className="flex items-center gap-2 text-textsecondary">
          <FileText size={16} />
          {text}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
      render: (cat) => <Tag color="var(--color-accent)">{cat}</Tag>
    },
    {
      title: "Last Updated",
      dataIndex: "created_at",
      key: "created_a",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Edit size={18} className="cursor-pointer text-textsecondary hover:text-amber-700" />
      ),
    },
  ];


  const { data: recentNotes } = UseApi({ url: 'notes/recent', method: 'GET' });
  console.log(recentNotes)


  return (
    <div className="min-h-screen bg-bg text-surface p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-textsurface">Welcome back 👋 </h1>
          <p className="text-textsecondary">Here’s an overview of your notes.</p>
        </div>
        <ProfileMenu/>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-5 rounded-2xl border border-border bg-surface/80 backdrop-blur-glass-blur shadow-glass-shadow transition-all hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm  text-textsecondary text-nowrap">Total Notes</p>
              <h2 className="text-2xl font-medium text-textsecondary">{notesStatics?.count || 0}</h2>
            </div>
            <div className="p-3 rounded-xl text-textsecondary">
              <FileText size={28} strokeWidth={1.8} color={"var(--color-accent)"} />
            </div>
          </div>
        </div>


        <div className="p-5 rounded-2xl border border-border bg-surface/80 backdrop-blur-glass-blur shadow-glass-shadow transition-all hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textsecondary">Active Categories</p>
              <h2 className="text-2xl font-semibold text-textsecondary">8</h2>
            </div>
            <User className="text-text" size={32} color="var(--color-accent)" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface/80 backdrop-blur-glass-blur shadow-glass-shadow transition-all hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textsecondary">Storage Used</p>
              <Progress
                percent={68}
                size="small"
                strokeColor="var(--color-accent)"
                showInfo={false}
              />
              <p className="text-xs mt-1 text-textsecondary">68% used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes Chart */}
        <div className="col-span-1 lg:col-span-1 rounded-2xl shadow-sm bg-surface border border-border">
          <h3 className="text-lg font-semibold mb-4 p-2 text-textsecondary">Notes Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Notes Table */}
        <div className="col-span-1 lg:col-span-2 rounded-2xl shadow-sm bg-surface border border-border">
          <h3 className="text-lg font-semibold mb-4 text-textsecondary p-2">Recent Notes</h3>
          <Table

            columns={columns}
            dataSource={recentNotes?.data}
            pagination={false}
            rowClassName=""
            className="custom-table"

          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
