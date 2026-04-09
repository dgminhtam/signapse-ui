import { SearchParams, Sort } from "./definitions";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',

  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
function sanitize(term: string): string {
  return term.replace(/'/g, "''");
}

export const convertSearchCondition = (key: string, operator: string, term: string | string[]) => {
  const supportedOperators = [
    'eq', 'ne', 'gt', 'ge', 'lt', 'le',
    'contains', 'containsIgnoreCase',
    'startsWith', 'startsWithIgnoreCase',
    'endsWith', 'endsWithIgnoreCase',
    'null', 'notNull', 'empty', 'notEmpty',
    'in', 'nin',
  ];

  if (!supportedOperators.includes(operator)) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  let safeTerm: string;

  switch (operator) {
    case 'in':
    case 'nin':
      if (Array.isArray(term)) {
        safeTerm = term.map(t => `'${sanitize(t)}'`).join(',');
      } else {
        safeTerm = String(term).split(',').map(t => `'${sanitize(t)}'`).join(',');
      }
      return `${key} ${operator} (${safeTerm})`;

    case 'contains':
    case 'containsIgnoreCase':
    case 'startsWith':
    case 'startsWithIgnoreCase':
    case 'endsWith':
    case 'endsWithIgnoreCase':
      safeTerm = Array.isArray(term) ? term[0] ?? "" : term;
      return `${operator}(${key}, '${sanitize(safeTerm)}')`;
    case 'null':
    case 'notNull':
    case 'empty':
    case 'notEmpty':
      return `${key} ${operator}`;

    default:
      safeTerm = Array.isArray(term) ? (term[0] ?? "") : term;
      if (['gt', 'ge', 'lt', 'le'].includes(operator) && !isNaN(Number(safeTerm))) {
        return `${key} ${operator} ${safeTerm}`;
      }

      return `${key} ${operator} '${sanitize(safeTerm)}'`;
  }
};

export const buildSortQuery = (sortString: string | string[] | undefined): Sort[] => {
  if (!sortString) return [];

  const sortArray = (typeof sortString === 'string' ? sortString : sortString.join(","))
    .split(",")
    .filter(Boolean)
    .map((item) => {
      const lastUnderscoreIndex = item.lastIndexOf("_");
      if (lastUnderscoreIndex === -1) {
        return { field: item, direction: 'asc' as const };
      }
      const field = item.substring(0, lastUnderscoreIndex);
      const direction = item.substring(lastUnderscoreIndex + 1);
      const validDirection: 'asc' | 'desc' = (direction === 'asc' || direction === 'desc') ? direction : 'asc';
      return { field, direction: validDirection };
    });

  return sortArray;
};

export const queryParamsToString = ({ filter, page, size, sort }: SearchParams): string => {
  const query = new URLSearchParams();

  if (filter) {
    query.append("$filter", filter);
  }

  if (page !== undefined) {
    query.append("page", page.toString());
  }

  if (size !== undefined) {
    query.append("size", size.toString());
  }

  if (sort && sort.length > 0) {
    const sortStrings = sort.map(({ field, direction }) => `${field},${direction}`);
    query.append("sort", sortStrings.join(','));
  }
  return query.toString();
};

const FIELD_OPERATOR_REGEX = /^([\w\.]+)\[(\w+)\]$/;

export const buildFilterQuery = (searchFields: { [key: string]: string | string[] | undefined; }): string => {
  const query: string[] = [];

  Object.entries(searchFields).forEach(([key, value]) => {
    // Check if the key contains multiple fields separated by comma (for OR logic)
    // e.g. "name[containsIgnoreCase],sku[eq]"
    const parts = key.split(',');

    if (parts.length > 1) {
      // Handle OR logic group
      const orConditions: string[] = [];

      parts.forEach(part => {
        const matches = part.match(FIELD_OPERATOR_REGEX);
        if (matches) {
          const field = matches[1];
          const operator = matches[2];
          if (field && operator && value !== undefined && value !== '') {
            try {
              orConditions.push(convertSearchCondition(field, operator, value));
            } catch (e) {
              // Ignore unsupported operators or errors in individual parts
            }
          }
        }
      });

      if (orConditions.length > 0) {
        query.push(`(${orConditions.join(' or ')})`);
      }
    } else {
      // Handle single field (existing logic)
      const matches = key.match(FIELD_OPERATOR_REGEX);

      if (matches) {
        const field = matches[1];
        const operator = matches[2];
        if (field && operator && value !== undefined && value !== '') {
          query.push(convertSearchCondition(field, operator, value));
        }
      }
    }
  });
  return query.join(' and ');
}