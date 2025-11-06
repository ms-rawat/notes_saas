import { Empty, Spin, Pagination } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const CardTable = ({
  dataSource = [],
  loading = false,
  pagination = {},
  onChange,
}) => {
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  if (!dataSource?.length)
    return (
      <div className="flex justify-center items-center h-64">
        <Empty description="No data found" />
      </div>
    );

  const renderCard = (item) => (
    <div
      key={item.id}
      className="
        group relative overflow-hidden
        bg-secondary 
        border border-border
        rounded-2xl 
        p-5
        shadow-[0_4px_20px_rgba(0,0,0,0.3)]
        backdrop-blur-xl
        transition-all duration-300
        hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
        hover:border-[var(--color-primary)]
        cursor-pointer
      "
    >
      {/* 🔹 Title */}
      <h2
        className="
          text-lg font-semibold mb-2 
          text-textaccent
          tracking-wide leading-snug
          group-hover:tracking-wider transition-all
        "
      >
        {item.title}
      </h2>

      {/* 🔹 Body */}
      <p className="text-[var(--color-textaccent,#e5e7eb)] text-sm mb-4 leading-relaxed line-clamp-3">
        {item.body}
      </p>

      {/* 🔹 Metadata Section */}
      <div className="flex items-center justify-between text-xs text-[var(--color-muted,#9ca3af)]">
        <div className="flex items-center gap-1">
          <CalendarOutlined />
          <span>{dayjs(item.created_at).format("DD MMM YYYY")}</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockCircleOutlined />
          <span>{dayjs(item.updated_at).format("hh:mm A")}</span>
        </div>
      </div>

      {/* 🔹 Futuristic Gradient Glow */}
      <div
        className="
          absolute inset-0 rounded-2xl pointer-events-none 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
          blur-lg
        "
      ></div>
    </div>
  );

  return (
    <div className="p-4">
      {/* 🔹 Responsive Grid Layout */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {dataSource.map(renderCard)}
      </div>

      {/* 🔹 Pagination */}
      {pagination?.total > pagination?.pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={pagination.showSizeChanger}
            showTotal={pagination.showTotal}
            onChange={(page, pageSize) => onChange?.({ current: page, pageSize })}
          />
        </div>
      )}
    </div>
  );
};

export default CardTable;
