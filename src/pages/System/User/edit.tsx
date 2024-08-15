import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { DataNode } from 'antd/es/tree';
import { DictValueEnumObj } from '@/components/DictTag';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2023/02/06
 * 
 * */


export type UserFormData = Record<string, unknown> & Partial<API.System.User>;

export type UserFormProps = {
  onCancel: (flag?: boolean, formVals?: UserFormData) => void;
  onSubmit: (values: UserFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.User>;
  sexOptions: DictValueEnumObj;
  statusOptions: DictValueEnumObj;
  postIds: number[];
  posts: string[];
  roleIds: number[];
  roles: string[];
  depts: DataNode[];
};

const UserForm: React.FC<UserFormProps> = (props) => {
  const [form] = Form.useForm();
  const userId = Form.useWatch('userId', form);
  const { sexOptions, statusOptions, } = props;
  const { roles, posts, depts } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      userId: props.values.userId,
      deptId: props.values.deptId,
      postIds: props.postIds,
      roleIds: props.roleIds,
      userName: props.values.userName,
      nickName: props.values.nickName,
      email: props.values.email,
      phonenumber: props.values.phonenumber,
      sex: props.values.sex,
      avatar: props.values.avatar,
      status: props.values.status,
      delFlag: props.values.delFlag,
      loginIp: props.values.loginIp,
      loginDate: props.values.loginDate,
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
    props.onSubmit(values as UserFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.user.title',
        defaultMessage: 'Edit user information',
      })}
      open={props.open}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        grid={true}
        form={form}
        layout="horizontal"
        submitter={false}
        onFinish={handleFinish}>
        <ProFormText
          name="nickName"
          label={intl.formatMessage({
            id: 'system.user.nick_name',
            defaultMessage: 'nickname',
          })}
          placeholder="Please enter user nickname"
          colProps={{ xs: 24, md: 12, xl: 12 }}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id="Please enter user nickname" defaultMessage="Please enter user nickname" />
              ),
            },
          ]}
        />
        <ProFormTreeSelect
          name="deptId"
          label={intl.formatMessage({
            id: 'system.user.dept_name',
            defaultMessage: 'department',
          })}
          request={async () => {
            return depts;
          }}
          placeholder="Please enter department"
          colProps={{ md: 12, xl: 12 }}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id="Please enter department" defaultMessage="Please enter department" />
              ),
            },
          ]}
        />
        <ProFormText
          name="phonenumber"
          label={intl.formatMessage({
            id: 'system.user.phonenumber',
            defaultMessage: 'phonenumber',
          })}
          placeholder="Please enter phonenumber"
          colProps={{ md: 12, xl: 12 }}
          rules={[
            {
              required: false,
              message: (
                <FormattedMessage id="Please enter phonenumber" defaultMessage="Please enter phonenumber" />
              ),
            },
          ]}
        />
        <ProFormText
          name="email"
          label={intl.formatMessage({
            id: 'system.user.email',
            defaultMessage: 'email',
          })}
          placeholder="Please enter email"
          colProps={{ md: 12, xl: 12 }}
          rules={[
            {
              required: false,
              message: (
                <FormattedMessage id="Please enter email" defaultMessage="Please enter email" />
              ),
            },
          ]}
        />
        <ProFormText
          name="userName"
          label={intl.formatMessage({
            id: 'system.user.user_name',
            defaultMessage: 'username',
          })}
          hidden={userId}
          placeholder="Please enter username"
          colProps={{ md: 12, xl: 12 }}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          label={intl.formatMessage({
            id: 'system.user.password',
            defaultMessage: 'password',
          })}
          hidden={userId}
          placeholder="Please enter password"
          colProps={{ md: 12, xl: 12 }}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter password" defaultMessage="Please enter password" />,
            },
          ]}
        />
        <ProFormSelect
          valueEnum={sexOptions}
          name="sex"
          label={intl.formatMessage({
            id: 'system.user.sex',
            defaultMessage: 'sex',
          })}
          initialValue={'0'}
          placeholder="Please enter sex"
          colProps={{ md: 12, xl: 12 }}
          rules={[
            {
              required: false,
              message: (
                <FormattedMessage id="Please enter sex" defaultMessage="Please enter sex" />
              ),
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.user.status',
            defaultMessage: 'account status',
          })}
          initialValue={'0'}
          placeholder="Please enter account status"
          colProps={{ md: 12, xl: 12 }}
          rules={[
            {
              required: false,
              message: (
                <FormattedMessage id="Please enter account status" defaultMessage="Please enter account status" />
              ),
            },
          ]}
        />
        <ProFormSelect
          name="postIds"
          mode="multiple"
          label={intl.formatMessage({
            id: 'system.user.post',
            defaultMessage: 'post',
          })}
          options={posts}
          placeholder="Please enter post"
          colProps={{ md: 12, xl: 12 }}
          rules={[{ required: true, message: 'Please enter post!' }]}
        />
        <ProFormSelect
          name="roleIds"
          mode="multiple"
          label={intl.formatMessage({
            id: 'system.user.role',
            defaultMessage: 'role',
          })}
          options={roles}
          placeholder="Please enter role"
          colProps={{ md: 12, xl: 12 }}
          rules={[{ required: true, message: 'Please enter role' }]}
        />
        <ProFormTextArea
          name="remark"
          label={intl.formatMessage({
            id: 'system.user.remark',
            defaultMessage: 'remark',
          })}
          placeholder="Please enter remark"
          colProps={{ md: 24, xl: 24 }}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter remark" defaultMessage="Please enter remark" />,
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default UserForm;
