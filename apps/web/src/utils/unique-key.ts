export const generateUniqueKey = () => {
  return crypto.randomUUID();
};

export const generateDraftUniqueKey = () => {
  return `__draft_${generateUniqueKey()}`;
};
