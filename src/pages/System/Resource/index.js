import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import IconFont from '@/components/IconFont';
import ResourceForm from './components/ResourceForm';
import styles from '../System.less';

const Resource = props => {
  const { loading, menuTree, list, dispatch } = props;

  // 【当前点击的菜单】
  const [current, setCurrent] = useState(null);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemResource/fetch',
    });
  }, []);

  // 【启用禁用】
  const toggleState = (checked, record) => {
    dispatch({
      type: 'systemResource/update',
      payload: { ...record, status: checked },
    });
  };

  // 【获取子菜单数据】
  const handleSelect = (selectedKeys, info) => {
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    if (info.node.isLeaf()) {
      dispatch({
        type: 'systemResource/fetchChildrenById',
        payload: {
          id,
        },
        callback: () => {
          setCurrent(info.node.props);
        },
      });
    }
  };

  // 【移动】
  const handleGo = (record, direction) => {
    const { id } = record;
    dispatch({
      type: 'systemResource/moveResource',
      payload: {
        id,
        direction,
      },
    });
  };

  // 【删除】
  const deleteItem = id => {
    dispatch({
      type: 'systemResource/delete',
      payload: {
        id,
      },
      callback: () => {
        message.success('删除成功');
      },
    });
  };
  const handleDelete = record => {
    const { id } = record;
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(id),
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '接口名称',
      dataIndex: 'title',
    },
    {
      title: '接口url',
      dataIndex: 'uri',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '方法类型',
      dataIndex: 'method',
    },
    {
      title: '接口状态',
      dataIndex: 'status',
      filters: [{ text: '禁用', value: 0 }, { text: '启用', value: 1 }],
      filterMultiple: false,
      render: (text, record) => {
        return <Switch checked={text} onClick={checked => toggleState(checked, record)} />;
      },
    },
    {
      title: '排序',
      render: (text, record) => (
        <>
          <a
            onClick={() => handleGo(record, 'UP')}
            style={{ padding: '0 5px', marginRight: '10px' }}
          >
            <Icon type="arrow-up" title="向上" />
          </a>
          <a onClick={() => handleGo(record, 'DOWN')}>
            <Icon type="arrow-down" title="向下" />
          </a>
        </>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <ResourceForm isEdit resource={record}>
            <a>
              <IconFont type="icon-edit" title="编辑" />
            </a>
            <Divider type="vertical" />
          </ResourceForm>
          <a onClick={() => handleDelete(record)}>
            <IconFont type="icon-delete" title="删除" />
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            title="资源树"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <Tree treeData={menuTree} onSelect={handleSelect} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={current ? `[${current.title}]的资源` : '资源列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <ResourceForm resource={current}>
                  <Button type="primary" title="新增">
                    <Icon type="plus" />
                  </Button>
                </ResourceForm>
              </div>
              <Table rowKey="id" loading={loading} columns={columns} dataSource={list} />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};

export default connect(({ systemResource: { menuTree, list }, loading }) => ({
  menuTree,
  list,
  loading: loading.models.systemResource,
}))(Resource);
