import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';

import { getDocumentFetchUrl } from '../toolbelt';

interface DocProps {
  document: string;
}

interface DocState {
  doc: string | null;
  loading: boolean;
}

class Doc extends Component<DocProps, DocState> {
  state: DocState = {
    doc: null,
    loading: true,
  };

  componentDidMount() {
    this.loadDoc(this.props.document);
  }

  componentDidUpdate(prevProps: DocProps) {
    if (prevProps.document !== this.props.document) {
      this.setState({ doc: null, loading: true }, () => {
        this.loadDoc(this.props.document);
      });
    }
  }

  loadDoc = (docName: string) => {
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
      <ReactMarkdown>{doc || ''}</ReactMarkdown>
    );
  }
}

export default Doc;
