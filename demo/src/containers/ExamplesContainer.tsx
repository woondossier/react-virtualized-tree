import React from 'react';
import { Grid, Menu, Segment, Header } from 'semantic-ui-react';
import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom';

import examples from '../examples';
import { getExamplePath } from '../toolbelt';
import './ExamplesContainer.css';

const ExampleView: React.FC = () => {
  const { example } = useParams<{ example: string }>();
  const selectedExample = example ? examples[example] : undefined;

  if (!selectedExample) {
    return <Segment>Example not found: {example}</Segment>;
  }

  const { component: Component, name, description, fileName } = selectedExample;

  return (
    <div>
      <span className="jump-to-source">
        <a href={getExamplePath(fileName)} target="_blank" rel="noreferrer">
          Jump to source
        </a>
      </span>
      <Header as="h1">{name}</Header>
      {description && <Segment>{description}</Segment>}
      <div style={{ height: 500 }}>
        <Component />
      </div>
    </div>
  );
};

const ExamplesContainer: React.FC = () => {
  const location = useLocation();

  return (
    <Grid>
      <Grid.Column width={4}>
        <Menu fluid vertical tabular>
          {Object.keys(examples).map((path) => (
            <Link to={`/examples/${path}`} key={path}>
              <Menu.Item
                name={examples[path].name}
                active={location.pathname === `/examples/${path}`}
              />
            </Link>
          ))}
        </Menu>
      </Grid.Column>

      <Grid.Column width={12}>
        <Routes>
          <Route path=":example" element={<ExampleView />} />
        </Routes>
      </Grid.Column>
    </Grid>
  );
};

export default ExamplesContainer;
