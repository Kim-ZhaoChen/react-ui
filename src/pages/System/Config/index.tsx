
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { getConfigList, removeConfig, addConfig, updateConfig, exportConfig, refreshConfigCache } from '@/services/system/config';
import UpdateForm from './edit';
import { getDictValueEnum } from '@/services/system/dict';
import DictTag from '@/components/DictTag';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.System.Config) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addConfig({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success('添加成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.System.Config) => {
  const hide = message.loading('Updating');
  try {
    const resp = await updateConfig(fields);
    hide();
    if (resp.code === 200) {
      message.success('update success');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * Delete节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.System.Config[]) => {
  const hide = message.loading('正在Delete');
  if (!selectedRows) return true;
  try {
    const resp = await removeConfig(selectedRows.map((row) => row.configId).join(','));
    hide();
    if (resp.code === 200) {
      message.success('Delete成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('Delete失败，请重试');
    return false;
  }
};

const handleRemoveOne = async (selectedRow: API.System.Config) => {
  const hide = message.loading('正在Delete');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.configId];
    const resp = await removeConfig(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success('Delete成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('Delete失败，请重试');
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
    await exportConfig();
    hide();
    message.success('Export successful');
    return true;
  } catch (error) {
    hide();
    message.error('Export failed, please try again');
    return false;
  }
};

const handleRefreshCache = async () => {
  const hide = message.loading('正在刷新');
  try {
    await refreshConfigCache();
    hide();
    message.success('刷新成功');
    return true;
  } catch (error) {
    hide();
    message.error('刷新失败，请重试');
    return false;
  }
};

const ConfigTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.System.Config>();
  const [selectedRows, setSelectedRows] = useState<API.System.Config[]>([]);

  const [configTypeOptions, setConfigTypeOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getDictValueEnum('sys_yes_no').then((data) => {
      setConfigTypeOptions(data);
    });
  }, []);

  const columns: ProColumns<API.System.Config>[] = [
    {
      title: <FormattedMessage id="system.config.config_id" defaultMessage="Parameter primary key" />,
      dataIndex: 'configId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.config.config_name" defaultMessage="Parameter Name" />,
      dataIndex: 'configName',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.config.config_key" defaultMessage="Parameter Key Name" />,
      dataIndex: 'configKey',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.config.config_value" defaultMessage="ParameterVakue" />,
      dataIndex: 'configValue',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="system.config.config_type" defaultMessage="Built in system" />,
      dataIndex: 'configType',
      valueType: 'select',
      valueEnum: configTypeOptions,
      render: (_, record) => {
        return (<DictTag enums={configTypeOptions} value={record.configType} />);
      },
    },
    {
      title: <FormattedMessage id="system.config.remark" defaultMessage="Remark" />,
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '120px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!access.hasPerms('system:config:edit')}
          onClick={() => {
            setModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Edit
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('system:config:remove')}
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
        <ProTable<API.System.Config>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="configId"
          key="configList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('system:config:add')}
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
            </Button>,
            <Button
              type="primary"
              key="remove"
              danger
              hidden={selectedRows?.length === 0 || !access.hasPerms('system:config:remove')}
              onClick={async () => {
                Modal.confirm({
                  title: '是否ConfirmDelete所选数据项?',
                  icon: <ExclamationCircleOutlined />,
                  content: '请谨慎操作',
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
              hidden={!access.hasPerms('system:config:export')}
              onClick={async () => {
                handleExport();
              }}
            >
              <DownloadOutlined />
              <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
            </Button>,
            <Button
              type="primary"
              key="refresh"
              danger
              hidden={!access.hasPerms('system:config:remove')}
              onClick={async () => {
                handleRefreshCache();
              }}
            >
              <ReloadOutlined />
              <FormattedMessage id="system.config.refreshCache" defaultMessage="刷新缓存" />
            </Button>,
          ]}
          request={(params) =>
            getConfigList({ ...params } as API.System.ConfigListParams).then((res) => {
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
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />
              <a style={{ fontWeight: 600 }}>{selectedRows.length}</a>
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            key="remove"
            hidden={!access.hasPerms('system:config:del')}
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
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量Delete" />
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          if (values.configId) {
            success = await handleUpdate({ ...values } as API.System.Config);
          } else {
            success = await handleAdd({ ...values } as API.System.Config);
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
        configTypeOptions={configTypeOptions}
      />
    </PageContainer>
  );
};

export default ConfigTableList;
