
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess, history, useParams } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getDictDataList, removeDictData, addDictData, updateDictData, exportDictData } from '@/services/system/dictdata';
import UpdateForm from './edit';
import { getDictValueEnum, getDictType, getDictTypeOptionSelect } from '@/services/system/dict';
import DictTag from '@/components/DictTag';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.System.DictData) => {
  const hide = message.loading('Adding');
  try {
    const resp = await addDictData({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success('Adding');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('Add failed, please try again!');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.System.DictData) => {
  const hide = message.loading('Updating');
  try {
    const resp = await updateDictData(fields);
    hide();
    if (resp.code === 200) {
      message.success('update success');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 * Delete节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.System.DictData[]) => {
  const hide = message.loading('');
  if (!selectedRows) return true;
  try {
    const resp = await removeDictData(selectedRows.map((row) => row.dictCode).join(','));
    hide();
    if (resp.code === 200) {
      message.success('Delete successful, about to refresh');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const handleRemoveOne = async (selectedRow: API.System.DictData) => {
  const hide = message.loading('Deleting');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.dictCode];
    const resp = await removeDictData(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success('Delete successful, about to refresh');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

/**
 * 导出数据
 *
 *
 */
const handleExport = async () => {
  const hide = message.loading('Exporting');
  try {
    await exportDictData();
    hide();
    message.success('Export successful');
    return true;
  } catch (error) {
    hide();
    message.error('Export failed, please try again');
    return false;
  }
};

export type DictTypeArgs = {
  id: string;
};


const DictDataTableList: React.FC = () => {

  const formTableRef = useRef<FormInstance>();

  const [dictId, setDictId] = useState<string>('');
  const [dictType, setDictType] = useState<string>('');

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.System.DictData>();
  const [selectedRows, setSelectedRows] = useState<API.System.DictData[]>([]);

  const [dictTypeOptions, setDictTypeOptions] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  const params = useParams();
  if (params.id === undefined) {
    history.push('/system/dict');
  }
  const id = params.id || '0';

  useEffect(() => {
    if (dictId !== id) {
      setDictId(id);
      getDictTypeOptionSelect().then((res) => {
        if (res.code === 200) {
          const opts: any = {};
          res.data.forEach((item: any) => {
            opts[item.dictType] = item.dictName;
          });
          setDictTypeOptions(opts);
        }
      });
      getDictValueEnum('sys_normal_disable').then((data) => {
        setStatusOptions(data);
      });
      getDictType(id).then((res) => {
        if (res.code === 200) {
          setDictType(res.data.dictType);
          formTableRef.current?.setFieldsValue({
            dictType: res.data.dictType,
          });
          actionRef.current?.reloadAndRest?.();
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [dictId, dictType, params]);

  const columns: ProColumns<API.System.DictData>[] = [
    {
      title: <FormattedMessage id="system.dict.data.dict_code" defaultMessage="dictionary coding" />,
      dataIndex: 'dictCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.dict.data.dict_label" defaultMessage="Dictionary label" />,
      dataIndex: 'dictLabel',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.dict.data.dict_type" defaultMessage="Dictionary Type" />,
      dataIndex: 'dictType',
      valueType: 'select',
      hideInTable: true,
      valueEnum: dictTypeOptions,
      search: {
        transform: (value) => {
          setDictType(value);
          return value;
        },
      },
    },
    {
      title: <FormattedMessage id="system.dict.data.dict_value" defaultMessage="Dictionary key value" />,
      dataIndex: 'dictValue',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.dict.data.dict_sort" defaultMessage="Dictionary sorting" />,
      dataIndex: 'dictSort',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.dict.data.status" defaultMessage="state" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
      render: (_, record) => {
        return (<DictTag enums={statusOptions} value={record.status} />);
      },
    },
    {
      title: <FormattedMessage id="system.dict.data.remark" defaultMessage="remark" />,
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.dict.data.create_time" defaultMessage="createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, record) => {
        return (<span>{record.createTime.toString()} </span>);
      },
      search: {
        transform: (value) => {
          return {
            'params[beginTime]': value[0],
            'params[endTime]': value[1],
          };
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="option" />,
      dataIndex: 'option',
      width: '120px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!access.hasPerms('system:data:edit')}
          onClick={() => {
            setModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('system:data:remove')}
          onClick={async () => {
            Modal.confirm({
              title: 'Delete',
              content: 'Are you sure to delete this item?',
              okText: 'Confirm',
              cancelText: 'Cancel',
              onOk: async () => {
                const success = await handleRemoveOne(record);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            });
          }}
        >
          Delete
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<API.System.DictData>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: 'information',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="dictCode"
          key="dataList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('system:data:add')}
              onClick={async () => {
                setCurrentRow({ dictType: dictType, isDefault: 'N', status: '0' } as API.System.DictData);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="new-built" />
            </Button>,
            <Button
              type="primary"
              key="remove"
              hidden={selectedRows?.length === 0 || !access.hasPerms('system:data:remove')}
              onClick={async () => {
                Modal.confirm({
                  title: 'Confirm Delete the selected data item?',
                  icon: <ExclamationCircleOutlined />,
                  content: 'Please operate with caution',
                  async onOk() {
                    const success = await handleRemove(selectedRows);
                    if (success) {
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }
                  },
                  onCancel() { },
                });
              }}
            >
              <DeleteOutlined />
              <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete" />
            </Button>,
            <Button
              type="primary"
              key="export"
              hidden={!access.hasPerms('system:data:export')}
              onClick={async () => {
                handleExport();
              }}
            >
              <PlusOutlined />
              <FormattedMessage id="pages.searchTable.export" defaultMessage="export" />
            </Button>,
          ]}
          request={(params) =>
            getDictDataList({ ...params, dictType } as API.System.DictDataListParams).then((res) => {
              const result = {
                data: res.rows,
                total: res.total,
                success: true,
              };
              return result;
            })
          }
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
      </div>
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Selected" />
              <a style={{ fontWeight: 600 }}>{selectedRows.length}</a>
              <FormattedMessage id="pages.searchTable.item" defaultMessage="term" />
            </div>
          }
        >
          <Button
            key="remove"
            hidden={!access.hasPerms('system:data:del')}
            onClick={async () => {
              Modal.confirm({
                title: 'Delete',
                content: 'Are you sure to delete this item?',
                okText: 'Confirm',
                cancelText: 'Cancel',
                onOk: async () => {
                  const success = await handleRemove(selectedRows);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                },
              });
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="Batch Delete" />
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          if (values.dictCode) {
            success = await handleUpdate({ ...values } as API.System.DictData);
          } else {
            success = await handleAdd({ ...values } as API.System.DictData);
          }
          if (success) {
            setModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        open={modalVisible}
        values={currentRow || {}}
        statusOptions={statusOptions}
      />
    </PageContainer>
  );
};

export default DictDataTableList;
