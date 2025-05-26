import React from 'react';
import { Grid, Menu, Segment, Header } from 'semantic-ui-react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';

import documents from '../docs';
import Doc from '../docs/Doc.jsx';
import './ExamplesContainer.css';

const DocumentView = () => {
  const { document } = useParams();

  if (!documents[document]) {
    return <Segment>Document not found: {document}</Segment>;
  }

  return <Doc document={document} />;
};

const DocumentsContainer = () => {
  const location = useLocation();

  return (
      <Grid>
        <Grid.Column width={4}>
          <Menu fluid vertical tabular>
            {Object.keys(documents).map((path) => (
                <Link to={`/docs/${path}`} key={path}>
                  <Menu.Item
                      name={documents[path].name}
                      active={location.pathname === `/docs/${path}`}
                  />
                </Link>
            ))}
          </Menu>
        </Grid.Column>

        <Grid.Column width={12}>
          <Routes>
            <Route path=":document" element={<DocumentView />} />
          </Routes>
        </Grid.Column>
      </Grid>
  );
};

export default DocumentsContainer;
