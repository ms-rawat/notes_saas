import { Button, Table, Tag } from "antd";
import { useState } from "react";
import UseApi from "../../../Hooks/UseApi";
import usePageTitle from "../../../Hooks/usePageTitle";

const TeamPage = () => {
  usePageTitle("Team");
  const [visible, setVisible] = useState(false);
  const { data, isPending, refetch } = UseApi({
    url: "auth/invitations",
    method: "GET",
    queryKey: ["invitations"],
  });

  const invites = data?.data || [];

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role_name", key: "role" },
    {
      title: "Status",
      dataIndex: "accepted",
      render: (val) =>
        val ? <Tag color="green">Accepted</Tag> : <Tag color="orange">Pending</Tag>,
    },
    { title: "Sent", dataIndex: "created_at" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-textsecondary">Team Members</h1>
        <Button type="primary" onClick={() => setVisible(true)}>
          Invite User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={invites}
        loading={isPending}
        rowKey="id"
        className="custom-table"
      />

      <InviteUserModal
        visible={visible}
        onClose={() => setVisible(false)}
        onInviteSuccess={refetch}
      />
    </div>
  );
};

export default TeamPage;
