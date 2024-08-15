import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal} from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { DictValueEnumObj } from '@/components/DictTag';

export type DataFormData = Record<string, unknown> & Partial<API.System.DictData>;

export type DataFormProps = {
  onCancel: (flag?: boolean, formVals?: DataFormData) => void;
  onSubmit: (values: DataFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.DictData>;
  statusOptions: DictValueEnumObj;
};

const DictDataForm: React.FC<DataFormProps> = (props) => {
  const [form] = Form.useForm();

  const { statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      dictCode: props.values.dictCode,
      dictSort: props.values.dictSort,
      dictLabel: props.values.dictLabel,
      dictValue: props.values.dictValue,
      dictType: props.values.dictType,
      cssClass: props.values.cssClass,
      listClass: props.values.listClass,
      isDefault: props.values.isDefault,
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
    props.onSubmit(values as DataFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.dict.data.title',
        defaultMessage: 'Edit dictionary data',
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
          name="dictCode"
          label={intl.formatMessage({
            id: 'system.dict.data.dict_code',
            defaultMessage: 'dictionary code',
          })}
          colProps={{ md: 24, xl: 24 }}
          placeholder="Please enter dictionary code"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter dictionary code" defaultMessage="Please enter dictionary code" />,
            },
          ]}
        />
        <ProFormText
          name="dictType"
          label={intl.formatMessage({
            id: 'system.dict.data.dict_type',
            defaultMessage: 'Dictionary Type',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter the dictionary type"
          disabled
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the dictionary type" defaultMessage="Please enter the dictionary type" />,
            },
          ]}
        />
        <ProFormText
          name="dictLabel"
          label={intl.formatMessage({
            id: 'system.dict.data.dict_label',
            defaultMessage: 'Dictionary label',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter dictionary label"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter dictionary label" defaultMessage="Please enter dictionary label" />,
            },
          ]}
        />
        <ProFormText
          name="dictValue"
          label={intl.formatMessage({
            id: 'system.dict.data.dict_value',
            defaultMessage: 'Dictionary key value',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter dictionary key value"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter dictionary key value" defaultMessage="Please enter dictionary key value" />,
            },
          ]}
        />
        <ProFormText
          name="cssClass"
          label={intl.formatMessage({
            id: 'system.dict.data.css_class',
            defaultMessage: 'Style attribute',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter style attributes"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter style attributes" defaultMessage="Please enter style attributes" />,
            },
          ]}
        />
        <ProFormSelect
          name="listClass"
          label={intl.formatMessage({
            id: 'system.dict.data.list_class',
            defaultMessage: 'Echo style',
          })}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter the echo style"
          valueEnum={{
            'default': 'default',
            'primary': 'primary',
            'success': 'success',
            'info': 'info',
            'warning': 'warning',
            'danger': 'danger',
          }}
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter the display style!" defaultMessage="Please enter the display style!" />,
            },
          ]}
        />
        <ProFormDigit
          name="dictSort"
          label={intl.formatMessage({
            id: 'system.dict.data.dict_sort',
            defaultMessage: 'Dictionary sorting',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder="Please enter dictionary sorting"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter dictionary sorting" defaultMessage="Please enter dictionary sorting" />,
            },
          ]}
        />
        <ProFormRadio.Group
          name="isDefault"
          label={intl.formatMessage({
            id: 'system.dict.data.is_default',
            defaultMessage: 'Is it default',
          })}
          valueEnum={{
            'Y': 'yes',
            'N': 'no',
          }}
          initialValue={'N'}
          colProps={{ md: 12, xl: 24 }}
          placeholder="Please enter whether to default or not"
          rules={[
            {
              required: false,
              message: <FormattedMessage id="Please enter whether to default or not" defaultMessage="Please enter whether to default or not" />,
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.dict.data.status',
            defaultMessage: 'status',
          })}
          initialValue={'0'}
          colProps={{ md: 12, xl: 24 }}
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
            id: 'system.dict.data.remark',
            defaultMessage: 'remark',
          })}
          colProps={{ md: 24, xl: 24 }}
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

export default DictDataForm;
