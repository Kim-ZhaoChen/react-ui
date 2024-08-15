import React from 'react';
import { Form, message } from 'antd';
import { FormattedMessage, useIntl } from '@umijs/max';
import { updateUserPwd } from '@/services/system/user';
import { ProForm, ProFormText } from '@ant-design/pro-components';

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const handleFinish = async (values: Record<string, any>) => {
    const resp = await updateUserPwd(values.oldPassword, values.newPassword);
    if (resp.code === 200) {
      message.success('Password reset successful.');
    } else {
      message.warning(resp.msg);
    }
  };

  const checkPassword = (rule: any, value: string) => {
    const login_password = form.getFieldValue('newPassword');
    if (value === login_password) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('The two password inputs are inconsistent'));
  };

  return (
    <>
      <ProForm form={form} onFinish={handleFinish}>       
          <ProFormText.Password
            name="oldPassword"
            label={intl.formatMessage({
              id: 'system.user.old_password',
              defaultMessage: 'Old password',
            })}
            width="xl"
            placeholder="Please enter old password"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="Please enter old password!" defaultMessage="Please enter old password!" />,
              },
            ]}
          />
          <ProFormText.Password
            name="newPassword"
            label={intl.formatMessage({
              id: 'system.user.new_password',
              defaultMessage: 'Password',
            })}
            width="xl"
            placeholder="Please enter a new password"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="Please enter a new password" defaultMessage="Please enter a new password" />,
              },
            ]}
          />
          <ProFormText.Password
            name="confirmPassword"
            label={intl.formatMessage({
              id: 'system.user.confirm_password',
              defaultMessage: 'Confirm password',
            })}
            width="xl"
            placeholder="Please enter the Confirm password"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage id="Please enter the Confirm password" defaultMessage="Please enter the Confirm password" />
                ),
              },
              { validator: checkPassword },
            ]}
          />
      </ProForm>
    </>
  );
};

export default ResetPassword;
