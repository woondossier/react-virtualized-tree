import React, { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';

import { getDocumentFetchUrl } from '../toolbelt';

const Doc = () => {
  const { document } = useParams();
  const [docContent, setDocContent] = useState(null);

  useEffect(() => {
    setDocContent(null); // Reset while loading

    fetch(getDocumentFetchUrl(document))
      .then((res) => res.text())
      .then((markdown) => setDocContent(markdown));
  }, [document]);

  return !docContent ? (
    <Loader active inline="centered" />
  ) : (
    <ReactMarkdown>{docContent}</ReactMarkdown>
  );
};

export default Doc;
