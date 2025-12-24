import { Task } from "./types";
import { TaskQuery, SortKey, SortDirection, QueryResult } from "./query";

export function queryTasks(
  tasks: Task[],
  query: TaskQuery,
  options?: {
    sortBy?: SortKey;
    direction?: SortDirection;
    page?: number;
    pageSize?: number;
  }
): QueryResult<Task> {
  let result = [...tasks];

  // 1️⃣ Filtering
  if (query.completed !== undefined) {
    result = result.filter((t) => t.completed === query.completed);
  }

  if (query.priority) {
    const priorities = Array.isArray(query.priority)
      ? query.priority
      : [query.priority];

    result = result.filter((t) => priorities.includes(t.priority));
  }

  if (query.titleContains) {
    const term = query.titleContains.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(term));
  }

  if (query.createdAfter) {
    const createdAfter = query.createdAfter;
    result = result.filter((t) => t.createdAt > createdAfter);
  }

  if (query.createdBefore) {
    const createdBefore = query.createdBefore;
    result = result.filter((t) => t.createdAt < createdBefore);
  }

  const total = result.length;

  // 2️⃣ Sorting
  if (options?.sortBy) {
    const dir = options.direction === "desc" ? -1 : 1;

    result.sort((a, b) => {
      const aVal = a[options.sortBy!];
      const bVal = b[options.sortBy!];

      if (aVal instanceof Date && bVal instanceof Date) {
        return (aVal.getTime() - bVal.getTime()) * dir;
      }

      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }

  // 3️⃣ Pagination
  if (options?.page !== undefined && options.pageSize) {
    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize;

    result = result.slice(start, end);

    return {
      data: result,
      total,
      page: options.page,
      hasMore: end < total,
    };
  }

  return { data: result, total };
}
