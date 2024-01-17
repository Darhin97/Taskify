import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";

import { Info } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info";
import { BoardList } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/board-list";

const OrganizationIdPage = async () => {
  return (
    <div className={"w-full mb-20"}>
      <Info />
      <Separator className={"my-4"} />
      <div className={"px-2 md:px-4"}>
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
