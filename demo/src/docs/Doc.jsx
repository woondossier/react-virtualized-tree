import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';

import { getDocumentFetchUrl } from '../toolbelt';

class Doc extends Component {
  state = {
    doc: null,
    loading: true,
  };

  componentDidMount() {
    this.loadDoc(this.props.document);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.document !== this.props.document) {
      this.setState({ doc: null, loading: true }, () => {
        this.loadDoc(this.props.document);
      });
    }
  }

  loadDoc = (docName) => {
    fetch(getDocumentFetchUrl(docName))
        .then((res) => res.text())
        .then((doc) => this.setState({ doc, loading: false }))
        .catch((err) => {
          console.error('Failed to load document:', err);
          this.setState({ doc: 'Error loading document.', loading: false });
        });
  };

  render() {
    const { doc, loading } = this.state;

    return loading ? (
        <Loader active inline="centered" />
    ) : (
        <ReactMarkdown>{doc}</ReactMarkdown>
    );
  }
}

export default Doc;
