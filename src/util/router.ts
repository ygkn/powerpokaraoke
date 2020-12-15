import { useRouter } from 'next/router';

export const useQueryString = (queryName: string): string => {
  const { query } = useRouter();

  const queryStringOrArray = query[queryName];

  if (Array.isArray(queryStringOrArray)) {
    return queryStringOrArray[0];
  }

  return queryStringOrArray;
};
