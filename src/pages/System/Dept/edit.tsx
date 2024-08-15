import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Form, Modal} from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { DataNode } from 'antd/es/tree';
import { DictValueEnumObj } from '@/components/DictTag';

export type DeptFormData = Record<string, unknown> & Partial<API.System.Dept>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormData) => void;
  onSubmit: (values: DeptFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Dept>;
  deptTree: DataNode[];
  statusOptions: DictValueEnumObj;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();

  const { statusOptions, deptTree } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      deptId: props.values.deptId,
      parentId: props.values.parentId,
      ancestors: props.values.ancestors,
      deptName: props.values.deptName,
      orderNum: props.values.orderNum,
      leader: props.values.leader,
      phone: props.values.phone,
      email: props.values.email,
      status: props.values.status,
      delFlag: props.values.delFlag,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
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
    props.onSubmit(values as DeptFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.dept.title',
        defaultMessage: 'Editorial Department',
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
          name="deptId"
          label={intl.formatMessage({
            id: 'system.dept.dept_id',
            defaultMessage: 'Department ID',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the department ID"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the department ID" defaultMessage="Please enter the department ID" />,
            },
          ]}
        />
        <ProFormTreeSelect
          name="parentId"
          label={intl.formatMessage({
            id: 'system.dept.parent_dept',
            defaultMessage: 'Superior department:',
          })}
          request={async () => {
            return deptTree;
          }}
          placeholder="Please select the superior department"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id="Please select the superior department" defaultMessage="Please select the superior department!" />
              ),
            },
          ]}
        />
        <ProFormText
          name="deptName"
          label={intl.formatMessage({
            id: 'system.dept.dept_name',
            defaultMessage: 'Dept Name',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the department name"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the department name" defaultMessage="Please enter the department name" />,
            },
          ]}
        />
        <ProFormDigit
          name="orderNum"
          label={intl.formatMessage({
            id: 'system.dept.order_num',
            defaultMessage: 'Order',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the display order"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the display order" defaultMessage="Please enter the display order" />,
            },
          ]}
        />
        <ProFormText
          name="leader"
          label={intl.formatMessage({
            id: 'system.dept.leader',
            defaultMessage: 'leader',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter leader"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter leader" defaultMessage="Please enter leader" />,
            },
          ]}
        />
        <ProFormText
          name="phone"
          label={intl.formatMessage({
            id: 'system.dept.phone',
            defaultMessage: 'phone number',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter your contact phone number!"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter your contact phone number!" defaultMessage="Please enter your contact phone number!" />,
            },
          ]}
        />
        <ProFormText
          name="email"
          label={intl.formatMessage({
            id: 'system.dept.email',
            defaultMessage: 'email address',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter your email address"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter your email address" defaultMessage="Please enter your email address" />,
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.dept.status',
            defaultMessage: 'Department status',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter the department status"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the department status" defaultMessage="Please enter the department status" />,
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default DeptForm;
