import React, { useEffect, useState } from 'react';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTreeSelect,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Form, Modal} from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { DataNode } from 'antd/es/tree';
import { createIcon } from '@/utils/IconUtil';
import { DictValueEnumObj } from '@/components/DictTag';
import IconSelector from '@/components/IconSelector';

export type MenuFormData = Record<string, unknown> & Partial<API.System.Menu>;

export type MenuFormProps = {
  onCancel: (flag?: boolean, formVals?: MenuFormData) => void;
  onSubmit: (values: MenuFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Menu>;
  visibleOptions: DictValueEnumObj;
  statusOptions: DictValueEnumObj;
  menuTree: DataNode[];
};

const MenuForm: React.FC<MenuFormProps> = (props) => {

  const [form] = Form.useForm();

  const [menuTypeId, setMenuTypeId] = useState<any>('M');
  const [menuIconName, setMenuIconName] = useState<any>();
  const [iconSelectorOpen, setIconSelectorOpen] = useState<boolean>(false);

  const { menuTree, visibleOptions, statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    setMenuIconName(props.values.icon);
    form.setFieldsValue({
      menuId: props.values.menuId,
      menuName: props.values.menuName,
      parentId: props.values.parentId,
      orderNum: props.values.orderNum,
      path: props.values.path,
      component: props.values.component,
      query: props.values.query,
      isFrame: props.values.isFrame,
      isCache: props.values.isCache,
      menuType: props.values.menuType,
      visible: props.values.visible,
      status: props.values.status,
      perms: props.values.perms,
      icon: props.values.icon,
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
    props.onSubmit(values as MenuFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.menu.title',
        defaultMessage: 'Edit menu permissions',
      })}
      open={props.open}
      forceRender
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        grid={true}
        submitter={false}
        layout="horizontal"
        onFinish={handleFinish}>
        <ProFormDigit
          name="menuId"
          label={intl.formatMessage({
            id: 'system.menu.menu_id',
            defaultMessage: 'Menu Number',
          })}
          placeholder="Please enter the menu number"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the menu number" defaultMessage="Please enter the menu number" />,
            },
          ]}
        />
        <ProFormTreeSelect
          name="parentId"
          label={intl.formatMessage({
            id: 'system.menu.parent_id',
            defaultMessage: 'PREVIOUS MENU',
          })}
          params={{menuTree}}
          request={async () => {
            return menuTree;
          }}
          placeholder="Please enter the parent menu number"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the parent menu number" defaultMessage="Please enter the parent menu number" />,
            },
          ]}
          fieldProps = {{
            defaultValue: 0
          }}
        />
        <ProFormRadio.Group
          name="menuType"
          valueEnum={{
            M: 'directory',
            C: 'menu',
            F: 'button',
          }}
          label={intl.formatMessage({
            id: 'system.menu.menu_type',
            defaultMessage: 'Menu Type',
          })}
          placeholder="Please enter the menu type"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the menu type！" defaultMessage="Please enter the menu type" />,
            },
          ]}
          fieldProps={{
            defaultValue: 'M',
            onChange: (e) => {
              setMenuTypeId(e.target.value);
            },
          }}
        />
        <ProFormSelect
          name="icon"
          label={intl.formatMessage({
            id: 'system.menu.icon',
            defaultMessage: 'Menu icon',
          })}
          valueEnum={{}}
          hidden={menuTypeId === 'F'}
          addonBefore={createIcon(menuIconName)}
          fieldProps={{
            onClick: () => {
              setIconSelectorOpen(true);
            },
          }}
          placeholder="Please enter the menu icon"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the menu icon" defaultMessage="Please enter the menu icon" />,
            },
          ]}
        />
        <ProFormText
          name="menuName"
          label={intl.formatMessage({
            id: 'system.menu.menu_name',
            defaultMessage: 'menu name',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the menu name"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the menu name" defaultMessage="Please enter the menu name" />,
            },
          ]}
        />
        <ProFormDigit
          name="orderNum"
          label={intl.formatMessage({
            id: 'system.menu.order_num',
            defaultMessage: 'ORDER',
          })}
          width="lg"
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the display order"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the display order" defaultMessage="Please enter the display order" />,
            },
          ]}
          fieldProps = {{
            defaultValue: 1
          }}
        />
        <ProFormRadio.Group
          name="isFrame"
          valueEnum={{
            0: 'YES',
            1: 'NO',
          }}
          initialValue="1"
          label={intl.formatMessage({
            id: 'system.menu.is_frame',
            defaultMessage: 'Is it an external link',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter whether it is an external link"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter whether it is an external link" defaultMessage="Please enter whether it is an external link" />,
            },
          ]}
          fieldProps = {{
            defaultValue: '1'
          }}
        />
        <ProFormText
          name="path"
          label={intl.formatMessage({
            id: 'system.menu.path',
            defaultMessage: 'Routing address',
          })}
          width="lg"
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the routing address"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: menuTypeId !== 'F',
              message: <FormattedMessage id="Please enter the routing address" defaultMessage="Please enter the routing address" />,
            },
          ]}
        />
        <ProFormText
          name="component"
          label={intl.formatMessage({
            id: 'system.menu.component',
            defaultMessage: 'Component Path',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the component path"
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the component path" defaultMessage="Please enter the component path" />,
            },
          ]}
        />
        <ProFormText
          name="query"
          label={intl.formatMessage({
            id: 'system.menu.query',
            defaultMessage: 'Routing parameters',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter routing parameters"
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter routing parameters" defaultMessage="Please enter routing parameters" />,
            },
          ]}
        />
        <ProFormText
          name="perms"
          label={intl.formatMessage({
            id: 'system.menu.perms',
            defaultMessage: 'Permission identification',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the permission identifier"
          hidden={menuTypeId === 'M'}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the permission identifier" defaultMessage="Please enter the permission identifier" />,
            },
          ]}
        />
        <ProFormRadio.Group
          name="isCache"
          valueEnum={{
            0: 'YES',
            1: 'NO',
          }}
          label={intl.formatMessage({
            id: 'system.menu.is_cache',
            defaultMessage: 'Is it cached',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter whether to cache or not"
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter whether to cache or not" defaultMessage="Please enter whether to cache or not" />,
            },
          ]}
          fieldProps = {{
            defaultValue: 0
          }}
        />
        <ProFormRadio.Group
          name="visible"
          valueEnum={visibleOptions}
          label={intl.formatMessage({
            id: 'system.menu.visible',
            defaultMessage: 'Display Status',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the display status"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the display status" defaultMessage="Please enter the display status" />,
            },
          ]}
          fieldProps = {{
            defaultValue: '0'
          }}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.menu.status',
            defaultMessage: 'Menu status',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the menu status"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the menu status" defaultMessage="Please enter the menu status" />,
            },
          ]}
          fieldProps = {{
            defaultValue: '0'
          }}
        />
      </ProForm>
      <Modal
        width={800}
        open={iconSelectorOpen}
        onCancel={() => {
          setIconSelectorOpen(false);
        }}
        footer={null}
      >
        <IconSelector
          onSelect={(name: string) => {
            form.setFieldsValue({ icon: name });
            setMenuIconName(name);
            setIconSelectorOpen(false);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default MenuForm;
