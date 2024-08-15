import React, { useEffect, useState } from 'react';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import Tree, { DataNode } from 'antd/es/tree';
import { DictValueEnumObj } from '@/components/DictTag';

export type RoleFormData = Record<string, unknown> & Partial<API.System.Role>;

export type RoleFormProps = {
  onCancel: (flag?: boolean, formVals?: RoleFormData) => void;
  onSubmit: (values: RoleFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Role>;
  menuTree: DataNode[];
  menuCheckedKeys: string[];
  statusOptions: DictValueEnumObj;
};

const RoleForm: React.FC<RoleFormProps> = (props) => {
  const [form] = Form.useForm();
  const { menuTree, menuCheckedKeys } = props;
  const [menuIds, setMenuIds] = useState<string[]>([]);
  const { statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      roleId: props.values.roleId,
      roleName: props.values.roleName,
      roleKey: props.values.roleKey,
      roleSort: props.values.roleSort,
      dataScope: props.values.dataScope,
      menuCheckStrictly: props.values.menuCheckStrictly,
      deptCheckStrictly: props.values.deptCheckStrictly,
      status: props.values.status,
      delFlag: props.values.delFlag,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
      remark: props.values.remark,
    });
  }, [form, props]);

  const intl = useIntl();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit({ ...values, menuIds } as RoleFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.role.title',
        defaultMessage: 'Edit User Info',
      })}
      forceRender
      open={props.open}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        grid={true}
        layout="horizontal"
        submitter={false}
        onFinish={handleFinish}>
        <ProFormDigit
          name="roleId"
          label={intl.formatMessage({
            id: 'system.role.role_id',
            defaultMessage: 'Role Number',
          })}
          placeholder="Please enter the role number"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the role number" defaultMessage="Please enter the role number" />,
            },
          ]}
        />
        <ProFormText
          name="roleName"
          label={intl.formatMessage({
            id: 'system.role.role_name',
            defaultMessage: 'UserName',
          })}
          placeholder="Please enter the role number"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the role number" defaultMessage="Please enter the role number" />,
            },
          ]}
        />
        <ProFormText
          name="roleKey"
          label={intl.formatMessage({
            id: 'system.role.role_key',
            defaultMessage: 'Permission string',
          })}
          placeholder="Please enter the character permission string"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the character permission string" defaultMessage="Please enter the character permission string" />,
            },
          ]}
        />
        <ProFormDigit
          name="roleSort"
          label={intl.formatMessage({
            id: 'system.role.role_sort',
            defaultMessage: 'Order',
          })}
          placeholder="Please enter the display order"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the display order" defaultMessage="Please enter the display order" />,
            },
          ]}
          fieldProps = {{
            defaultValue: 1
          }}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.role.status',
            defaultMessage: 'Role Status',
          })}
          placeholder="Please enter the role status"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the role status" defaultMessage="Please enter the role status" />,
            },
          ]}
          fieldProps = {{
            defaultValue: "0"
          }}
        />
        <ProForm.Item
          name="menuIds"
          label={intl.formatMessage({
            id: 'system.role.auth',
            defaultMessage: 'Menu permissions',
          })}
        >
          <Tree
            checkable={true}
            multiple={true}
            checkStrictly={true}
            defaultExpandAll={false}
            treeData={menuTree}
            defaultCheckedKeys={menuCheckedKeys}
            onCheck={(checkedKeys: any) => {             
              return setMenuIds(checkedKeys.checked);
            }}
          />
        </ProForm.Item>
        <ProFormTextArea
          name="remark"
          label={intl.formatMessage({
            id: 'system.role.remark',
            defaultMessage: 'Remark',
          })}
          placeholder="Please enter a note"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter a note" defaultMessage="Please enter a note" />,
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default RoleForm;
