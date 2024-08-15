import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormRadio,
  } from '@ant-design/pro-components';
import { Form, Modal} from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { DictValueEnumObj } from '@/components/DictTag';

export type NoticeFormData = Record<string, unknown> & Partial<API.System.Notice>;

export type NoticeFormProps = {
  onCancel: (flag?: boolean, formVals?: NoticeFormData) => void;
  onSubmit: (values: NoticeFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Notice>;
  noticeTypeOptions: DictValueEnumObj;
  statusOptions: DictValueEnumObj;
};

const NoticeForm: React.FC<NoticeFormProps> = (props) => {
  const [form] = Form.useForm();
  
  const { noticeTypeOptions,statusOptions, } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
			noticeId: props.values.noticeId,
			noticeTitle: props.values.noticeTitle,
			noticeType: props.values.noticeType,
			noticeContent: props.values.noticeContent,
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
    props.onSubmit(values as NoticeFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.notice.title',
        defaultMessage: 'Editor Notice Announcement',
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
        submitter={false}
        layout="horizontal" 
        onFinish={handleFinish}>
        <ProFormDigit
          name="noticeId"
          label={intl.formatMessage({
            id: 'system.notice.notice_id',
            defaultMessage: 'Announcement Number',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter the announcement number"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the announcement number" defaultMessage="Please enter the announcement number" />,                  
            },
          ]}
        />
        <ProFormText
          name="noticeTitle"
          label={intl.formatMessage({
            id: 'system.notice.notice_title',
            defaultMessage: 'Announcement Title',
          })}
          placeholder="Please enter the announcement title"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the announcement title" defaultMessage="Please enter the announcement title" />,                  
            },
          ]}
        />
        <ProFormSelect
          valueEnum={noticeTypeOptions}
          name="noticeType"
          label={intl.formatMessage({
            id: 'system.notice.notice_type',
            defaultMessage: 'Announcement type',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter the type of announcement"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="Please enter the type of announcement" defaultMessage="Please enter the type of announcement" />,                  
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.notice.status',
            defaultMessage: 'Announcement status',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter the announcement status"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the announcement status" defaultMessage="Please enter the announcement status" />,                  
            },
          ]}
        />
        <ProFormTextArea
          name="noticeContent"
          label={intl.formatMessage({
            id: 'system.notice.notice_content',
            defaultMessage: 'Announcement Content',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter the announcement content"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the announcement content" defaultMessage="Please enter the announcement content" />,                  
            },
          ]}
        />
        <ProFormText
          name="remark"
          label={intl.formatMessage({
            id: 'system.notice.remark',
            defaultMessage: 'remark',
          })}
          colProps={{ md: 12, xl: 24 }}
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

export default NoticeForm;
