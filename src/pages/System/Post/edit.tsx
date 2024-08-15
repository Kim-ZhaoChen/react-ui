import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  } from '@ant-design/pro-components';
import { Form, Modal} from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { DictValueEnumObj } from '@/components/DictTag';

export type PostFormData = Record<string, unknown> & Partial<API.System.Post>;

export type PostFormProps = {
  onCancel: (flag?: boolean, formVals?: PostFormData) => void;
  onSubmit: (values: PostFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Post>;
  statusOptions: DictValueEnumObj;
};

const PostForm: React.FC<PostFormProps> = (props) => {
  const [form] = Form.useForm();

  const { statusOptions, } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
			postId: props.values.postId,
			postCode: props.values.postCode,
			postName: props.values.postName,
			postSort: props.values.postSort,
			status: props.values.status,
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
    props.onSubmit(values as PostFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.post.title',
        defaultMessage: 'Edit job information',
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
          name="postId"
          label={intl.formatMessage({
            id: 'system.post.post_id',
            defaultMessage: 'Post No',
          })}
          placeholder="Please enter the position number"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the position number" defaultMessage="Please enter the position number" />,                  
            },
          ]}
        />
        <ProFormText
          name="postName"
          label={intl.formatMessage({
            id: 'system.post.post_name',
            defaultMessage: 'Position',
          })}
          placeholder="Please enter the job title"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the job title" defaultMessage="Please enter the job title" />,                  
            },
          ]}
        />
        <ProFormText
          name="postCode"
          label={intl.formatMessage({
            id: 'system.post.post_code',
            defaultMessage: 'Job Code',
          })}
          placeholder="Please enter the job code"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the job code" defaultMessage="Please enter the job code" />,                  
            },
          ]}
        />
        <ProFormDigit
          name="postSort"
          label={intl.formatMessage({
            id: 'system.post.post_sort',
            defaultMessage: 'ORDER',
          })}
          placeholder="Please enter the display order"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the display order" defaultMessage="Please enter the display order" />,                  
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.post.status',
            defaultMessage: 'status',
          })}
          placeholder="Please enter the status"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the status" defaultMessage="Please enter the status" />,                  
            },
          ]}
        />
        <ProFormTextArea
          name="remark"
          label={intl.formatMessage({
            id: 'system.post.remark',
            defaultMessage: 'remark',
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

export default PostForm;
