import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from '../../components/PostListItem/PostListItem.css';

// Import Actions
import { fetchPost, addCommentToPostRequest, editPostCommentRequest, deletePostCommentRequest } from '../../PostActions';

// Import Selectors
import { getPost } from '../../PostReducer';

// Import Components
import CommentList from '../../components/CommentList/CommentList';
import CommentForm from '../../components/CommentForm/CommentForm';
import Button from '../../../App/components/Button/Button';

class PostDetailPage extends Component {
  state = {
    isShowAddComment: false,
  };
  handleDeleteComment = (commentId) => {
    this.props.dispatch(deletePostCommentRequest(commentId, this.props.post.cuid));
  };
  handleSubmitAddComment = (author, text) => {
    this.handleShowAddComment();
    this.props.dispatch(addCommentToPostRequest({ author, text },
      this.props.post.cuid));
  };
  handleShowAddComment = () => this.setState(({ isShowAddComment }) => ({ isShowAddComment: !isShowAddComment }))
  handleSubmitEditComment = (author, text, cuid) => {
    this.props.dispatch(editPostCommentRequest({ author, text, cuid }, this.props.post.cuid));
  };
  render() {
    return (
      <div>
        <Helmet title={this.props.post.title} />
        <div className={`${styles['single-post']} ${styles['post-detail']}`}>
          <h3 className={styles['post-title']}>{this.props.post.title}</h3>
          <p className={styles['author-name']}><FormattedMessage id="by" /> {this.props.post.name}</p>
          <p className={styles['post-desc']}>{this.props.post.content}</p>
        </div>
        <div>
          {this.state.isShowAddComment ? (
            <CommentForm
              onSubmit={this.handleSubmitAddComment}
              onCancel={this.handleShowAddComment}
            />
          ) : (
            <Button onClick={this.handleShowAddComment}>
              <FormattedMessage id="addComment" />
            </Button>
          )}
          <CommentList
            postId={this.props.post.cuid}
            onDeleteComment={this.handleDeleteComment}
            onEditComment={this.handleSubmitEditComment}
            comments={this.props.post.comments}
          />
        </div>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in server side.
PostDetailPage.need = [params => {
  return fetchPost(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    post: getPost(state, props.params.cuid),
  };
}

PostDetailPage.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
    comments: PropTypes.array,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(PostDetailPage);
