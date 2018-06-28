/**
 * 本地播放队列
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Button, Table, Tag, Popconfirm } from 'antd'
import ActionGroup from '../ActionGroup'
import { clearPlaylist, upsetPlaylist } from 'renderer/actions'
import './index.less'

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist,
  playing: state.playing
})

class Playlist extends Component {
  state = {
    current: 0, // 页码
    pageSize: 10 // 分页大小
  }

  static propTypes = {
    playlist: PropTypes.array,
    playing: PropTypes.object
  }

  static defaultProps = {
    playlist: [],
    playing: {}
  }

  // 设置当前页码
  setCurrent = current => {
    this.setState({ current })
  }

  componentWillReceiveProps (nextProps) {
    const { pageSize } = this.state
    // 只有playing改变才说明是新的歌曲
    if (nextProps.playing !== this.props.playing) {
      const { playlist, playing } = nextProps
      const idx = playlist.findIndex(item => item.id === playing.id)
      let current = 1
      if (idx !== -1) {
        current = Math.floor((idx + pageSize) / pageSize)
      }
      // 切换到播放歌曲的页码
      this.setCurrent(current)
    }
   }

  render () {
    const { current, pageSize } = this.state
    const { playlist, playing, dispatch } = this.props
    const columns = [{
      title: '歌曲',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return playing.id === record.id
          ? <span>
            {record.name}<Tag color="magenta" style={{marginLeft: 10}}>正在播放</Tag>
          </span>
          : record.name
      }
    }, {
      title: '歌手',
      dataIndex: 'artists',
      key: 'artists',
      width: '40%',
      render: (text, record) => record.artists[0].name
    }, {
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => <ActionGroup
        actions={['play', 'remove']}
        song={record} />
    }]
    const enabled = playlist && playlist.length
    return <div className="playlist">
      <div className="operations">
        <Button icon="rocket" size="small" disabled={!enabled} onClick={() => dispatch(upsetPlaylist())}>打乱顺序</Button>
        <Popconfirm title="你真的要清空整个队列吗?" onConfirm={() => dispatch(clearPlaylist())} okText="确认" cancelText="取消">
          <Button icon="delete" size="small" type="danger" disabled={!enabled}>清空播放队列</Button>
        </Popconfirm>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={playlist}
        pagination={{
          current,
          pageSize: pageSize,
          total: playlist && playlist.length,
          onChange: this.setCurrent
        }}
        locale={{
          emptyText: '暂无歌曲'
        }}
        rowKey="id" />
    </div>
  }
}

export default connect(mapStateToProps)(Playlist)
