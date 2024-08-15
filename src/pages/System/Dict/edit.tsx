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

export type DictTypeFormData = Record<string, unknown> & Partial<API.System.DictType>;

export type DictTypeFormProps = {
  onCancel: (flag?: boolean, formVals?: DictTypeFormData) => void;
  onSubmit: (values: DictTypeFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.DictType>;
  statusOptions: DictValueEnumObj;
};

const DictTypeForm: React.FC<DictTypeFormProps> = (props) => {
  const [form] = Form.useForm();

  const { statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
			dictId: props.values.dictId,
			dictName: props.values.dictName,
			dictType: props.values.dictType,
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
    props.onSubmit(values as DictTypeFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.dict.title',
        defaultMessage: 'Edit dictionary type',
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
          name="dictId"
          label={intl.formatMessage({
            id: 'system.dict.dict_id',
            defaultMessage: 'Dictionary primary key',
          })}
          placeholder="Please enter the dictionary primary key"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the dictionary primary key" defaultMessage="Please enter the dictionary primary key" />,
            },
          ]}
        />
        <ProFormText
          name="dictName"
          label={intl.formatMessage({
            id: 'system.dict.dict_name',
            defaultMessage: 'Dictionary name',
          })}
          placeholder="Please enter the dictionary name"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the dictionary name" defaultMessage="Please enter the dictionary name" />,
            },
          ]}
        />
        <ProFormText
          name="dictType"
          label={intl.formatMessage({
            id: 'system.dict.dict_type',
            defaultMessage: 'Dictionary Type',
          })}
          placeholder="Please enter the dictionary type"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the dictionary type" defaultMessage="Please enter the dictionary type" />,
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.dict.status',
            defaultMessage: 'status',
          })}
          initialValue={'0'}
          placeholder="Please enter the status"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the status" defaultMessage="Please enter the status" />,
            },
          ]}
        />
        <ProFormTextArea
          name="remark"
          label={intl.formatMessage({
            id: 'system.dict.remark',
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

export default DictTypeForm;
