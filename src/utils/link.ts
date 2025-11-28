import nodePath from "path";

export const initializeLink = (site: URL) => (path: string) => {
  const pathname = nodePath.join(import.meta.env.BASE_URL, path);
  return new URL(pathname, site).toString();
};
