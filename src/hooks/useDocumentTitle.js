import { useEffect } from "react";
import { APP_TITLE } from "@/constants/brand";

export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${APP_TITLE} | ${pageTitle}` : APP_TITLE;
  }, [pageTitle]);
}
