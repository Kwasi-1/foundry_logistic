import { useAppDispatch, useAppSelector } from "@/store/store";
import { variables } from "@/utils/env";
import { lowerCase } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useEffect } from "react";
import { onUpdateAuthSlice } from "@/store/auth/auth.slice";

const useSubscription = () => {
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector((state) => state.auth);

  const query = useQuery<{ data: ISubscription }>({
    queryKey: ["get", "subscription", organization?.name],
    queryFn: () =>
      apiClient({
        url: variables().SUBCRIPTION_SERVICE + `/subscriptions/search`,
        params: {
          organization_id: organization?.name,
        },
        method: "GET",
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // Handle success and error using useEffect
  useEffect(() => {
    if (query.isSuccess && query.data) {
      const subscription: ISubscription = query.data?.data || ({} as any);
      const is_active =
        lowerCase(subscription.subscription_status) === "active";
      dispatch(onUpdateAuthSlice({ isSubscribed: is_active }));
    }

    if (query.isError) {
      dispatch(onUpdateAuthSlice({ isSubscribed: false }));
    }
  }, [query.isSuccess, query.isError, query.data, query.error, dispatch]);

  return query;
};

export default useSubscription;

export interface ISubscription {
  id: number;
  organization_id: string;
  plan_id: number;
  start_date: Date;
  current_period_start: Date;
  current_period_end: Date;
  created_at: Date;
  updated_at: Date;
  plan_name: string;
  organization_name: string;
  subscription_status: string;
  auto_renew: boolean;
  bundles: Bundle[];
  apps: App[];
  billing_contact_email: string;
}

export interface App {
  id: number;
  organization_id: string;
  app_id: string;
  bill_usage: boolean;
  usage_data: UsageData;
  created_at: Date;
  updated_at: Date;
}

export interface UsageData {}

export interface Bundle {
  id: number;
  subscription_id: number;
  bundle_id: number;
  price_at_purchase: string;
  currency_at_purchase: string;
  status: string;
  bundle_name: string;
  pricing_model: string;
  is_active: boolean;
  added_at: Date;
  canceled_at: Date;
  currency: string;
  description: string;
  price: string;
}

export interface IInvoice {
  id: number;
  organization_id: string;
  subscription_bundle_id: number;
  organization_name: string;
  billing_contact_email: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  subscription_id: number;
  external_id: string;
  description: string;
  invoice_type: string;
  metadata: string;
  items: Item[];
}

export interface Item {
  item_code: string;
  item_name: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
  income_account: string;
}
