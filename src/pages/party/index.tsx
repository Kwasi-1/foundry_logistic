import DashboardContainer from "@/components/ui/dashboard-container";
import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { PageTitle } from "@/components/ui/page-title";
import { capitalize } from "lodash";

function SingleParty() {
  const [params] = useSearchParams();
  const name = params.get("name");
  const type = params.get("type");
  const { data: PartyData, isPending } = useQuery({
    queryKey: ["single-party", name, type],
    queryFn: async () => {
      const { data: Response } = await apiClient({
        url: variables().BUSINESS_API + "/core/get/" + type,
        params: {
          name,
        },
        method: "GET",
      });
      return Response?.data || {};
    },
  });

  const vitals = [
    {
      title: "Name",
      value: String(PartyData?.customer_name || PartyData?.supplier_name || ""),
      extraClasses: "",
    },
    {
      title: "Type",
      value: String(PartyData?.customer_type || PartyData?.supplier_type || ""),
      extraClasses: "",
    },
    {
      title: "Mobile No.",
      value: String(PartyData?.mobile_no || "-"),
      extraClasses: "",
    },
    {
      title: "Email",
      value: String(PartyData?.email_id || PartyData?.contact_mail || "-"),
      extraClasses: "text-[green] capitalize",
    },
    {
      title: "Primary Contact",
      value: String(PartyData?.primary_contact || "-"),
      extraClasses: "",
    },
    {
      title: "Primary Address",
      value: String(PartyData?.primary_address || "")
        .split("<br>")
        .join(" - "),
      extraClasses: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <PageTitle
        title={capitalize(type ?? "")}
        size="lg"
        className="pl-0 pt-0 pb-0"
      />

      <DashboardContainer
        title={name ?? ""}
        headerClassName="text-[2rem]"
        contentClassName="grid grid-cols-3 gap-4"
        loading={isPending}
      >
        {vitals.map((i, idx) => (
          <div key={idx} className="flex flex-col gap-y-1 text-sm">
            <h4 className="uppercase text-xs font-medium text-gray-500">
              {i.title}
            </h4>
            <p>{i.value || "-"}</p>
          </div>
        ))}
      </DashboardContainer>
    </div>
  );
}

export default SingleParty;
