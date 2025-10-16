import React from "react";
import { Card, Spin, Empty, Pagination } from "antd";

/**
 * 🧩 CardTable Component
 * A responsive grid-based alternative to Ant Design Table.
 *
 * Props:
 * - columns: [{ title, dataIndex, render }]
 * - dataSource: array of data
 * - loading: boolean
 * - pagination: { current, pageSize, total, showSizeChanger, showTotal }
 * - onChange: (pagination) => void
 * - rowKey: key for each item
 */
const CardTable = ({
  columns = [],
  dataSource = [],
  loading = false,
  pagination = {},
  onChange,
  rowKey = "id",
  gridCols = "sm:grid-cols-2 lg:grid-cols-3",
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

  const renderCard = (record) => {
    return (
      <Card
        key={record[rowKey]}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
        title={
          <div className="font-semibold text-[var(--color-primary)]">
            {columns.find((col) => col.isTitle)?.render
              ? columns.find((col) => col.isTitle).render(record[columns.find((col) => col.isTitle).dataIndex], record)
              : record[columns.find((col) => col.isTitle)?.dataIndex] || record.title}
          </div>
        }
      >
        <div className="space-y-2">
          {columns
            .filter((col) => !col.isTitle)
            .map((col) => (
              <div key={col.dataIndex} className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-muted)]">{col.title}:</span>
                <span className="text-[var(--color-text)] font-medium">
                  {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
                </span>
              </div>
            ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="p-4">
      {/* Grid layout */}
      <div className={`grid gap-5 grid-cols-1 ${gridCols}`}>
        {dataSource.map((record) => renderCard(record))}
      </div>

      {/* Pagination */}
      {pagination?.total > pagination?.pageSize && (
        <div className="flex justify-center mt-6">
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
