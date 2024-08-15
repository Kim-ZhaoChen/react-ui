import React, { useEffect, useState } from 'react';
import { Checkbox, Col, Form, Modal, Row, Tree } from 'antd';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Key, ProForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { DataNode } from 'antd/es/tree';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2023/02/06
 * 
 * */

export type FormValueType = any & Partial<API.System.Dept>;

export type DataScopeFormProps = {
    onCancel: (flag?: boolean, formVals?: FormValueType) => void;
    onSubmit: (values: FormValueType) => Promise<void>;
    open: boolean;
    values: Partial<API.System.Role>;
    deptTree: DataNode[];
    deptCheckedKeys: string[];
};

const DataScopeForm: React.FC<DataScopeFormProps> = (props) => {
    const [form] = Form.useForm();

    const { deptTree, deptCheckedKeys } = props;
    const [dataScopeType, setDataScopeType] = useState<string | undefined>('1');
    const [deptIds, setDeptIds] = useState<string[] | {checked: string[], halfChecked: string[]}>([]);
    const [deptTreeExpandKey, setDeptTreeExpandKey] = useState<Key[]>([]);
    const [checkStrictly, setCheckStrictly] = useState<boolean>(true);


    useEffect(() => {
        setDeptIds(deptCheckedKeys);
        form.resetFields();
        form.setFieldsValue({
            roleId: props.values.roleId,
            roleName: props.values.roleName,
            roleKey: props.values.roleKey,
            dataScope: props.values.dataScope,
        });
        setDataScopeType(props.values.dataScope);
    }, [props.values]);

    const intl = useIntl();
    const handleOk = () => {
        form.submit();
    };
    const handleCancel = () => {
        props.onCancel();
    };
    const handleFinish = async (values: Record<string, any>) => {
        props.onSubmit({ ...values, deptIds } as FormValueType);
    };

    const getAllDeptNode = (node: DataNode[]) => {
        let keys: any[] = [];
        node.forEach(value => {
            keys.push(value.key);
            if(value.children) {
                keys = keys.concat(getAllDeptNode(value.children));
            }
        });
        return keys;
    }

    const deptAllNodes = getAllDeptNode(deptTree);


    const onDeptOptionChange = (checkedValues: CheckboxValueType[]) => {
        if(checkedValues.includes('deptExpand')) {
            setDeptTreeExpandKey(deptAllNodes);
        } else {
            setDeptTreeExpandKey([]);
        }
        if(checkedValues.includes('deptNodeAll')) {
            setDeptIds(deptAllNodes);
        } else {
            setDeptIds([]);
        }
        
        if(checkedValues.includes('deptCheckStrictly')) {
            setCheckStrictly(false);
        } else {
            setCheckStrictly(true);
        }
    };

    return (
        <Modal
            width={640}
            title={intl.formatMessage({
                id: 'system.user.auth.role',
                defaultMessage: 'Assigning roles',
            })}
            open={props.open}
            destroyOnClose
            forceRender
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <ProForm
                form={form}
                grid={true}
                layout="horizontal"
                onFinish={handleFinish}
                initialValues={{
                    login_password: '',
                    confirm_password: '',
                }}
            >

                <ProFormDigit
                    name="roleId"
                    label={intl.formatMessage({
                        id: 'system.role.role_id',
                        defaultMessage: 'Role Number',
                    })}
                    colProps={{ md: 12, xl: 12 }}
                    placeholder="Please enter the role number"
                    disabled
                    hidden={true}
                    rules={[
                        {
                            required: false,
                            message: <FormattedMessage id="Please enter the role number" defaultMessage="Please enter the role number" />,
                        },
                    ]}
                />
                <ProFormText
                    name="roleName"
                    label={intl.formatMessage({
                        id: 'system.role.role_name',
                        defaultMessage: 'role name',
                    })}
                    disabled
                    placeholder="Please enter the role name"
                    rules={[
                        {
                            required: true,
                            message: <FormattedMessage id="Please enter the role name" defaultMessage="Please enter the role name" />,
                        },
                    ]}
                />
                <ProFormText
                    name="roleKey"
                    label={intl.formatMessage({
                        id: 'system.role.role_key',
                        defaultMessage: 'Permission string',
                    })}
                    disabled
                    placeholder="Please enter the character permission string"
                    rules={[
                        {
                            required: true,
                            message: <FormattedMessage id="Please enter the character permission string" defaultMessage="Please enter the character permission string" />,
                        },
                    ]}
                />
                <ProFormSelect
                    name="dataScope"
                    label='purview'
                    initialValue={'1'}
                    placeholder="Please enter the user's gender"
                    valueEnum={{
                        "1": "All data permissions",
                        "2": "Customize data permissions",
                        "3": "Data permissions for this department",
                        "4": "Data permissions for this department and below",
                        "5": "Only have personal data permissions"
                    }}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    fieldProps={{
                        onChange: (value) => {
                            setDataScopeType(value);
                        },
                    }}
                />
                <ProForm.Item
                    name="deptIds"
                    label={intl.formatMessage({
                        id: 'system.role.auth',
                        defaultMessage: '',
                    })}
                    required={dataScopeType === '1'}
                    hidden={dataScopeType !== '1'}
                >
                    <Row gutter={[16, 16]}>
                        <Col md={24}>
                            <Checkbox.Group
                                options={[
                                    { label: 'Expand/Collapse', value: 'deptExpand' },
                                    { label: 'Select All/Select None', value: 'deptNodeAll' },
                                    // { label: '父子联动', value: 'deptCheckStrictly' },
                                ]}
                                onChange={onDeptOptionChange} />
                        </Col>
                        <Col md={24}>
                            <Tree
                                checkable={true}
                                checkStrictly={checkStrictly}
                                expandedKeys={deptTreeExpandKey}
                                treeData={deptTree}
                                checkedKeys={deptIds}
                                defaultCheckedKeys={deptCheckedKeys}
                                onCheck={(checkedKeys: any, checkInfo: any) => {
                                    console.log(checkedKeys, checkInfo);
                                    if(checkStrictly) {
                                        return setDeptIds(checkedKeys.checked);
                                    } else {
                                        return setDeptIds({checked: checkedKeys, halfChecked: checkInfo.halfCheckedKeys});
                                    }
                                }}
                                onExpand={(expandedKeys: Key[]) => {
                                    setDeptTreeExpandKey(deptTreeExpandKey.concat(expandedKeys));
                                }}
                            />
                        </Col>
                    </Row>
                </ProForm.Item>
            </ProForm>
        </Modal>
    );
};

export default DataScopeForm;
