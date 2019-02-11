export const queryToModelOptions = (docId: string, queryData: any) => {
  return {
    id: docId,
    ...queryData
  };
};
