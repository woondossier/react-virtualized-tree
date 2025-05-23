import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { Link, useLocation, useParams, Routes, Route } from 'react-router-dom';

import documents from '../docs';
import Doc from '../docs/Docs.jsx';
import './ExamplesContainer.css';

const ExamplesContainer = () => {
  const location = useLocation();

  return (
    <div>
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

        <Grid.Column width={10}>
          <Routes>
            <Route path="/docs/:document" element={<Doc />} />
          </Routes>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ExamplesContainer;
