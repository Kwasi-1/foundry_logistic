import { queryFn } from '@/services/query.api';
import { onUpdateAuthSlice } from '@/store/features/auth.slice';
import { RootState } from '@/store/store';
import { variables } from '@/utils/env';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import default_permissions from '../../permissions.defaults.json';

const useOrganization = () => {
  const { organization } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['organization', 'fields', organization?.id],
    queryFn: () =>
      queryFn({
        url: variables('organization').BASE_URL + '/organization',
        params: { id: organization?.id },
      }),
    keepPreviousData: true,
    enabled: !!organization?.id,
    onSuccess(data: any) {
      const permissions = data?.data?.permissions || default_permissions;

      dispatch(onUpdateAuthSlice({ permissions }));
    },
    refetchOnWindowFocus: false,
  });

  const data = (query.data as any)?.data as IOrganization;
  return {
    ...query,
    data,
    permissions: data?.permissions || default_permissions,
  };
};

export default useOrganization;

export interface IOrganization {
  _id: ID;
  orgId: string;
  requirements: Requirement[];
  permissions: IPermissions;
  createdAt: CreatedAt;
  __v: number;
  verification_mode: string[];
}

export interface ID {
  $oid: string;
}

export interface CreatedAt {
  $date: Date;
}

export interface Requirement {
  index: number;
  name: string;
  fields: Field[];
  _id: ID;
}

export interface Field {
  label: string;
  fieldId: string;
  dataType: DataType;
  options: string[];
  required: boolean;
  value: null;
  generateField: boolean;
  applies: Apply[];
  dependentOn: DependentOn;
  _id: ID;
}

export enum Apply {
  Employed = 'Employed',
  SelfEmployed = 'Self Employed',
  Student = 'Student',
}

export enum DataType {
  Select = 'select',
  Text = 'text',
}

export enum DependentOn {
  EmploymentType = 'employmentType',
  Empty = '',
}

// export interface IPermissions {
//   finance: {
//     loans: IAccess;
//     investment_or_account: IAccess;
//     report: IAccess;
//     monitoring: IAccess;
//     organization: IAccess;
//   };
// }
export type IPermissions = typeof default_permissions

export interface IAccess {
  'update:application': ActionApplication;
  'approve_or_reject:application': ActionApplication;
  'delete:application': ActionApplication;
  'export:application': ActionApplication;
  'delete:approval': ActionApplication;
  'action:repayment': ActionApplication;
  'disburse:loan': ActionApplication;
  'create:loan': ActionApplication;
  'book:loan': ActionApplication;
  'close:loan': ActionApplication;
  'export:loans': ActionApplication;
  'export:investment.or.account': ActionApplication;
  'export:repayment.statement': ActionApplication;
  'view:application': ActionApplication;
  'view:application.details': ActionApplication;
  'view:pending.disbursement': ActionApplication;
  'view:disbursed.loans': ActionApplication;
  'view:closed.loans': ActionApplication;
  'view:booked.loans': ActionApplication;
  'view:repayments': ActionApplication;
  'create:users': ActionApplication;
  'update:users': ActionApplication;
  'delete:users': ActionApplication;
  'create:workflow': ActionApplication;
  'update:workflow': ActionApplication;
  'delete:workflow': ActionApplication;
  'create:branch': ActionApplication;
  'update:branch': ActionApplication;
  'delete:branch': ActionApplication;
}

export interface ActionApplication {
  allow_all_users: boolean;
  allowed_roles: string[];
  allowed_users: string[];
}
