import React from "react";
import OrganizationControl from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control";

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrganizationControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
