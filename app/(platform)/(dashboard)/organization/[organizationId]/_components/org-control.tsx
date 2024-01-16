"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

const OrganizationControl = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    //actively changes organization when the params in the url changes
    async function setOrg() {
      if (!setActive) return;

      await setActive({ organization: params.organizationId as string });
    }
    setOrg();
  }, [params.organizationId, setActive]);

  return null;
};

export default OrganizationControl;
