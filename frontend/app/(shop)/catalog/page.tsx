import { Suspense } from "react";

import CatalogPage from "@/app/(shop)/catalog/CatalogClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogRoute() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-6 h-24 w-full" />
        </PageContainer>
      }
    >
      <CatalogPage />
    </Suspense>
  );
}
