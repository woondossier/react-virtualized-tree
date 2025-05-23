import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

const Home = () => (
  <div>
    <Header as="h2">Introduction</Header>
    <Segment basic>
      <p>
        <strong>react-virtualized-tree</strong> is a React library built on top of{' '}
        <a href="https://bvaughn.github.io/react-virtualized/#/components/List" target="_blank" rel="noreferrer">
          react-virtualized
        </a>.
      </p>
      <p>Its main goal is to display tree-like data in a beautiful and fast way.</p>
      <p>
        Being a reactive library, it uses function-as-children to achieve maximum extensibility.
      </p>
      <p>
        The core idea is that anyone using it can create a tree as they wish by rendering their own components or using
        those exported by the library.
      </p>
    </Segment>

    <Header as="h2">Installation</Header>
    <Segment basic>
      <p>You can install via npm or yarn:</p>
      <Segment compact>
        <code>npm i react-virtualized-tree --save</code>
      </Segment>
      <Segment compact>
        <code>yarn add react-virtualized-tree</code>
      </Segment>

      <p>To get the basic styles for free, you need to import react-virtualized styles once:</p>
      <Segment compact>
        <code>import 'react-virtualized/styles.css'</code>
      </Segment>
      <Segment compact>
        <code>import 'react-virtualized-tree/lib/main.css'</code>
      </Segment>

      <p>If you want to use the icons in the default renderers, also import material icons:</p>
      <Segment compact>
        <code>import 'material-icons/css/material-icons.css'</code>
      </Segment>
    </Segment>

    <Header as="h2">Dependencies</Header>
    <Segment basic>
      <p>
        Most dependencies are managed internally. The only required peer dependencies are{' '}
        <strong>react</strong>, <strong>react-dom</strong>, and <strong>react-virtualized</strong>.
      </p>
    </Segment>
  </div>
);

export default Home;