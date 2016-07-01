define([
  'react',
  'react-modal',
  'i18n!course_images',
  '../actions',
  './CourseImagePicker'
], (React, Modal, I18n, Actions, CourseImagePicker) => {

  const modalOverrides = {
    content : {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      border: 'none',
      padding: '12px',
      maxWidth: '1420px',
      borderRadius: '0',
      background: '#ffffff'
    }
  };

  class CourseImageSelector extends React.Component {

    constructor (props) {
      super(props);
      this.state = props.store.getState();

      this.handleChange = this.handleChange.bind(this);
      this.handleModalClose = this.handleModalClose.bind(this);
      this.changeImage = this.changeImage.bind(this);
      this.removeImage = this.removeImage.bind(this);
    }

    componentWillMount () {
      this.props.store.subscribe(this.handleChange);
      this.props.store.dispatch(Actions.getCourseImage(this.props.courseId));
      this.setState({gettingImage: true});
    }

    handleChange () {
      this.setState(this.props.store.getState());
    }

    handleModalClose () {
      this.props.store.dispatch(Actions.setModalVisibility(false));
    }

    changeImage() {
      this.props.store.dispatch(Actions.setModalVisibility(true));
    }

    removeImage() {
      this.props.store.dispatch(Actions.removeImage());
    }

    imageControls () {
      if (this.state.imageUrl) {
        return (
          <div>
            <div className="al-dropdown__container CourseImageSelector__EditDropdown">
              <a className="al-trigger" role="button" href="#">
                <i className="icon-settings"></i>
                <i className="icon-mini-arrow-down"></i>
                <span className="screenreader-only">{I18n.t('Course image settings')}</span>
              </a>

              <ul id="courseImage-editDropdown-1"
                  ref="editDropdown" 
                  className="al-options" 
                  role="menu" 
                  tabIndex="0" 
                  aria-hidden="true" 
                  aria-expanded="false" 
                  aria-activedescendant="courseImage-editDropdown-2"
              >
                <li role="presentation">
                  <a href="#" 
                     onClick={() => this.changeImage()}
                     className="icon-compose" 
                     id="courseImage-editDropdown-2"
                     tabIndex="-1"
                     ref="changeImage"  
                     role="menuitem" 
                  >
                    {I18n.t('Change image')}
                  </a>
                </li>
                <li role="presentation">
                  <a href="#"
                     onClick={() => this.removeImage()} 
                     className="icon-trash" 
                     id="courseImage-editDropdown-3"
                     tabIndex="-1"
                     ref="removeImage" 
                     role="menuitem" 
                  >
                     {I18n.t('Remove image')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        );
      }
      else if (!this.state.gettingImage) {
        return (
          <button
            className="Button"
            type="button"
            onClick={() => this.props.store.dispatch(Actions.setModalVisibility(true))}
          >
            {I18n.t('Choose Image')}
          </button>
        );
      }
      else {
        //TODO: Replace with InstUI spinner
        return (
          <div>
            {I18n.t('Loading...')}
          </div>);
      }
    }

    render () {

      const styles = {
        backgroundImage: `url(${this.state.imageUrl})`
      };

      var value = this.state.removeImage ? true : this.state.courseImage;

      return (
        <div>
          <input
            ref="hiddenInput"
            type="hidden"
            name={this.state.hiddenInputName}
            value={value}
          />
          <div
            className="CourseImageSelector"
            style={(this.state.imageUrl) ? styles : {}}
          >
            {this.imageControls()}
          </div>
          <Modal
            isOpen={this.state.showModal}
            onRequestClose={this.handleModalClose}
            style={modalOverrides}
          >
            <CourseImagePicker
              courseId={this.props.courseId}
              handleClose={this.handleModalClose}
              handleFileUpload={(e, courseId) => this.props.store.dispatch(Actions.uploadFile(e, courseId))}
              handleFlickrUrlUpload={(flickrUrl) => this.props.store.dispatch(Actions.setCourseImageUrl(flickrUrl))}
            />
          </Modal>
        </div>
      );
    }
  };

  return CourseImageSelector;

});