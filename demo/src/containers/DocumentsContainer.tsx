import React from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';

import documents from '../docs';
import Doc from '../docs/Doc';
import './ExamplesContainer.css';

const DocumentView: React.FC = () => {
  const { document } = useParams<{ document: string }>();

  if (!document || !documents[document]) {
    return <Segment>Document not found: {document}</Segment>;
  }

  return <Doc document={document} />;
};

const DocumentsContainer: React.FC = () => {
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
