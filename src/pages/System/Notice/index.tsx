
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getNoticeList, removeNotice, addNotice, updateNotice, exportNotice } from '@/services/system/notice';
import UpdateForm from './edit';
import { getDictValueEnum } from '@/services/system/dict';
import DictTag from '@/components/DictTag';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.System.Notice) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addNotice({ ...fields });
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
const handleUpdate = async (fields: API.System.Notice) => {
  const hide = message.loading('Updating');
  try {
    const resp = await updateNotice(fields);
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
const handleRemove = async (selectedRows: API.System.Notice[]) => {
  const hide = message.loading('正在Delete');
  if (!selectedRows) return true;
  try {
    const resp = await removeNotice(selectedRows.map((row) => row.noticeId).join(','));
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

const handleRemoveOne = async (selectedRow: API.System.Notice) => {
  const hide = message.loading('正在Delete');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.noticeId];
    const resp = await removeNotice(params.join(','));
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
    await exportNotice();
    hide();
    message.success('Export successful');
    return true;
  } catch (error) {
    hide();
    message.error('Export failed, please try again');
    return false;
  }
};


const NoticeTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();  

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.System.Notice>();
  const [selectedRows, setSelectedRows] = useState<API.System.Notice[]>([]);

  const [noticeTypeOptions, setNoticeTypeOptions] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {    
    getDictValueEnum('sys_notice_type').then((data) => {
      setNoticeTypeOptions(data);
    });    
    getDictValueEnum('sys_notice_status').then((data) => {
      setStatusOptions(data);
    });
  }, []);

  const columns: ProColumns<API.System.Notice>[] = [  
    {
      title: <FormattedMessage id="system.notice.notice_id" defaultMessage="NoticeID" />,
      dataIndex: 'noticeId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.notice.notice_title" defaultMessage="NoticeTitle" />,
      dataIndex: 'noticeTitle',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.notice.notice_type" defaultMessage="NoticeType" />,
      dataIndex: 'noticeType',
      valueType: 'select',
      valueEnum: noticeTypeOptions,
    },
    {
      title: <FormattedMessage id="system.notice.notice_content" defaultMessage="NoticeContent" />,
      dataIndex: 'noticeContent',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="system.notice.status" defaultMessage="NoticeStatus" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
      render: (_, record) => {
        return (<DictTag enums={statusOptions} value={record.status} />);
      },
    },
    {
      title: <FormattedMessage id="system.notice.remark" defaultMessage="Remark" />,
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.notice.create_time" defaultMessage="CreateTime" />,
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
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '120px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!access.hasPerms('system:notice:edit')}
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
          hidden={!access.hasPerms('system:notice:remove')}
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
        <ProTable<API.System.Notice>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="noticeId"
          key="noticeList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('system:notice:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('system:notice:remove')}
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
                  onCancel() {},
                }); 
              }}
            >
              <DeleteOutlined />
              <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete" />
            </Button>,
            <Button
              type="primary"
              key="export"
              hidden={!access.hasPerms('system:notice:export')}
              onClick={async () => {
                handleExport();
              }}
            >
              <PlusOutlined />
              <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
            </Button>,
          ]}
          request={(params) =>
            getNoticeList({ ...params } as API.System.NoticeListParams).then((res) => {
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
            hidden={!access.hasPerms('system:notice:del')}
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
          if (values.noticeId) {
            success = await handleUpdate({ ...values } as API.System.Notice);
          } else {
            success = await handleAdd({ ...values } as API.System.Notice);
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
        noticeTypeOptions={noticeTypeOptions}
        statusOptions={statusOptions}
      />
    </PageContainer>
  );
};

export default NoticeTableList;
