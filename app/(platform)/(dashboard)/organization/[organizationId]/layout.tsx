import { startCase } from "lodash";

import OrganizationControl from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control";
import { auth } from "@clerk/nextjs";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrganizationControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
