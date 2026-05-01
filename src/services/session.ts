export const SessionStorage = () => {
  return {
    set(item: { key: string; value: string }) {
      sessionStorage.setItem(item.key, item.value);
    },

    consume(key: string): string | null {
      const res = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      return res;
    },
  };
};
